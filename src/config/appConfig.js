// Application Configuration
// Centralized configuration management for production deployment

// Validate required environment variables
const requiredEnvVars = [
  'VITE_APPWRITE_ENDPOINT',
  'VITE_APPWRITE_PROJECT_ID',
  'VITE_APPWRITE_DATABASE_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0 && import.meta.env.PROD) {
  console.error('Missing required environment variables:', missingVars);
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// App Configuration
export const appConfig = {
  // App Info
  name: import.meta.env.VITE_APP_NAME || 'ETF Dividend Tracker',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_NODE_ENV || 'development',
  
  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    errorReporting: import.meta.env.VITE_SENTRY_DSN !== undefined,
    realTimeUpdates: true,
    portfolioSync: true,
    notifications: true
  },
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },
  
  // Data Refresh Configuration
  dataRefresh: {
    cooldownHours: 24,
    autoRefreshOnLoad: true,
    maxRetries: 3
  },
  
  // UI Configuration
  ui: {
    theme: {
      default: 'light',
      storageKey: 'etf-tracker-theme'
    },
    pagination: {
      defaultPageSize: 20,
      maxPageSize: 100
    },
    charts: {
      animationDuration: 300,
      colors: {
        primary: '#3B82F6',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    }
  },
  
  // Cache Configuration
  cache: {
    etfDataTTL: 24 * 60 * 60 * 1000, // 24 hours
    portfolioDataTTL: 60 * 60 * 1000, // 1 hour
    userPreferencesTTL: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  
  // Security Configuration
  security: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  }
};

// Appwrite Configuration
export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  
  collections: {
    etfs: import.meta.env.VITE_APPWRITE_ETFS_COLLECTION_ID,
    portfolios: import.meta.env.VITE_APPWRITE_PORTFOLIOS_COLLECTION_ID,
    transactions: import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID,
    dividends: import.meta.env.VITE_APPWRITE_DIVIDENDS_COLLECTION_ID
  }
};

// Polygon.io Configuration
export const polygonConfig = {
  apiKey: import.meta.env.VITE_POLYGON_API_KEY,
  baseUrl: 'https://api.polygon.io',
  websocketUrl: 'wss://socket.polygon.io/stocks',
  
  // Rate Limiting (Polygon.io limits)
  rateLimits: {
    basic: {
      requestsPerMinute: 5,
      requestsPerMonth: 1000
    },
    developer: {
      requestsPerMinute: 100,
      requestsPerMonth: 100000
    }
  },
  
  // Default parameters
  defaults: {
    timespan: 'day',
    multiplier: 1,
    limit: 120 // 120 days of data
  }
};

// Development helpers
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Logging configuration
export const logConfig = {
  level: isDevelopment ? 'debug' : 'error',
  enableConsole: isDevelopment,
  enableRemote: isProduction && appConfig.features.errorReporting
};

// Validation helpers
export const validateConfig = () => {
  const errors = [];
  
  // Validate Appwrite config
  if (!appwriteConfig.endpoint) errors.push('Appwrite endpoint is required');
  if (!appwriteConfig.projectId) errors.push('Appwrite project ID is required');
  if (!appwriteConfig.databaseId) errors.push('Appwrite database ID is required');
  
  // Validate Polygon config in production
  if (isProduction && !polygonConfig.apiKey) {
    errors.push('Polygon.io API key is required for production');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export configuration status
export const configStatus = {
  isValid: validateConfig().isValid,
  errors: validateConfig().errors,
  environment: appConfig.environment,
  features: appConfig.features
};

// Default export
export default {
  app: appConfig,
  appwrite: appwriteConfig,
  polygon: polygonConfig,
  isDevelopment,
  isProduction,
  logConfig,
  validateConfig,
  configStatus
};
