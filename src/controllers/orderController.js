/**
 * Order Controller
 * Handles HTTP requests for order management
 */
const orderModel = require('../models/orderModel');

/**
 * Get all orders
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getOrders(req, res) {
  try {
    const orders = orderModel.getOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in getOrders controller:', error);
    res.status(500).json({ error: 'Error reading orders' });
  }
}

/**
 * Reset all orders
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function resetOrders(req, res) {
  try {
    orderModel.resetOrders();
    res.status(200).json({ 
      message: 'All orders have been cleared',
      orders: []
    });
  } catch (error) {
    console.error('Error in resetOrders controller:', error);
    res.status(500).json({ error: 'Error clearing orders' });
  }
}

module.exports = {
  getOrders,
  resetOrders
}; 