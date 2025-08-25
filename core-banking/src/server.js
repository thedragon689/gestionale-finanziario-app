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
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

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

// Routes
app.use('/api/v1/accounts', require('./routes/accounts'));
app.use('/api/v1/transactions', require('./routes/transactions'));
app.use('/ai/chatbot', require('./routes/aiChatbot'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'core-banking',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Favicon endpoint
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content for favicon
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Core Banking server running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
  console.log(`🤖 AI Chatbot available at http://localhost:${PORT}/ai/chatbot`);
});

module.exports = app;
