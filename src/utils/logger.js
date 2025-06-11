/**
 * Simple logger utility
 * Provides consistent logging format with timestamps
 */

// Check if we're in Vercel environment
const isVercel = process.env.VERCEL === '1';

/**
 * Log info message
 * @param {string} message - Message to log
 */
function info(message) {
  console.log(`[INFO]${isVercel ? '[VERCEL]' : ''} ${new Date().toISOString()} - ${message}`);
}

/**
 * Log error message
 * @param {string} message - Error message
 * @param {Error} [error] - Optional error object
 */
function error(message, error = null) {
  console.error(`[ERROR]${isVercel ? '[VERCEL]' : ''} ${new Date().toISOString()} - ${message}`);
  if (error) {
    console.error(error);
  }
}

/**
 * Log warning message
 * @param {string} message - Warning message
 */
function warn(message) {
  console.warn(`[WARN]${isVercel ? '[VERCEL]' : ''} ${new Date().toISOString()} - ${message}`);
}

/**
 * Log debug message (only in development)
 * @param {string} message - Debug message
 * @param {any} [data] - Optional data to log
 */
function debug(message, data = null) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG]${isVercel ? '[VERCEL]' : ''} ${new Date().toISOString()} - ${message}`);
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