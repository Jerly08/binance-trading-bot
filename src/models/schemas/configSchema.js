/**
 * Config Schema for MongoDB
 */
const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    default: 'BTCUSDT'
  },
  timeframe: {
    type: String,
    required: true,
    default: '5m'
  },
  plusDIThreshold: {
    type: Number,
    required: true,
    default: 25
  },
  minusDIThreshold: {
    type: Number,
    required: true,
    default: 20
  },
  adxMinimum: {
    type: Number,
    required: true,
    default: 20
  },
  takeProfitPercentage: {
    type: Number,
    required: true,
    default: 2
  },
  stopLossPercentage: {
    type: Number,
    required: true,
    default: 1
  },
  leverage: {
    type: Number,
    required: true,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Config = mongoose.model('Config', configSchema);

module.exports = Config; 