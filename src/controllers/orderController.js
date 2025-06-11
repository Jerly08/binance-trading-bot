/**
 * Order Controller
 * Handles HTTP requests for order management
 */
const orderModel = require('../models/orderModel');
const logger = require('../utils/logger');

/**
 * Get all orders
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getOrders(req, res) {
  try {
    const orders = await orderModel.getOrders();
    res.status(200).json(orders);
  } catch (error) {
    logger.error('Error in getOrders controller:', error);
    res.status(500).json({ error: 'Error reading orders' });
  }
}

/**
 * Add a new order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function addOrder(req, res) {
  try {
    const { 
      symbol, 
      action, 
      price_entry, 
      tp_price, 
      sl_price, 
      leverage, 
      timeframe 
    } = req.body;
    
    // Validate required fields
    if (!symbol || !action || !price_entry) {
      return res.status(400).json({ 
        error: 'Missing required fields: symbol, action, and price_entry are required' 
      });
    }
    
    // Create timestamp
    const timestamp = new Date().toISOString();
    
    // Create order object
    const order = {
      symbol,
      action,
      price_entry,
      tp_price,
      sl_price,
      leverage,
      timeframe,
      timestamp
    };
    
    // Add order
    const newOrder = await orderModel.addOrder(order);
    
    res.status(201).json({
      message: `New ${action} order created for ${symbol}`,
      order: newOrder
    });
  } catch (error) {
    logger.error('Error in addOrder controller:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
}

/**
 * Reset all orders
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function resetOrders(req, res) {
  try {
    await orderModel.resetOrders();
    res.status(200).json({ 
      message: 'All orders have been cleared',
      orders: []
    });
  } catch (error) {
    logger.error('Error in resetOrders controller:', error);
    res.status(500).json({ error: 'Error clearing orders' });
  }
}

module.exports = {
  getOrders,
  addOrder,
  resetOrders
}; 