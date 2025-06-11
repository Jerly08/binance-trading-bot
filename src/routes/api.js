/**
 * API Routes
 * Defines all API endpoints for the application
 */
const express = require('express');
const router = express.Router();

// Import controllers
const configController = require('../controllers/configController');
const orderController = require('../controllers/orderController');
const webhookController = require('../controllers/webhookController');

// Configuration routes
router.get('/config', configController.getConfig);
router.post('/config', configController.updateConfig);
router.post('/config/reset', configController.resetConfig);

// Order routes
router.get('/orders', orderController.getOrders);
router.post('/orders/reset', orderController.resetOrders);

// Webhook route
router.post('/webhook', webhookController.processWebhook);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router; 