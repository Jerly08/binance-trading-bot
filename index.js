/**
 * Main entry point for Binance Trading Bot
 * Simply requires and runs the server or exports it for serverless
 */
const app = require('./src/server');

// If running directly (not imported)
if (require.main === module) {
  // Server will start in src/server.js if not on Vercel
  // Nothing needs to be done here
}

// Export for serverless
module.exports = app; 