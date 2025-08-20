const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const CryptoWallet = sequelize.define('CryptoWallet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  walletId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Customers',
      key: 'id'
    }
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Accounts',
      key: 'id'
    }
  },
  cryptocurrency: {
    type: DataTypes.ENUM('bitcoin', 'ethereum', 'litecoin', 'bitcoin-cash', 'cardano', 'polkadot'),
    allowNull: false
  },
  network: {
    type: DataTypes.ENUM('mainnet', 'testnet', 'regtest'),
    defaultValue: 'mainnet',
    allowNull: false
  },
  walletType: {
    type: DataTypes.ENUM('hot', 'warm', 'cold', 'hardware'),
    defaultValue: 'hot',
    allowNull: false
  },
  walletName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Encrypted seed phrase (BIP39)
  encryptedSeedPhrase: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Encrypted private keys
  encryptedPrivateKeys: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  // Public keys and addresses
  publicKeys: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  addresses: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  // HD Wallet derivation path
  derivationPath: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // Current address index
  addressIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  // Balance information
  balance: {
    type: DataTypes.DECIMAL(19, 8),
    defaultValue: 0.00000000,
    allowNull: false
  },
  confirmedBalance: {
    type: DataTypes.DECIMAL(19, 8),
    defaultValue: 0.00000000,
    allowNull: false
  },
  unconfirmedBalance: {
    type: DataTypes.DECIMAL(19, 8),
    defaultValue: 0.00000000,
    allowNull: false
  },
  // Fiat equivalent
  fiatBalance: {
    type: DataTypes.DECIMAL(19, 2),
    defaultValue: 0.00,
    allowNull: false
  },
  fiatCurrency: {
    type: DataTypes.STRING(3),
    defaultValue: 'EUR',
    allowNull: false
  },
  // Exchange rate
  exchangeRate: {
    type: DataTypes.DECIMAL(19, 8),
    defaultValue: 0.00000000,
    allowNull: false
  },
  lastExchangeRateUpdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Security settings
  isMultiSig: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  requiredSignatures: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 1,
      max: 15
    }
  },
  totalSignatures: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 1,
      max: 15
    }
  },
  // Lightning Network (for Bitcoin)
  lightningEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  lightningNodeId: {
    type: DataTypes.STRING(66),
    allowNull: true
  },
  lightningChannelCapacity: {
    type: DataTypes.DECIMAL(19, 8),
    defaultValue: 0.00000000,
    allowNull: false
  },
  // Status and flags
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'locked', 'archived'),
    defaultValue: 'active',
    allowNull: false
  },
  isWatchOnly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  isBackedUp: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  backupDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Risk and compliance
  riskLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'low',
    allowNull: false
  },
  kycStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  amlStatus: {
    type: DataTypes.ENUM('clean', 'flagged', 'blocked'),
    defaultValue: 'clean',
    allowNull: false
  },
  // Transaction limits
  dailyLimit: {
    type: DataTypes.DECIMAL(19, 8),
    allowNull: true
  },
  monthlyLimit: {
    type: DataTypes.DECIMAL(19, 8),
    allowNull: true
  },
  // Fees
  withdrawalFee: {
    type: DataTypes.DECIMAL(19, 8),
    defaultValue: 0.00000000,
    allowNull: false
  },
  networkFee: {
    type: DataTypes.DECIMAL(19, 8),
    defaultValue: 0.00000000,
    allowNull: false
  },
  // Metadata
  tags: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  // Timestamps
  lastSyncDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastTransactionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  updatedBy: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'crypto_wallets',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['walletId']
    },
    {
      fields: ['customerId']
    },
    {
      fields: ['accountId']
    },
    {
      fields: ['cryptocurrency']
    },
    {
      fields: ['network']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ],
  hooks: {
    beforeCreate: (wallet) => {
      if (!wallet.walletId) {
        wallet.walletId = generateWalletId();
      }
      
      // Set default derivation path based on cryptocurrency
      if (!wallet.derivationPath) {
        wallet.derivationPath = getDefaultDerivationPath(wallet.cryptocurrency);
      }
      
      // Set default limits based on risk level
      if (!wallet.dailyLimit) {
        wallet.dailyLimit = getDefaultDailyLimit(wallet.riskLevel, wallet.cryptocurrency);
      }
      
      if (!wallet.monthlyLimit) {
        wallet.monthlyLimit = getDefaultMonthlyLimit(wallet.riskLevel, wallet.cryptocurrency);
      }
    },
    beforeUpdate: (wallet) => {
      // Update fiat balance when exchange rate or balance changes
      if (wallet.changed('balance') || wallet.changed('exchangeRate')) {
        wallet.fiatBalance = parseFloat(wallet.balance) * parseFloat(wallet.exchangeRate);
      }
    }
  }
});

// Helper functions
function generateWalletId() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WLT${timestamp}${random}`;
}

function getDefaultDerivationPath(cryptocurrency) {
  const paths = {
    bitcoin: "m/44'/0'/0'",
    ethereum: "m/44'/60'/0'",
    litecoin: "m/44'/2'/0'",
    'bitcoin-cash': "m/44'/145'/0'",
    cardano: "m/1852'/1815'/0'",
    polkadot: "m/44'/354'/0'"
  };
  return paths[cryptocurrency] || "m/44'/0'/0'";
}

function getDefaultDailyLimit(riskLevel, cryptocurrency) {
  const limits = {
    low: {
      bitcoin: 0.1,
      ethereum: 1.0,
      litecoin: 10.0,
      'bitcoin-cash': 1.0,
      cardano: 100.0,
      polkadot: 10.0
    },
    medium: {
      bitcoin: 1.0,
      ethereum: 10.0,
      litecoin: 100.0,
      'bitcoin-cash': 10.0,
      cardano: 1000.0,
      polkadot: 100.0
    },
    high: {
      bitcoin: 10.0,
      ethereum: 100.0,
      litecoin: 1000.0,
      'bitcoin-cash': 100.0,
      cardano: 10000.0,
      polkadot: 1000.0
    }
  };
  return limits[riskLevel]?.[cryptocurrency] || 1.0;
}

function getDefaultMonthlyLimit(riskLevel, cryptocurrency) {
  return getDefaultDailyLimit(riskLevel, cryptocurrency) * 30;
}

// Instance methods
CryptoWallet.prototype.isActive = function() {
  return this.status === 'active';
};

CryptoWallet.prototype.isLocked = function() {
  return this.status === 'locked';
};

CryptoWallet.prototype.canWithdraw = function(amount) {
  if (this.isLocked()) return false;
  if (this.balance < amount) return false;
  return true;
};

CryptoWallet.prototype.updateBalance = function(confirmed, unconfirmed = 0) {
  this.confirmedBalance = confirmed;
  this.unconfirmedBalance = unconfirmed;
  this.balance = parseFloat(confirmed) + parseFloat(unconfirmed);
  this.lastSyncDate = new Date();
  
  // Update fiat balance
  this.fiatBalance = parseFloat(this.balance) * parseFloat(this.exchangeRate);
  
  return this.save();
};

CryptoWallet.prototype.updateExchangeRate = function(rate) {
  this.exchangeRate = rate;
  this.lastExchangeRateUpdate = new Date();
  this.fiatBalance = parseFloat(this.balance) * parseFloat(rate);
  
  return this.save();
};

CryptoWallet.prototype.generateNewAddress = function() {
  // This would integrate with the actual blockchain service
  this.addressIndex += 1;
  return this.save();
};

CryptoWallet.prototype.getNextAddress = function() {
  // Return the next address in the sequence
  return this.addresses?.[this.addressIndex] || null;
};

// Class methods
CryptoWallet.findByWalletId = function(walletId) {
  return this.findOne({
    where: { walletId },
    include: [
      { model: sequelize.models.Customer, as: 'customer' },
      { model: sequelize.models.Account, as: 'account' }
    ]
  });
};

CryptoWallet.findByCustomer = function(customerId) {
  return this.findAll({
    where: { customerId },
    order: [['createdAt', 'DESC']]
  });
};

CryptoWallet.findByAccount = function(accountId) {
  return this.findAll({
    where: { accountId },
    order: [['createdAt', 'DESC']]
  });
};

CryptoWallet.findByCryptocurrency = function(cryptocurrency, network = 'mainnet') {
  return this.findAll({
    where: { cryptocurrency, network },
    order: [['createdAt', 'DESC']]
  });
};

CryptoWallet.findActive = function() {
  return this.findAll({
    where: { status: 'active' },
    order: [['lastSyncDate', 'ASC']]
  });
};

module.exports = CryptoWallet;
