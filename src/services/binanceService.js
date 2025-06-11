/**
 * Binance API Service
 * Handles all interactions with the Binance API
 */
const Binance = require('node-binance-api');
const config = require('../config');

/**
 * Initialize Binance API client
 */
const binanceClient = new Binance().options({
  APIKEY: config.envConfig.binanceApiKey,
  APISECRET: config.envConfig.binanceApiSecret,
  test: config.envConfig.binanceTestnet
});

/**
 * Get current price for a symbol
 * @param {string} symbol - The trading pair symbol (e.g., BTCUSDT)
 * @returns {Promise<number>} The current price
 */
async function getCurrentPrice(symbol) {
  try {
    const ticker = await binanceClient.prices(symbol);
    return parseFloat(ticker[symbol]);
  } catch (error) {
    console.error(`Error getting price for ${symbol}:`, error);
    throw new Error(`Failed to get price for ${symbol}`);
  }
}

/**
 * Get account information including balances
 * @returns {Promise<Object>} Account information
 */
async function getAccountInfo() {
  try {
    return await binanceClient.balance();
  } catch (error) {
    console.error('Error getting account info:', error);
    throw new Error('Failed to get account information');
  }
}

/**
 * Set leverage for a symbol
 * @param {string} symbol - The trading pair symbol (e.g., BTCUSDT)
 * @param {number} leverage - The leverage value
 * @returns {Promise<Object>} Leverage information
 */
async function setLeverage(symbol, leverage) {
  try {
    return await binanceClient.futuresLeverage(symbol, leverage);
  } catch (error) {
    console.error(`Error setting leverage for ${symbol}:`, error);
    throw new Error(`Failed to set leverage for ${symbol}`);
  }
}

/**
 * Simulate a market order (doesn't actually place an order)
 * @param {string} symbol - The trading pair symbol (e.g., BTCUSDT)
 * @param {string} side - BUY or SELL
 * @param {number} leverage - The leverage multiplier
 * @param {number} tpPercentage - Take profit percentage
 * @param {number} slPercentage - Stop loss percentage
 * @returns {Promise<Object>} Simulated order details
 */
async function simulateOrder(symbol, side, leverage, tpPercentage, slPercentage) {
  try {
    const currentPrice = await getCurrentPrice(symbol);
    
    // Calculate TP and SL prices
    const tpPrice = side === 'BUY' 
      ? currentPrice * (1 + tpPercentage / 100)
      : currentPrice * (1 - tpPercentage / 100);
      
    const slPrice = side === 'BUY'
      ? currentPrice * (1 - slPercentage / 100)
      : currentPrice * (1 + slPercentage / 100);
    
    // Create simulated order object
    return {
      symbol,
      action: side,
      price_entry: currentPrice.toString(),
      tp_price: tpPrice.toFixed(2),
      sl_price: slPrice.toFixed(2),
      leverage: `${leverage}x`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error simulating order for ${symbol}:`, error);
    throw new Error(`Failed to simulate order for ${symbol}`);
  }
}

module.exports = {
  binanceClient,
  getCurrentPrice,
  getAccountInfo,
  setLeverage,
  simulateOrder
}; 