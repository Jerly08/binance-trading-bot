/**
 * Order Model
 * Handles reading and writing order data to MongoDB
 */
const fs = require('fs');
const OrderSchema = require('./schemas/orderSchema');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Get all simulated orders
 * @param {Object} filter - Optional query filters
 * @returns {Promise<Array>} List of all orders
 */
async function getOrders(filter = {}) {
  try {
    // Use file storage if fallback is enabled
    if (config.envConfig.useFallbackStorage) {
      return getOrdersFromFile();
    }
    
    const orders = await OrderSchema.find(filter).sort({ created_at: -1 });
    return orders;
  } catch (error) {
    logger.error('Error reading orders from database:', error);
    // Fallback to file storage on error
    return getOrdersFromFile();
  }
}

/**
 * Add a new simulated order
 * @param {Object} order - The order to add
 * @returns {Promise<Object>} Added order
 */
async function addOrder(order) {
  try {
    // Use file storage if fallback is enabled
    if (config.envConfig.useFallbackStorage) {
      return addOrderToFile(order);
    }
    
    const newOrder = await OrderSchema.create({
      ...order,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    logger.info(`New ${order.action} order created for ${order.symbol}`);
    return newOrder;
  } catch (error) {
    logger.error('Error adding order to database:', error);
    // Fallback to file storage on error
    return addOrderToFile(order);
  }
}

/**
 * Update an existing order
 * @param {string} orderId - ID of the order to update
 * @param {Object} updates - The properties to update
 * @returns {Promise<Object>} Updated order
 */
async function updateOrder(orderId, updates) {
  try {
    // Use file storage if fallback is enabled
    if (config.envConfig.useFallbackStorage) {
      return updateOrderInFile(orderId, updates);
    }
    
    const order = await OrderSchema.findByIdAndUpdate(
      orderId,
      { ...updates, updated_at: new Date() },
      { new: true }
    );
    
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    logger.info(`Order ${orderId} updated successfully`);
    return order;
  } catch (error) {
    logger.error(`Error updating order ${orderId}:`, error);
    // Try fallback to file storage on error
    try {
      return updateOrderInFile(orderId, updates);
    } catch (fileError) {
      throw new Error(`Failed to update order: ${error.message}`);
    }
  }
}

/**
 * Delete all orders (reset)
 * @returns {Promise<void>}
 */
async function resetOrders() {
  try {
    // Use file storage if fallback is enabled
    if (config.envConfig.useFallbackStorage) {
      return resetOrdersInFile();
    }
    
    await OrderSchema.deleteMany({});
    logger.info('All orders have been deleted');
  } catch (error) {
    logger.error('Error resetting orders in database:', error);
    // Try fallback to file storage on error
    try {
      return resetOrdersInFile();
    } catch (fileError) {
      throw new Error('Failed to reset orders');
    }
  }
}

/**
 * Get orders from file storage
 * @returns {Array} Orders from file
 */
function getOrdersFromFile() {
  try {
    // Create orders file if it doesn't exist
    if (!fs.existsSync(config.paths.dataDir)) {
      fs.mkdirSync(config.paths.dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(config.paths.ordersPath)) {
      fs.writeFileSync(config.paths.ordersPath, JSON.stringify([], null, 2));
      return [];
    }
    
    const fileContent = fs.readFileSync(config.paths.ordersPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    logger.error('Error reading orders from file:', error);
    return [];
  }
}

/**
 * Add order to file storage
 * @param {Object} order - Order to add
 * @returns {Object} Added order with ID
 */
function addOrderToFile(order) {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(config.paths.dataDir)) {
      fs.mkdirSync(config.paths.dataDir, { recursive: true });
    }
    
    // Get current orders
    const orders = getOrdersFromFile();
    
    // Create new order with generated ID
    const newOrder = {
      id: generateOrderId(),
      ...order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to orders array
    orders.unshift(newOrder);
    
    // Save to file
    fs.writeFileSync(config.paths.ordersPath, JSON.stringify(orders, null, 2));
    
    logger.info(`New ${order.action} order saved to file for ${order.symbol}`);
    return newOrder;
  } catch (error) {
    logger.error('Error adding order to file:', error);
    throw new Error(`Failed to add order to file: ${error.message}`);
  }
}

/**
 * Update order in file storage
 * @param {string} orderId - ID of the order to update
 * @param {Object} updates - Properties to update
 * @returns {Object} Updated order
 */
function updateOrderInFile(orderId, updates) {
  try {
    const orders = getOrdersFromFile();
    
    // Find order by ID
    const orderIndex = orders.findIndex(order => 
      order.id === orderId || 
      (order._id && order._id.toString() === orderId)
    );
    
    if (orderIndex === -1) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    // Update the order
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Save to file
    fs.writeFileSync(config.paths.ordersPath, JSON.stringify(orders, null, 2));
    
    logger.info(`Order ${orderId} updated in file successfully`);
    return orders[orderIndex];
  } catch (error) {
    logger.error(`Error updating order in file:`, error);
    throw new Error(`Failed to update order in file: ${error.message}`);
  }
}

/**
 * Reset orders in file storage
 * @returns {void}
 */
function resetOrdersInFile() {
  try {
    if (!fs.existsSync(config.paths.dataDir)) {
      fs.mkdirSync(config.paths.dataDir, { recursive: true });
    }
    
    fs.writeFileSync(config.paths.ordersPath, JSON.stringify([], null, 2));
    logger.info('All orders have been reset in file storage');
  } catch (error) {
    logger.error('Error resetting orders in file:', error);
    throw new Error(`Failed to reset orders in file: ${error.message}`);
  }
}

/**
 * Generate a unique order ID
 * @returns {string} Unique ID
 */
function generateOrderId() {
  return `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  resetOrders
}; 