/**
 * Binance Trading Bot Server
 * Main application entry point
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import configuration
const config = require('./config');
const logger = require('./utils/logger');
const { connectDatabase } = require('./config/database');

// Import routes
const apiRoutes = require('./routes/api');

// Initialize express app
const app = express();
const PORT = config.envConfig.port;

// Configure CORS
app.use(cors({
  origin: config.envConfig.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure data directory exists
if (!fs.existsSync(config.paths.dataDir)) {
  fs.mkdirSync(config.paths.dataDir, { recursive: true });
}

// API routes
app.use('/api', apiRoutes);

// Serve static assets in production
if (config.envConfig.nodeEnv === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Try to connect to MongoDB
    if (!config.envConfig.useFallbackStorage) {
      try {
        await connectDatabase();
        logger.info('✅ MongoDB connection successful');
      } catch (dbError) {
        logger.error('❌ MongoDB connection failed:', dbError.message);
        logger.info('🔄 Switching to fallback file storage mode');
        // Enable fallback storage mode
        config.envConfig.useFallbackStorage = true;
      }
    } else {
      logger.info('💾 Using file-based storage (fallback mode)');
    }
    
    // Start server regardless of database connection
    app.listen(PORT, () => {
      logger.info(`
=========================================
🚀 Binance Trading Bot Server Running
📊 Mode: ${config.envConfig.nodeEnv}
🔌 Port: ${PORT}
🔐 Testnet: ${config.envConfig.binanceTestnet ? 'Enabled' : 'Disabled'}
💾 Storage: ${config.envConfig.useFallbackStorage ? 'File System (Fallback)' : 'MongoDB'}
=========================================
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start server
startServer(); 