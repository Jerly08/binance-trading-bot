/**
 * Webhook Controller
 * Handles incoming TradingView signals and processes them
 */
const configModel = require('../models/configModel');
const orderModel = require('../models/orderModel');
const signalService = require('../services/signalService');
const binanceService = require('../services/binanceService');

/**
 * Process incoming TradingView webhook
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function processWebhook(req, res) {
  try {
    // Get the signal from request body
    const signal = req.body;
    
    // Basic validation for required fields
    if (!signal.symbol || !signal.plusDI || !signal.minusDI || !signal.adx || !signal.timeframe) {
      return res.status(400).json({ 
        error: 'Missing required signal parameters',
        required: ['symbol', 'plusDI', 'minusDI', 'adx', 'timeframe'] 
      });
    }
    
    // Get current configuration
    const config = configModel.getConfig();
    
    // Process and validate the signal
    const signalResult = signalService.processSignal(signal, config);
    
    if (!signalResult.success) {
      return res.status(400).json({ 
        error: 'Invalid signal', 
        message: signalResult.message 
      });
    }
    
    // Simulate order with Binance API
    const order = await binanceService.simulateOrder(
      signal.symbol,
      signalResult.action,
      config.leverage,
      config.takeProfitPercentage,
      config.stopLossPercentage
    );
    
    // Add timeframe to the order
    order.timeframe = signal.timeframe;
    
    // Save the simulated order
    const updatedOrders = orderModel.addOrder(order);
    
    // Return success response
    res.status(200).json({
      message: 'Signal processed successfully',
      action: signalResult.action,
      explanation: signalResult.explanation,
      order
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
}

module.exports = {
  processWebhook
}; 