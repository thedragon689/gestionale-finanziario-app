import { api } from './api';

export interface CryptoWallet {
  id: string;
  name: string;
  type: 'bitcoin' | 'ethereum' | 'cardano' | 'polkadot';
  address: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  lastSync: Date;
}

export interface CryptoTransaction {
  id: string;
  walletId: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  timestamp: Date;
  fee: number;
  toAddress?: string;
  fromAddress?: string;
}

export interface CreateWalletRequest {
  name: string;
  type: 'bitcoin' | 'ethereum' | 'cardano' | 'polkadot';
}

export interface SendCryptoRequest {
  walletId: string;
  toAddress: string;
  amount: number;
  fee?: number;
}

class CryptoService {
  // Get all crypto wallets
  async getWallets(): Promise<CryptoWallet[]> {
    try {
      // Mock data for now
      const mockWallets: CryptoWallet[] = [
        {
          id: '1',
          name: 'Bitcoin Wallet',
          type: 'bitcoin',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          balance: 0.5,
          currency: 'BTC',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          lastSync: new Date(),
        },
        {
          id: '2',
          name: 'Ethereum Wallet',
          type: 'ethereum',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          balance: 2.5,
          currency: 'ETH',
          isActive: true,
          createdAt: new Date('2024-01-15'),
          lastSync: new Date(),
        },
      ];
      return mockWallets;
    } catch (error) {
      throw new Error('Failed to fetch wallets');
    }
  }

  // Create a new crypto wallet
  async createWallet(data: CreateWalletRequest): Promise<CryptoWallet> {
    try {
      // Mock implementation
      const newWallet: CryptoWallet = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        address: `mock-address-${Date.now()}`,
        balance: 0,
        currency: data.type.toUpperCase(),
        isActive: true,
        createdAt: new Date(),
        lastSync: new Date(),
      };
      return newWallet;
    } catch (error) {
      throw new Error('Failed to create wallet');
    }
  }

  // Get wallet transactions
  async getWalletTransactions(walletId: string): Promise<CryptoTransaction[]> {
    try {
      // Mock data
      const mockTransactions: CryptoTransaction[] = [
        {
          id: '1',
          walletId,
          type: 'receive',
          amount: 0.1,
          currency: 'BTC',
          status: 'confirmed',
          hash: 'abc123...',
          timestamp: new Date('2024-01-15T10:30:00'),
          fee: 0.0001,
          fromAddress: 'sender-address',
        },
        {
          id: '2',
          walletId,
          type: 'send',
          amount: 0.05,
          currency: 'BTC',
          status: 'confirmed',
          hash: 'def456...',
          timestamp: new Date('2024-01-14T15:20:00'),
          fee: 0.0001,
          toAddress: 'recipient-address',
        },
      ];
      return mockTransactions;
    } catch (error) {
      throw new Error('Failed to fetch transactions');
    }
  }

  // Send cryptocurrency
  async sendCrypto(data: SendCryptoRequest): Promise<CryptoTransaction> {
    try {
      // Mock implementation
      const transaction: CryptoTransaction = {
        id: Date.now().toString(),
        walletId: data.walletId,
        type: 'send',
        amount: data.amount,
        currency: 'BTC',
        status: 'pending',
        hash: `tx-${Date.now()}`,
        timestamp: new Date(),
        fee: data.fee || 0.0001,
        toAddress: data.toAddress,
      };
      return transaction;
    } catch (error) {
      throw new Error('Failed to send cryptocurrency');
    }
  }

  // Get crypto prices
  async getCryptoPrices(): Promise<Record<string, number>> {
    try {
      // Mock prices
      return {
        BTC: 45000,
        ETH: 3000,
        ADA: 1.2,
        DOT: 25,
      };
    } catch (error) {
      throw new Error('Failed to fetch crypto prices');
    }
  }

  // Sync wallet
  async syncWallet(walletId: string): Promise<void> {
    try {
      // Mock sync operation
      console.log(`Syncing wallet ${walletId}`);
    } catch (error) {
      throw new Error('Failed to sync wallet');
    }
  }
}

export const cryptoService = new CryptoService();
