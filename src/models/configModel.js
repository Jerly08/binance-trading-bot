/**
 * Config Model
 * Handles reading and writing configuration data
 */
const storage = require('../utils/storage');

/**
 * Get the current bot configuration
 * @returns {Object} The current configuration
 */
function getConfig() {
  return storage.getConfig();
}

/**
 * Update the bot configuration
 * @param {Object} newConfig - The new configuration values
 * @returns {Object} The updated configuration
 */
function updateConfig(newConfig) {
  return storage.saveConfig(newConfig);
}

/**
 * Reset configuration to default values
 * @returns {Object} The default configuration
 */
function resetConfig() {
  return storage.saveConfig({});
}

module.exports = {
  getConfig,
  updateConfig,
  resetConfig
}; 