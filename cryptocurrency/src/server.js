const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('express-async-errors');

const app = express();
const PORT = process.env.CRYPTO_PORT || 3002;

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
      title: 'Cryptocurrency API',
      version: '1.0.0',
      description: 'API per la gestione di wallet Bitcoin e criptovalute',
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
    service: 'cryptocurrency',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mock API routes
app.get('/api/v1/crypto/wallets', (req, res) => {
  const mockWallets = [
    {
      id: '1',
      walletId: 'btc-wallet-001',
      name: 'Bitcoin Wallet',
      cryptocurrency: 'BTC',
      network: 'mainnet',
      balance: 0.5,
      confirmedBalance: 0.5,
      unconfirmedBalance: 0,
      fiatBalance: 15000,
      fiatCurrency: 'EUR',
      exchangeRate: 30000,
      status: 'active',
      addresses: ['bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'],
      lastSyncDate: new Date(),
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      walletId: 'eth-wallet-001',
      name: 'Ethereum Wallet',
      cryptocurrency: 'ETH',
      network: 'mainnet',
      balance: 2.5,
      confirmedBalance: 2.5,
      unconfirmedBalance: 0,
      fiatBalance: 5000,
      fiatCurrency: 'EUR',
      exchangeRate: 2000,
      status: 'active',
      addresses: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'],
      lastSyncDate: new Date(),
      createdAt: new Date('2024-01-15')
    }
  ];
  
  res.json(mockWallets);
});

app.get('/api/v1/crypto/prices', (req, res) => {
  const mockPrices = [
    {
      symbol: 'BTC',
      price: 30000,
      change24h: 2.5,
      volume24h: 25000000000,
      marketCap: 580000000000,
      lastUpdated: new Date()
    },
    {
      symbol: 'ETH',
      price: 2000,
      change24h: -1.2,
      volume24h: 15000000000,
      marketCap: 240000000000,
      lastUpdated: new Date()
    }
  ];
  
  res.json(mockPrices);
});

app.get('/api/v1/crypto/transactions', (req, res) => {
  const mockTransactions = [
    {
      id: '1',
      txid: 'abc123def456',
      walletId: 'btc-wallet-001',
      type: 'receive',
      amount: 0.1,
      fee: 0.0001,
      status: 'confirmed',
      confirmations: 6,
      timestamp: new Date('2024-01-15T10:30:00'),
      toAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      fromAddress: 'bc1qabc123def456'
    },
    {
      id: '2',
      txid: 'def456ghi789',
      walletId: 'btc-wallet-001',
      type: 'send',
      amount: 0.05,
      fee: 0.0001,
      status: 'confirmed',
      confirmations: 12,
      timestamp: new Date('2024-01-14T15:45:00'),
      toAddress: 'bc1qxyz789',
      fromAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    }
  ];
  
  res.json(mockTransactions);
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
  console.log(`🚀 Cryptocurrency service running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
