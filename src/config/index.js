/**
 * Configuration module for the Binance trading bot
 * Handles default configuration values and environment variables
 */
const path = require('path');

// Define paths
const dataDir = path.join(__dirname, '../../data');
const configPath = path.join(dataDir, 'config.json');
const ordersPath = path.join(dataDir, 'orders.json');

// Default strategy configuration
const defaultConfig = {
  symbol: 'BTCUSDT',
  timeframe: '5m',
  plusDIThreshold: 25,
  minusDIThreshold: 20,
  adxMinimum: 20,
  takeProfitPercentage: 2,
  stopLossPercentage: 1,
  leverage: 10
};

// Environment configurations
const envConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  binanceApiKey: process.env.BINANCE_API_KEY,
  binanceApiSecret: process.env.BINANCE_API_SECRET,
  binanceTestnet: true, // Use testnet by default for safety
  corsOrigins: ['http://localhost:3000'],
  useFallbackStorage: process.env.USE_FALLBACK_STORAGE === 'true' || false
};

module.exports = {
  defaultConfig,
  envConfig,
  paths: {
    dataDir,
    configPath,
    ordersPath
  }
}; 