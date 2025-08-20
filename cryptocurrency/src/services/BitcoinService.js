const BitcoinCore = require('bitcoin-core');
const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');
const bip32 = require('bip32');
const bip39 = require('bip39');
const { logger } = require('../utils/logger');
const { CryptoWallet } = require('../models');
const { redis } = require('../utils/redis');

const ECPair = ECPairFactory(ecc);

class BitcoinService {
  constructor() {
    this.client = new BitcoinCore({
      network: process.env.BITCOIN_NETWORK || 'mainnet',
      username: process.env.BITCOIN_RPC_USER,
      password: process.env.BITCOIN_RPC_PASSWORD,
      port: process.env.BITCOIN_RPC_PORT || 8332,
      host: process.env.BITCOIN_RPC_HOST || 'localhost'
    });
    
    this.network = process.env.BITCOIN_NETWORK === 'testnet' ? 
      bitcoin.networks.testnet : bitcoin.networks.bitcoin;
    
    this.logger = logger;
  }

  /**
   * Initialize Bitcoin service
   */
  async initialize() {
    try {
      // Test connection to Bitcoin Core
      const info = await this.client.getBlockchainInfo();
      this.logger.info(`Bitcoin Core connected. Network: ${info.chain}, Blocks: ${info.blocks}`);
      
      // Start monitoring
      this.startMonitoring();
      
      return true;
    } catch (error) {
      this.logger.error('Failed to initialize Bitcoin service:', error);
      throw error;
    }
  }

  /**
   * Create a new Bitcoin wallet
   */
  async createWallet(walletData) {
    try {
      const {
        customerId,
        accountId,
        walletName,
        description,
        network = 'mainnet',
        walletType = 'hot',
        isMultiSig = false,
        requiredSignatures = 1,
        totalSignatures = 1
      } = walletData;

      // Generate mnemonic phrase
      const mnemonic = bip39.generateMnemonic(256); // 24 words
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      
      // Create HD wallet
      const root = bip32.fromSeed(seed, this.network);
      const derivationPath = "m/44'/0'/0'";
      const account = root.derivePath(derivationPath);
      
      // Generate first address
      const child = account.derive(0);
      const { address } = bitcoin.payments.p2pkh({
        pubkey: child.publicKey,
        network: this.network
      });

      // Encrypt sensitive data
      const encryptedSeedPhrase = await this.encryptData(mnemonic);
      const encryptedPrivateKeys = await this.encryptPrivateKeys([child.toWIF()]);

      // Create wallet record
      const wallet = await CryptoWallet.create({
        customerId,
        accountId,
        cryptocurrency: 'bitcoin',
        network,
        walletType,
        walletName,
        description,
        encryptedSeedPhrase,
        encryptedPrivateKeys,
        addresses: [address],
        derivationPath,
        addressIndex: 0,
        isMultiSig,
        requiredSignatures,
        totalSignatures,
        createdBy: customerId,
        updatedBy: customerId
      });

      this.logger.info(`Bitcoin wallet created: ${wallet.walletId}`);
      return wallet;

    } catch (error) {
      this.logger.error('Error creating Bitcoin wallet:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(walletId) {
    try {
      const wallet = await CryptoWallet.findByWalletId(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Get addresses from wallet
      const addresses = wallet.addresses || [];
      
      // Get balance for each address
      let confirmedBalance = 0;
      let unconfirmedBalance = 0;

      for (const address of addresses) {
        try {
          const balance = await this.client.getReceivedByAddress(address);
          confirmedBalance += balance.confirmed || 0;
          unconfirmedBalance += balance.unconfirmed || 0;
        } catch (error) {
          this.logger.warn(`Error getting balance for address ${address}:`, error);
        }
      }

      // Update wallet balance
      await wallet.updateBalance(confirmedBalance, unconfirmedBalance);

      return {
        confirmed: confirmedBalance,
        unconfirmed: unconfirmedBalance,
        total: confirmedBalance + unconfirmedBalance
      };

    } catch (error) {
      this.logger.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  /**
   * Generate new address for wallet
   */
  async generateNewAddress(walletId) {
    try {
      const wallet = await CryptoWallet.findByWalletId(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Decrypt seed phrase
      const seedPhrase = await this.decryptData(wallet.encryptedSeedPhrase);
      const seed = bip39.mnemonicToSeedSync(seedPhrase);
      
      // Recreate HD wallet
      const root = bip32.fromSeed(seed, this.network);
      const account = root.derivePath(wallet.derivationPath);
      
      // Generate next address
      const nextIndex = wallet.addressIndex + 1;
      const child = account.derive(nextIndex);
      const { address } = bitcoin.payments.p2pkh({
        pubkey: child.publicKey,
        network: this.network
      });

      // Update wallet
      wallet.addressIndex = nextIndex;
      wallet.addresses = [...(wallet.addresses || []), address];
      
      // Encrypt and store new private key
      const privateKeys = wallet.encryptedPrivateKeys || [];
      const encryptedPrivateKey = await this.encryptData(child.toWIF());
      privateKeys.push(encryptedPrivateKey);
      wallet.encryptedPrivateKeys = privateKeys;

      await wallet.save();

      this.logger.info(`New Bitcoin address generated for wallet ${walletId}: ${address}`);
      return address;

    } catch (error) {
      this.logger.error('Error generating new address:', error);
      throw error;
    }
  }

  /**
   * Send Bitcoin transaction
   */
  async sendTransaction(walletId, toAddress, amount, feeRate = 'medium') {
    try {
      const wallet = await CryptoWallet.findByWalletId(walletId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Validate amount
      if (amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Check wallet balance
      const balance = await this.getWalletBalance(walletId);
      if (balance.total < amount) {
        throw new Error('Insufficient balance');
      }

      // Get UTXOs for wallet addresses
      const utxos = await this.getWalletUTXOs(wallet);
      
      // Create transaction
      const transaction = await this.createTransaction(
        wallet,
        toAddress,
        amount,
        utxos,
        feeRate
      );

      // Sign transaction
      const signedTransaction = await this.signTransaction(wallet, transaction);

      // Broadcast transaction
      const txid = await this.broadcastTransaction(signedTransaction);

      this.logger.info(`Bitcoin transaction sent: ${txid}`);
      return {
        txid,
        amount,
        fee: transaction.fee,
        toAddress,
        status: 'pending'
      };

    } catch (error) {
      this.logger.error('Error sending Bitcoin transaction:', error);
      throw error;
    }
  }

  /**
   * Get wallet UTXOs
   */
  async getWalletUTXOs(wallet) {
    try {
      const addresses = wallet.addresses || [];
      const utxos = [];

      for (const address of addresses) {
        try {
          const addressUtxos = await this.client.listUnspent(0, 999999, [address]);
          utxos.push(...addressUtxos);
        } catch (error) {
          this.logger.warn(`Error getting UTXOs for address ${address}:`, error);
        }
      }

      return utxos;
    } catch (error) {
      this.logger.error('Error getting wallet UTXOs:', error);
      throw error;
    }
  }

  /**
   * Create Bitcoin transaction
   */
  async createTransaction(wallet, toAddress, amount, utxos, feeRate) {
    try {
      // Sort UTXOs by value (largest first)
      utxos.sort((a, b) => b.amount - a.amount);

      let totalInput = 0;
      const selectedUtxos = [];
      const fee = this.calculateFee(feeRate);

      // Select UTXOs to cover amount + fee
      for (const utxo of utxos) {
        if (totalInput >= amount + fee) break;
        selectedUtxos.push(utxo);
        totalInput += utxo.amount;
      }

      if (totalInput < amount + fee) {
        throw new Error('Insufficient UTXOs to cover amount and fee');
      }

      // Create transaction
      const psbt = new bitcoin.Psbt({ network: this.network });

      // Add inputs
      for (const utxo of selectedUtxos) {
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          value: utxo.amount * 100000000 // Convert to satoshis
        });
      }

      // Add outputs
      psbt.addOutput({
        address: toAddress,
        value: Math.floor(amount * 100000000) // Convert to satoshis
      });

      // Add change output if needed
      const change = totalInput - amount - fee;
      if (change > 546) { // Dust threshold
        const changeAddress = wallet.addresses[0]; // Use first address as change
        psbt.addOutput({
          address: changeAddress,
          value: Math.floor(change * 100000000)
        });
      }

      return {
        psbt,
        fee,
        selectedUtxos,
        change
      };

    } catch (error) {
      this.logger.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Sign transaction
   */
  async signTransaction(wallet, transaction) {
    try {
      const { psbt, selectedUtxos } = transaction;

      // Decrypt private keys
      const privateKeys = [];
      for (const encryptedKey of wallet.encryptedPrivateKeys) {
        const privateKey = await this.decryptData(encryptedKey);
        privateKeys.push(privateKey);
      }

      // Sign each input
      for (let i = 0; i < selectedUtxos.length; i++) {
        const utxo = selectedUtxos[i];
        const privateKey = privateKeys[i];
        
        const keyPair = ECPair.fromWIF(privateKey, this.network);
        psbt.signInput(i, keyPair);
      }

      // Finalize and extract transaction
      psbt.finalizeAllInputs();
      return psbt.extractTransaction().toHex();

    } catch (error) {
      this.logger.error('Error signing transaction:', error);
      throw error;
    }
  }

  /**
   * Broadcast transaction
   */
  async broadcastTransaction(hexTransaction) {
    try {
      const txid = await this.client.sendRawTransaction(hexTransaction);
      return txid;
    } catch (error) {
      this.logger.error('Error broadcasting transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(txid) {
    try {
      const transaction = await this.client.getRawTransaction(txid, true);
      return transaction;
    } catch (error) {
      this.logger.error('Error getting transaction:', error);
      throw error;
    }
  }

  /**
   * Calculate transaction fee
   */
  calculateFee(feeRate) {
    const feeRates = {
      low: 0.00001,      // 1 sat/byte
      medium: 0.00005,   // 5 sat/byte
      high: 0.0001       // 10 sat/byte
    };
    
    return feeRates[feeRate] || feeRates.medium;
  }

  /**
   * Encrypt sensitive data
   */
  async encryptData(data) {
    // In production, use proper encryption with environment variables
    const crypto = require('crypto');
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt sensitive data
   */
  async decryptData(encryptedData) {
    const crypto = require('crypto');
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
    
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Encrypt private keys
   */
  async encryptPrivateKeys(privateKeys) {
    const encryptedKeys = [];
    for (const privateKey of privateKeys) {
      const encrypted = await this.encryptData(privateKey);
      encryptedKeys.push(encrypted);
    }
    return encryptedKeys;
  }

  /**
   * Start monitoring for new transactions
   */
  startMonitoring() {
    // Monitor for new blocks
    setInterval(async () => {
      try {
        await this.syncWallets();
      } catch (error) {
        this.logger.error('Error syncing wallets:', error);
      }
    }, 60000); // Every minute

    // Monitor for new transactions
    setInterval(async () => {
      try {
        await this.checkPendingTransactions();
      } catch (error) {
        this.logger.error('Error checking pending transactions:', error);
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Sync all active wallets
   */
  async syncWallets() {
    try {
      const wallets = await CryptoWallet.findActive();
      
      for (const wallet of wallets) {
        try {
          await this.getWalletBalance(wallet.walletId);
        } catch (error) {
          this.logger.error(`Error syncing wallet ${wallet.walletId}:`, error);
        }
      }
    } catch (error) {
      this.logger.error('Error syncing wallets:', error);
    }
  }

  /**
   * Check pending transactions
   */
  async checkPendingTransactions() {
    // Implementation for checking transaction confirmations
    // This would update transaction status based on confirmations
  }
}

module.exports = new BitcoinService();
