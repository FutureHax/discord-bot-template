/**
 * API key authentication middleware
 */
const config = require('../config');
const logger = require('../utils/logger').createLogger('auth');

/**
 * Validate API key from request headers
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKey) {
    logger.warn('Missing API key', { path: req.path, ip: req.ip });
    return res.status(401).json({
      success: false,
      error: {
        message: 'API key required',
        code: 'UNAUTHORIZED',
      },
    });
  }

  if (apiKey !== config.api.key) {
    logger.warn('Invalid API key', { path: req.path, ip: req.ip });
    return res.status(403).json({
      success: false,
      error: {
        message: 'Invalid API key',
        code: 'FORBIDDEN',
      },
    });
  }

  next();
}

/**
 * Optional API key auth - allows unauthenticated requests
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function optionalApiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (apiKey && apiKey === config.api.key) {
    req.authenticated = true;
  } else {
    req.authenticated = false;
  }

  next();
}

module.exports = apiKeyAuth;
module.exports.optional = optionalApiKeyAuth;