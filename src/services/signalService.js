/**
 * Signal Service
 * Handles validation and processing of TradingView signals based on DMI/ADX indicators
 */

/**
 * Validates a DMI/ADX signal against the specified thresholds
 * 
 * DMI (Directional Movement Index) consists of:
 * - +DI: Positive Directional Indicator, measures upward price movement strength
 * - -DI: Negative Directional Indicator, measures downward price movement strength
 * - ADX: Average Directional Index, measures trend strength regardless of direction
 * 
 * Trading logic:
 * - BUY when +DI > -DI threshold AND ADX > minimum (strong uptrend)
 * - SELL when opposites are true (potential downtrend)
 * 
 * @param {Object} signal - The signal object containing indicator values
 * @param {Object} thresholds - The threshold values to check against
 * @returns {Object} Validation result with action and explanation
 */
function validateDmiAdxSignal(signal, thresholds) {
  // Extract signal and threshold values
  const { plusDI, minusDI, adx } = signal;
  const { plusDIThreshold, minusDIThreshold, adxMinimum } = thresholds;
  
  // Initialize result object
  const result = {
    isValid: false,
    action: null,
    explanation: ''
  };
  
  // Validate required signal parameters
  if (plusDI === undefined || minusDI === undefined || adx === undefined) {
    result.explanation = 'Missing required DMI/ADX indicator values';
    return result;
  }
  
  // Check for BUY conditions: +DI > threshold, -DI < threshold, ADX > minimum
  if (plusDI > plusDIThreshold && 
      minusDI < minusDIThreshold && 
      adx > adxMinimum) {
    result.isValid = true;
    result.action = 'BUY';
    result.explanation = `Strong uptrend detected: +DI (${plusDI.toFixed(2)}) > threshold (${plusDIThreshold}), -DI (${minusDI.toFixed(2)}) < threshold (${minusDIThreshold}), ADX (${adx.toFixed(2)}) > minimum (${adxMinimum})`;
  } 
  // Check for SELL conditions: opposite of BUY
  else if (plusDI < plusDIThreshold || 
           minusDI > minusDIThreshold || 
           adx < adxMinimum) {
    result.isValid = true;
    result.action = 'SELL';
    result.explanation = `Potential downtrend or weak trend: +DI (${plusDI.toFixed(2)}) < threshold (${plusDIThreshold}) or -DI (${minusDI.toFixed(2)}) > threshold (${minusDIThreshold}) or ADX (${adx.toFixed(2)}) < minimum (${adxMinimum})`;
  } else {
    result.explanation = 'Signal does not meet BUY or SELL criteria';
  }
  
  return result;
}

/**
 * Process a complete signal with additional context
 * @param {Object} signal - The trading signal from TradingView
 * @param {Object} config - The trading configuration with thresholds
 * @returns {Object} Processed signal result
 */
function processSignal(signal, config) {
  // Validate the DMI/ADX signal
  const validationResult = validateDmiAdxSignal(signal, config);
  
  if (!validationResult.isValid) {
    return {
      success: false,
      message: validationResult.explanation
    };
  }
  
  return {
    success: true,
    action: validationResult.action,
    explanation: validationResult.explanation,
    signal
  };
}

module.exports = {
  validateDmiAdxSignal,
  processSignal
}; 