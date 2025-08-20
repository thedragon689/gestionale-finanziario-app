require('express-async-errors');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.CORE_BANKING_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Core Banking API',
      version: '1.0.0',
      description: 'API per la gestione di conti bancari e transazioni',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'core-banking',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mock API routes
app.get('/api/v1/accounts', (req, res) => {
  const mockAccounts = [
    {
      id: '1',
      accountNumber: 'IT123456789',
      iban: 'IT60X0542811101000000123456',
      customerId: 'customer1',
      balance: 50000.00,
      availableBalance: 48000.00,
      currency: 'EUR',
      status: 'active',
      accountType: 'checking',
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      accountNumber: 'IT987654321',
      iban: 'IT60X0542811101000000987654',
      customerId: 'customer1',
      balance: 125000.00,
      availableBalance: 120000.00,
      currency: 'EUR',
      status: 'active',
      accountType: 'savings',
      createdAt: new Date('2024-01-15')
    }
  ];
  
  res.json(mockAccounts);
});

app.get('/api/v1/transactions', (req, res) => {
  const mockTransactions = [
    {
      id: '1',
      accountId: '1',
      type: 'transfer',
      amount: 5000.00,
      currency: 'EUR',
      description: 'Transfer to Account IT987654321',
      status: 'completed',
      timestamp: new Date('2024-01-15T10:30:00'),
      reference: 'TXN123456789',
      counterparty: {
        name: 'Mario Rossi',
        iban: 'IT60X0542811101000000987654',
      }
    },
    {
      id: '2',
      accountId: '1',
      type: 'deposit',
      amount: 10000.00,
      currency: 'EUR',
      description: 'Salary deposit',
      status: 'completed',
      timestamp: new Date('2024-01-14T09:15:00'),
      reference: 'TXN987654321'
    },
    {
      id: '3',
      accountId: '1',
      type: 'payment',
      amount: -250.00,
      currency: 'EUR',
      description: 'Utility bill payment',
      status: 'pending',
      timestamp: new Date('2024-01-15T14:20:00'),
      reference: 'TXN456789123'
    }
  ];
  
  res.json(mockTransactions);
});

app.get('/api/v1/balances', (req, res) => {
  const mockBalances = [
    {
      accountId: '1',
      balance: 50000.00,
      availableBalance: 48000.00,
      currency: 'EUR',
      lastUpdate: new Date()
    },
    {
      accountId: '2',
      balance: 125000.00,
      availableBalance: 120000.00,
      currency: 'EUR',
      lastUpdate: new Date()
    }
  ];
  
  res.json(mockBalances);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏦 Core Banking service running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
