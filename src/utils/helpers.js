/**
 * Utility helper functions
 */

/**
 * Format a number with commas
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Truncate string to specified length
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(str, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse Discord snowflake to timestamp
 * @param {string} snowflake
 * @returns {Date}
 */
function snowflakeToDate(snowflake) {
  const DISCORD_EPOCH = 1420070400000n;
  const timestamp = (BigInt(snowflake) >> 22n) + DISCORD_EPOCH;
  return new Date(Number(timestamp));
}

/**
 * Generate a random string
 * @param {number} length
 * @returns {string}
 */
function randomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = {
  formatNumber,
  truncate,
  sleep,
  snowflakeToDate,
  randomString,
};