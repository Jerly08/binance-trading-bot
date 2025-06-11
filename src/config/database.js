/**
 * Database Configuration
 * Setup MongoDB connection using Mongoose
 */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB
 * @returns {Promise} MongoDB connection
 */
async function connectDatabase() {
  try {
    const connectionString = process.env.MONGODB_URI;
    
    if (!connectionString) {
      throw new Error('MONGODB_URI environment variable not set');
    }
    
    // Tambahkan opsi koneksi untuk mengatasi masalah konektivitas
    const options = {
      connectTimeoutMS: 30000, // Increase connection timeout
      socketTimeoutMS: 45000,  // Increase socket timeout
      serverSelectionTimeoutMS: 30000, // Increase server selection timeout
    };
    
    await mongoose.connect(connectionString, options);
    logger.info('Connected to MongoDB successfully');
    
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Close MongoDB connection
 */
async function closeDatabase() {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error:', err);
});

module.exports = {
  connectDatabase,
  closeDatabase,
  mongoose
}; 