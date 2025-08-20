const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const { v4: uuidv4 } = require('uuid');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transactionId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Accounts',
      key: 'id'
    }
  },
  counterpartyAccountId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Accounts',
      key: 'id'
    }
  },
  transactionType: {
    type: DataTypes.ENUM(
      'deposit',
      'withdrawal',
      'transfer',
      'payment',
      'fee',
      'interest',
      'exchange',
      'refund',
      'chargeback',
      'adjustment'
    ),
    allowNull: false
  },
  direction: {
    type: DataTypes.ENUM('incoming', 'outgoing'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: false,
    validate: {
      min: 0.0001,
      max: 999999999999999.9999
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
  exchangeRate: {
    type: DataTypes.DECIMAL(19, 6),
    defaultValue: 1.000000,
    allowNull: false
  },
  amountInBaseCurrency: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: false
  },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: false
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: false
  },
  netAmount: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'reversed',
      'suspended'
    ),
    defaultValue: 'pending',
    allowNull: false
  },
  executionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  valueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  reference: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  externalReference: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  subcategory: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  recurringId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  isScheduled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal',
    allowNull: false
  },
  channel: {
    type: DataTypes.ENUM(
      'branch',
      'atm',
      'online',
      'mobile',
      'phone',
      'pos',
      'api',
      'batch'
    ),
    allowNull: false
  },
  deviceId: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  riskScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  fraudFlag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  complianceFlag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  manualReview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  reviewedBy: {
    type: DataTypes.UUID,
    allowNull: true
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewNotes: {
    type: DataTypes.TEXT,
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
  tableName: 'transactions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['transactionId']
    },
    {
      fields: ['accountId']
    },
    {
      fields: ['counterpartyAccountId']
    },
    {
      fields: ['transactionType']
    },
    {
      fields: ['status']
    },
    {
      fields: ['executionDate']
    },
    {
      fields: ['valueDate']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['externalReference']
    },
    {
      fields: ['recurringId']
    }
  ],
  hooks: {
    beforeCreate: (transaction) => {
      if (!transaction.transactionId) {
        transaction.transactionId = generateTransactionId();
      }
      
      // Calculate net amount
      transaction.netAmount = parseFloat(transaction.amount) - parseFloat(transaction.fee) - parseFloat(transaction.tax);
      
      // Calculate amount in base currency
      transaction.amountInBaseCurrency = parseFloat(transaction.amount) * parseFloat(transaction.exchangeRate);
    },
    beforeUpdate: (transaction) => {
      // Recalculate net amount if amount, fee, or tax changed
      if (transaction.changed('amount') || transaction.changed('fee') || transaction.changed('tax')) {
        transaction.netAmount = parseFloat(transaction.amount) - parseFloat(transaction.fee) - parseFloat(transaction.tax);
      }
      
      // Recalculate amount in base currency if amount or exchange rate changed
      if (transaction.changed('amount') || transaction.changed('exchangeRate')) {
        transaction.amountInBaseCurrency = parseFloat(transaction.amount) * parseFloat(transaction.exchangeRate);
      }
    }
  }
});

// Helper function to generate transaction ID
function generateTransactionId() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp}${random}`;
}

// Instance methods
Transaction.prototype.isCompleted = function() {
  return this.status === 'completed';
};

Transaction.prototype.isPending = function() {
  return this.status === 'pending' || this.status === 'processing';
};

Transaction.prototype.canBeReversed = function() {
  return this.status === 'completed' && !this.isReversed;
};

Transaction.prototype.isReversed = function() {
  return this.status === 'reversed';
};

Transaction.prototype.getTotalAmount = function() {
  return parseFloat(this.amount) + parseFloat(this.fee) + parseFloat(this.tax);
};

Transaction.prototype.isHighRisk = function() {
  return this.riskScore >= 70;
};

Transaction.prototype.requiresReview = function() {
  return this.manualReview || this.fraudFlag || this.complianceFlag || this.isHighRisk();
};

// Class methods
Transaction.findByTransactionId = function(transactionId) {
  return this.findOne({
    where: { transactionId },
    include: [
      { model: sequelize.models.Account, as: 'account' },
      { model: sequelize.models.Account, as: 'counterpartyAccount' },
      { model: sequelize.models.Currency, as: 'currency' }
    ]
  });
};

Transaction.findByAccount = function(accountId, options = {}) {
  const { limit = 50, offset = 0, status, transactionType, startDate, endDate } = options;
  
  const where = { accountId };
  
  if (status) where.status = status;
  if (transactionType) where.transactionType = transactionType;
  if (startDate || endDate) {
    where.executionDate = {};
    if (startDate) where.executionDate.$gte = startDate;
    if (endDate) where.executionDate.$lte = endDate;
  }
  
  return this.findAndCountAll({
    where,
    include: [
      { model: sequelize.models.Currency, as: 'currency' }
    ],
    order: [['executionDate', 'DESC']],
    limit,
    offset
  });
};

Transaction.findPending = function() {
  return this.findAll({
    where: {
      status: ['pending', 'processing']
    },
    include: [
      { model: sequelize.models.Account, as: 'account' }
    ],
    order: [['createdAt', 'ASC']]
  });
};

Transaction.findHighRisk = function() {
  return this.findAll({
    where: {
      riskScore: {
        [sequelize.Op.gte]: 70
      }
    },
    include: [
      { model: sequelize.models.Account, as: 'account' }
    ],
    order: [['createdAt', 'DESC']]
  });
};

Transaction.getDailySummary = function(accountId, date) {
  return this.findAll({
    where: {
      accountId,
      executionDate: {
        [sequelize.Op.between]: [
          new Date(date.setHours(0, 0, 0, 0)),
          new Date(date.setHours(23, 59, 59, 999))
        ]
      }
    },
    attributes: [
      'transactionType',
      'direction',
      [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['transactionType', 'direction']
  });
};

module.exports = Transaction;
