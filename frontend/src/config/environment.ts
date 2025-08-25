// Configurazione ambiente
export const ENV_CONFIG = {
  // Ambiente
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // API Endpoints
  CORE_BANKING_URL: process.env.REACT_APP_CORE_BANKING_URL || 'http://localhost:3001',
  CRYPTO_URL: process.env.REACT_APP_CRYPTO_URL || 'http://localhost:3002',
  
  // Chatbot Configuration
  CHATBOT_ENABLED: process.env.REACT_APP_CHATBOT_ENABLED === 'true',
  CHATBOT_DEBUG: process.env.REACT_APP_CHATBOT_DEBUG === 'true',
  
  // Feature Flags
  AI_FEATURES_ENABLED: process.env.REACT_APP_AI_FEATURES_ENABLED !== 'false',
  CRYPTO_FEATURES_ENABLED: process.env.REACT_APP_CRYPTO_FEATURES_ENABLED !== 'false',
  
  // Performance
  API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  MAX_RETRIES: parseInt(process.env.REACT_APP_MAX_RETRIES || '3'),
  
  // Debug
  ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === 'true',
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
};

// Configurazione API
export const API_CONFIG = {
  // Core Banking
  CORE_BANKING: {
    BASE_URL: ENV_CONFIG.CORE_BANKING_URL,
    ENDPOINTS: {
      HEALTH: '/health',
      ACCOUNTS: '/api/v1/accounts',
      TRANSACTIONS: '/api/v1/transactions',
      CHATBOT: '/ai/chatbot',
    },
  },
  
  // Crypto
  CRYPTO: {
    BASE_URL: ENV_CONFIG.CRYPTO_URL,
    ENDPOINTS: {
      HEALTH: '/health',
      WALLETS: '/api/v1/wallets',
      TRANSACTIONS: '/api/v1/transactions',
    },
  },
  
  // Timeout e retry
  TIMEOUT: ENV_CONFIG.API_TIMEOUT,
  MAX_RETRIES: ENV_CONFIG.MAX_RETRIES,
  RETRY_DELAY: 1000,
};

// Configurazione Chatbot
export const CHATBOT_CONFIG = {
  ENABLED: ENV_CONFIG.CHATBOT_ENABLED,
  DEBUG: ENV_CONFIG.CHATBOT_DEBUG,
  FALLBACK_ENABLED: true,
  MIN_INTENT_CONFIDENCE: 0.6,
  API_TIMEOUT: 10000,
  QUICK_REPLIES: {
    ENABLE: true,
    MAX_COUNT: 8,
  },
};

// Configurazione UI
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#1976d2',
    SECONDARY_COLOR: '#dc004e',
    BACKGROUND_COLOR: '#f5f5f5',
  },
  LAYOUT: {
    SIDEBAR_WIDTH: 240,
    HEADER_HEIGHT: 64,
    CONTAINER_MAX_WIDTH: 1200,
  },
  RESPONSIVE: {
    MOBILE_BREAKPOINT: 600,
    TABLET_BREAKPOINT: 960,
    DESKTOP_BREAKPOINT: 1280,
  },
};

// Configurazione Logging
export const LOG_CONFIG = {
  ENABLED: ENV_CONFIG.ENABLE_LOGS,
  LEVEL: ENV_CONFIG.LOG_LEVEL,
  PREFIXES: {
    API: '🌐 [API]',
    CHATBOT: '🤖 [Chatbot]',
    UI: '🎨 [UI]',
    ERROR: '❌ [Error]',
    WARNING: '⚠️ [Warning]',
    INFO: 'ℹ️ [Info]',
    DEBUG: '🔍 [Debug]',
  },
};

// Utility per logging
export const logger = {
  log: (level: keyof typeof LOG_CONFIG.PREFIXES, message: string, ...args: any[]) => {
    if (LOG_CONFIG.ENABLED) {
      const prefix = LOG_CONFIG.PREFIXES[level];
      console.log(`${prefix} ${message}`, ...args);
    }
  },
  
  api: (message: string, ...args: any[]) => logger.log('API', message, ...args),
  chatbot: (message: string, ...args: any[]) => logger.log('CHATBOT', message, ...args),
  ui: (message: string, ...args: any[]) => logger.log('UI', message, ...args),
  error: (message: string, ...args: any[]) => logger.log('ERROR', message, ...args),
  warning: (message: string, ...args: any[]) => logger.log('WARNING', message, ...args),
  info: (message: string, ...args: any[]) => logger.log('INFO', message, ...args),
  debug: (message: string, ...args: any[]) => logger.log('DEBUG', message, ...args),
};

// Esporta configurazione completa
export default {
  ENV: ENV_CONFIG,
  API: API_CONFIG,
  CHATBOT: CHATBOT_CONFIG,
  UI: UI_CONFIG,
  LOG: LOG_CONFIG,
  logger,
};
