/**
 * Order Schema for MongoDB
 */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['BUY', 'SELL']
  },
  price_entry: {
    type: String,
    required: true
  },
  tp_price: {
    type: String,
    required: true
  },
  sl_price: {
    type: String,
    required: true
  },
  leverage: {
    type: String,
    required: true
  },
  timeframe: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'TP_HIT', 'SL_HIT', 'CLOSED'],
    default: 'ACTIVE'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  closed_at: {
    type: Date
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 