/**
 * Order Model
 * Handles reading and writing order data
 */
const storage = require('../utils/storage');

/**
 * Get all simulated orders
 * @returns {Array} List of all orders
 */
function getOrders() {
  return storage.getOrders();
}

/**
 * Add a new simulated order
 * @param {Object} order - The order to add
 * @returns {Array} Updated list of orders
 */
function addOrder(order) {
  return storage.saveOrder(order);
}

/**
 * Delete all orders (reset)
 * @returns {Array} Empty array
 */
function resetOrders() {
  return storage.clearOrders();
}

module.exports = {
  getOrders,
  addOrder,
  resetOrders
}; 