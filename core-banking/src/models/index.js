const { Sequelize } = require('sequelize');
const { logger } = require('../utils/logger');

// Database configuration
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? logger.info : false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Import models
const Account = require('./Account');
const Transaction = require('./Transaction');
const Balance = require('./Balance');
const LedgerEntry = require('./LedgerEntry');
const Customer = require('./Customer');
const BankBranch = require('./BankBranch');
const Currency = require('./Currency');
const AccountType = require('./AccountType');

// Define associations
const defineAssociations = () => {
  // Account associations
  Account.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
  Account.belongsTo(BankBranch, { foreignKey: 'branchId', as: 'branch' });
  Account.belongsTo(AccountType, { foreignKey: 'accountTypeId', as: 'accountType' });
  Account.belongsTo(Currency, { foreignKey: 'currencyId', as: 'currency' });
  Account.hasMany(Transaction, { foreignKey: 'accountId', as: 'transactions' });
  Account.hasMany(Balance, { foreignKey: 'accountId', as: 'balances' });
  Account.hasMany(LedgerEntry, { foreignKey: 'accountId', as: 'ledgerEntries' });

  // Transaction associations
  Transaction.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
  Transaction.belongsTo(Account, { foreignKey: 'counterpartyAccountId', as: 'counterpartyAccount' });
  Transaction.belongsTo(Currency, { foreignKey: 'currencyId', as: 'currency' });

  // Balance associations
  Balance.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
  Balance.belongsTo(Currency, { foreignKey: 'currencyId', as: 'currency' });

  // LedgerEntry associations
  LedgerEntry.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
  LedgerEntry.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });

  // Customer associations
  Customer.hasMany(Account, { foreignKey: 'customerId', as: 'accounts' });

  // BankBranch associations
  BankBranch.hasMany(Account, { foreignKey: 'branchId', as: 'accounts' });

  // Currency associations
  Currency.hasMany(Account, { foreignKey: 'currencyId', as: 'accounts' });
  Currency.hasMany(Transaction, { foreignKey: 'currencyId', as: 'transactions' });
  Currency.hasMany(Balance, { foreignKey: 'currencyId', as: 'balances' });

  // AccountType associations
  AccountType.hasMany(Account, { foreignKey: 'accountTypeId', as: 'accounts' });
};

// Initialize models
const initializeModels = async () => {
  try {
    defineAssociations();
    logger.info('Database models initialized successfully');
  } catch (error) {
    logger.error('Error initializing models:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Account,
  Transaction,
  Balance,
  LedgerEntry,
  Customer,
  BankBranch,
  Currency,
  AccountType,
  initializeModels
};
