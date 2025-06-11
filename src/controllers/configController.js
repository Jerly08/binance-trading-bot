/**
 * Config Controller
 * Handles HTTP requests for configuration management
 */
const configModel = require('../models/configModel');

/**
 * Get current configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getConfig(req, res) {
  try {
    const config = configModel.getConfig();
    res.status(200).json(config);
  } catch (error) {
    console.error('Error in getConfig controller:', error);
    res.status(500).json({ error: 'Error reading configuration' });
  }
}

/**
 * Update configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function updateConfig(req, res) {
  try {
    // Validate required fields
    const { symbol, timeframe, plusDIThreshold, minusDIThreshold, adxMinimum,
            takeProfitPercentage, stopLossPercentage, leverage } = req.body;
    
    // Basic validation
    if (takeProfitPercentage <= 0 || stopLossPercentage <= 0) {
      return res.status(400).json({ 
        error: 'Take Profit and Stop Loss must be positive values' 
      });
    }
    
    if (leverage < 1 || leverage > 125) {
      return res.status(400).json({ 
        error: 'Leverage must be between 1 and 125' 
      });
    }
    
    // Update config
    const updatedConfig = configModel.updateConfig(req.body);
    res.status(200).json(updatedConfig);
  } catch (error) {
    console.error('Error in updateConfig controller:', error);
    res.status(500).json({ error: 'Error updating configuration' });
  }
}

/**
 * Reset configuration to default values
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function resetConfig(req, res) {
  try {
    const defaultConfig = configModel.resetConfig();
    res.status(200).json({
      message: 'Configuration reset to defaults',
      config: defaultConfig
    });
  } catch (error) {
    console.error('Error in resetConfig controller:', error);
    res.status(500).json({ error: 'Error resetting configuration' });
  }
}

module.exports = {
  getConfig,
  updateConfig,
  resetConfig
}; 