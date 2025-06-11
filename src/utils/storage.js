/**
 * Storage utility for Vercel serverless environment
 * Provides in-memory fallback when filesystem is not available or ephemeral
 */
const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('./logger');

// In-memory storage as fallback for serverless environment
const memoryStorage = {
  config: null,
  orders: []
};

/**
 * Check if we're running in Vercel serverless environment
 * @returns {boolean} True if running in Vercel
 */
function isVercelEnvironment() {
  const isVercel = process.env.VERCEL === '1';
  if (isVercel) {
    logger.info('Running in Vercel serverless environment');
  }
  return isVercel;
}

/**
 * Get configuration from storage
 * @returns {Object} The configuration object
 */
function getConfig() {
  if (isVercelEnvironment()) {
    // Use memory storage in Vercel
    if (!memoryStorage.config) {
      logger.info('Initializing config in memory storage');
      memoryStorage.config = { ...config.defaultConfig };
    }
    return memoryStorage.config;
  }

  // Use filesystem in non-Vercel environment
  try {
    if (!fs.existsSync(config.paths.configPath)) {
      fs.writeFileSync(config.paths.configPath, JSON.stringify(config.defaultConfig, null, 2));
      return config.defaultConfig;
    }
    
    return JSON.parse(fs.readFileSync(config.paths.configPath, 'utf8'));
  } catch (error) {
    logger.error('Error reading config:', error);
    return config.defaultConfig;
  }
}

/**
 * Save configuration
 * @param {Object} configData - The configuration to save
 * @returns {Object} The saved configuration
 */
function saveConfig(configData) {
  const newConfig = {
    ...config.defaultConfig,
    ...configData
  };

  if (isVercelEnvironment()) {
    // Save to memory in Vercel
    memoryStorage.config = newConfig;
    return newConfig;
  }

  // Save to filesystem in non-Vercel environment
  try {
    if (!fs.existsSync(config.paths.dataDir)) {
      fs.mkdirSync(config.paths.dataDir, { recursive: true });
    }
    
    fs.writeFileSync(config.paths.configPath, JSON.stringify(newConfig, null, 2));
    return newConfig;
  } catch (error) {
    logger.error('Error saving config:', error);
    throw new Error('Failed to save configuration');
  }
}

/**
 * Get all orders
 * @returns {Array} List of orders
 */
function getOrders() {
  if (isVercelEnvironment()) {
    // Return from memory in Vercel
    return memoryStorage.orders;
  }

  // Use filesystem in non-Vercel environment
  try {
    if (!fs.existsSync(config.paths.ordersPath)) {
      fs.writeFileSync(config.paths.ordersPath, JSON.stringify([], null, 2));
      return [];
    }
    
    return JSON.parse(fs.readFileSync(config.paths.ordersPath, 'utf8'));
  } catch (error) {
    logger.error('Error reading orders:', error);
    return [];
  }
}

/**
 * Save a new order
 * @param {Object} order - The order to save
 * @returns {Array} Updated list of orders
 */
function saveOrder(order) {
  const newOrder = {
    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    ...order,
    created_at: new Date().toISOString()
  };

  if (isVercelEnvironment()) {
    // Save to memory in Vercel
    memoryStorage.orders.push(newOrder);
    // Keep only recent orders in memory (limit to 100)
    if (memoryStorage.orders.length > 100) {
      memoryStorage.orders.shift();
    }
    return memoryStorage.orders;
  }

  // Save to filesystem in non-Vercel environment
  try {
    const orders = getOrders();
    orders.push(newOrder);
    
    if (!fs.existsSync(config.paths.dataDir)) {
      fs.mkdirSync(config.paths.dataDir, { recursive: true });
    }
    
    fs.writeFileSync(config.paths.ordersPath, JSON.stringify(orders, null, 2));
    return orders;
  } catch (error) {
    logger.error('Error saving order:', error);
    throw new Error('Failed to save order');
  }
}

/**
 * Clear all orders
 * @returns {Array} Empty array
 */
function clearOrders() {
  if (isVercelEnvironment()) {
    // Clear memory in Vercel
    memoryStorage.orders = [];
    return [];
  }

  // Clear filesystem in non-Vercel environment
  try {
    fs.writeFileSync(config.paths.ordersPath, JSON.stringify([], null, 2));
    return [];
  } catch (error) {
    logger.error('Error clearing orders:', error);
    throw new Error('Failed to clear orders');
  }
}

// Export explicitly for better debug in Vercel
const exportedMethods = {
  getConfig,
  saveConfig,
  getOrders,
  saveOrder,
  clearOrders,
  isVercelEnvironment
};

logger.info(`Storage utility initialized. Vercel environment: ${isVercelEnvironment()}`);

module.exports = exportedMethods; 