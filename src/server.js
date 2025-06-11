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

// Start server
app.listen(PORT, () => {
  console.log(`
=========================================
🚀 Binance Trading Bot Server Running
📊 Mode: ${config.envConfig.nodeEnv}
🔌 Port: ${PORT}
🔐 Testnet: ${config.envConfig.binanceTestnet ? 'Enabled' : 'Disabled'}
=========================================
  `);
}); 