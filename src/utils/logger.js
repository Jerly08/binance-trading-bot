/**
 * Simple logger utility
 * Provides consistent logging format with timestamps
 */

/**
 * Log info message
 * @param {string} message - Message to log
 */
function info(message) {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
}

/**
 * Log error message
 * @param {string} message - Error message
 * @param {Error} [error] - Optional error object
 */
function error(message, error = null) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  if (error) {
    console.error(error);
  }
}

/**
 * Log warning message
 * @param {string} message - Warning message
 */
function warn(message) {
  console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
}

/**
 * Log debug message (only in development)
 * @param {string} message - Debug message
 * @param {any} [data] - Optional data to log
 */
function debug(message, data = null) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    if (data) {
      console.debug(data);
    }
  }
}

module.exports = {
  info,
  error,
  warn,
  debug
}; 