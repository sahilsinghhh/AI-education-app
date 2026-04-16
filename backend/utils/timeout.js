/**
 * Utility for handling timeouts on async operations
 */

/**
 * Wraps a promise with a timeout
 * @param {Promise} promise - The promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} errorMessage - Custom error message
 * @returns {Promise} - Promise that rejects on timeout
 */
const withTimeout = (promise, timeoutMs, errorMessage = 'Operation timed out') => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    })
  ]);
};

/**
 * Timeout wrapper specifically for AI requests
 * @param {Promise} aiPromise - The AI API call promise
 * @param {number} timeoutMs - Timeout in milliseconds (default: 30 seconds)
 * @returns {Promise} - Promise that rejects on timeout
 */
const withAITimeout = (aiPromise, timeoutMs = 30000) => {
  return withTimeout(aiPromise, timeoutMs, 'AI request timed out - please try again');
};

/**
 * Timeout wrapper for file processing operations
 * @param {Promise} filePromise - The file processing promise
 * @param {number} timeoutMs - Timeout in milliseconds (default: 60 seconds)
 * @returns {Promise} - Promise that rejects on timeout
 */
const withFileTimeout = (filePromise, timeoutMs = 60000) => {
  return withTimeout(filePromise, timeoutMs, 'File processing timed out - file may be too large');
};

module.exports = {
  withTimeout,
  withAITimeout,
  withFileTimeout
};