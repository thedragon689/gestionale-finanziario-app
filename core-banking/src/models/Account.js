const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const { v4: uuidv4 } = require('uuid');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  accountNumber: {
    type: DataTypes.STRING(34),
    allowNull: false,
    unique: true,
    validate: {
      len: [8, 34]
    }
  },
  iban: {
    type: DataTypes.STRING(34),
    allowNull: false,
    unique: true,
    validate: {
      len: [15, 34]
    }
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Customers',
      key: 'id'
    }
  },
  branchId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'BankBranches',
      key: 'id'
    }
  },
  accountTypeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'AccountTypes',
      key: 'id'
    }
  },
  currencyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Currencies',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'closed', 'frozen'),
    defaultValue: 'active',
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(19, 4),
    defaultValue: 0.0000,
    allowNull: false,
    validate: {
      min: -999999999999999.9999,
      max: 999999999999999.9999
    }
  },
  availableBalance: {
    type: DataTypes.DECIMAL(19, 4),
    defaultValue: 0.0000,
    allowNull: false,
    validate: {
      min: -999999999999999.9999,
      max: 999999999999999.9999
    }
  },
  blockedAmount: {
    type: DataTypes.DECIMAL(19, 4),
    defaultValue: 0.0000,
    allowNull: false,
    validate: {
      min: 0,
      max: 999999999999999.9999
    }
  },
  overdraftLimit: {
    type: DataTypes.DECIMAL(19, 4),
    defaultValue: 0.0000,
    allowNull: false,
    validate: {
      min: 0,
      max: 999999999999999.9999
    }
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0.0000,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  monthlyFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: false,
    validate: {
      min: 0,
      max: 99999999.99
    }
  },
  lastTransactionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  openingDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  closingDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isJointAccount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  jointAccountHolders: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  accountAlias: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
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
  tableName: 'accounts',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['accountNumber']
    },
    {
      unique: true,
      fields: ['iban']
    },
    {
      fields: ['customerId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['accountTypeId']
    },
    {
      fields: ['currencyId']
    },
    {
      fields: ['createdAt']
    }
  ],
  hooks: {
    beforeCreate: (account) => {
      if (!account.accountNumber) {
        account.accountNumber = generateAccountNumber();
      }
      if (!account.iban) {
        account.iban = generateIBAN(account.accountNumber);
      }
    },
    beforeUpdate: (account) => {
      // Update available balance based on balance and blocked amount
      account.availableBalance = parseFloat(account.balance) - parseFloat(account.blockedAmount);
    }
  }
});

// Helper functions
function generateAccountNumber() {
  // Generate a unique account number
  const prefix = 'IT';
  const random = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
  return `${prefix}${random}`;
}

function generateIBAN(accountNumber) {
  // Generate IBAN from account number (simplified)
  const countryCode = 'IT';
  const checkDigits = '00';
  const bankCode = '12345';
  const branchCode = '12345';
  const accountCode = accountNumber.slice(-12);
  
  return `${countryCode}${checkDigits}${bankCode}${branchCode}${accountCode}`;
}

// Instance methods
Account.prototype.isActive = function() {
  return this.status === 'active';
};

Account.prototype.canWithdraw = function(amount) {
  return this.availableBalance >= amount;
};

Account.prototype.canOverdraft = function(amount) {
  return (this.balance - amount) >= -this.overdraftLimit;
};

Account.prototype.updateBalance = function(amount, type = 'credit') {
  const currentBalance = parseFloat(this.balance);
  const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount;
  
  this.balance = newBalance;
  this.availableBalance = newBalance - parseFloat(this.blockedAmount);
  this.lastTransactionDate = new Date();
  
  return this.save();
};

Account.prototype.blockAmount = function(amount) {
  this.blockedAmount = parseFloat(this.blockedAmount) + amount;
  this.availableBalance = parseFloat(this.balance) - parseFloat(this.blockedAmount);
  return this.save();
};

Account.prototype.unblockAmount = function(amount) {
  this.blockedAmount = Math.max(0, parseFloat(this.blockedAmount) - amount);
  this.availableBalance = parseFloat(this.balance) - parseFloat(this.blockedAmount);
  return this.save();
};

// Class methods
Account.findByAccountNumber = function(accountNumber) {
  return this.findOne({
    where: { accountNumber },
    include: [
      { model: sequelize.models.Customer, as: 'customer' },
      { model: sequelize.models.Currency, as: 'currency' },
      { model: sequelize.models.AccountType, as: 'accountType' }
    ]
  });
};

Account.findByIBAN = function(iban) {
  return this.findOne({
    where: { iban },
    include: [
      { model: sequelize.models.Customer, as: 'customer' },
      { model: sequelize.models.Currency, as: 'currency' }
    ]
  });
};

Account.findByCustomer = function(customerId) {
  return this.findAll({
    where: { customerId },
    include: [
      { model: sequelize.models.Currency, as: 'currency' },
      { model: sequelize.models.AccountType, as: 'accountType' }
    ],
    order: [['createdAt', 'DESC']]
  });
};

module.exports = Account;
