/**
 * Config Model
 * Handles reading and writing configuration data to MongoDB
 */
const fs = require('fs');
const ConfigSchema = require('./schemas/configSchema');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Get the current bot configuration
 * @returns {Promise<Object>} The current configuration
 */
async function getConfig() {
  try {
    // Use fallback storage if configured
    if (config.envConfig.useFallbackStorage) {
      return getConfigFromFile();
    }

    // Find the active config or create default if none exists
    let configDoc = await ConfigSchema.findOne({ isActive: true });
    
    if (!configDoc) {
      configDoc = await ConfigSchema.create(config.defaultConfig);
      logger.info('Created default configuration in database');
    }
    
    return configDoc.toObject();
  } catch (error) {
    logger.error('Error reading config from database:', error);
    // Fallback to file storage on error
    return getConfigFromFile();
  }
}

/**
 * Update the bot configuration
 * @param {Object} newConfig - The new configuration values
 * @returns {Promise<Object>} The updated configuration
 */
async function updateConfig(newConfig) {
  try {
    // Use fallback storage if configured
    if (config.envConfig.useFallbackStorage) {
      return updateConfigInFile(newConfig);
    }

    // Find active config or create one
    let configDoc = await ConfigSchema.findOne({ isActive: true });
    
    if (configDoc) {
      // Update existing config
      Object.assign(configDoc, newConfig);
      configDoc.updatedAt = new Date();
      await configDoc.save();
    } else {
      // Create new config with merged values
      configDoc = await ConfigSchema.create({
        ...config.defaultConfig,
        ...newConfig,
        isActive: true
      });
    }
    
    logger.info('Configuration updated successfully');
    return configDoc.toObject();
  } catch (error) {
    logger.error('Error updating config in database:', error);
    // Fallback to file storage on error
    return updateConfigInFile(newConfig);
  }
}

/**
 * Reset configuration to default values
 * @returns {Promise<Object>} The default configuration
 */
async function resetConfig() {
  try {
    // Use fallback storage if configured
    if (config.envConfig.useFallbackStorage) {
      return resetConfigInFile();
    }

    // Find active config and update with defaults or create new
    const configDoc = await ConfigSchema.findOneAndUpdate(
      { isActive: true },
      { ...config.defaultConfig, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    
    logger.info('Configuration reset to defaults');
    return configDoc.toObject();
  } catch (error) {
    logger.error('Error resetting config in database:', error);
    // Fallback to file storage on error
    return resetConfigInFile();
  }
}

/**
 * Get configuration from file storage
 * @returns {Object} Configuration from file
 */
function getConfigFromFile() {
  try {
    if (!fs.existsSync(config.paths.configPath)) {
      fs.writeFileSync(
        config.paths.configPath, 
        JSON.stringify(config.defaultConfig, null, 2)
      );
      return config.defaultConfig;
    }
    
    return JSON.parse(fs.readFileSync(config.paths.configPath, 'utf8'));
  } catch (error) {
    logger.error('Error reading config from file:', error);
    return config.defaultConfig;
  }
}

/**
 * Update configuration in file storage
 * @param {Object} newConfig - New configuration values
 * @returns {Object} Updated configuration
 */
function updateConfigInFile(newConfig) {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(config.paths.dataDir)) {
      fs.mkdirSync(config.paths.dataDir, { recursive: true });
    }
    
    // Merge with default config
    const updatedConfig = {
      ...config.defaultConfig,
      ...newConfig
    };
    
    fs.writeFileSync(
      config.paths.configPath, 
      JSON.stringify(updatedConfig, null, 2)
    );
    
    logger.info('Configuration saved to file successfully');
    return updatedConfig;
  } catch (error) {
    logger.error('Error updating config in file:', error);
    throw new Error('Failed to update configuration');
  }
}

/**
 * Reset configuration to defaults in file storage
 * @returns {Object} Default configuration
 */
function resetConfigInFile() {
  try {
    fs.writeFileSync(
      config.paths.configPath, 
      JSON.stringify(config.defaultConfig, null, 2)
    );
    
    logger.info('Configuration reset to defaults in file');
    return config.defaultConfig;
  } catch (error) {
    logger.error('Error resetting config in file:', error);
    throw new Error('Failed to reset configuration');
  }
}

module.exports = {
  getConfig,
  updateConfig,
  resetConfig
}; 