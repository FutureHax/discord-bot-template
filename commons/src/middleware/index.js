/**
 * Express middleware collection
 */
const errorHandler = require('./errorHandler');
const apiKeyAuth = require('./apiKeyAuth');
const requestLogger = require('./requestLogger');

module.exports = {
  errorHandler,
  apiKeyAuth,
  requestLogger,
};