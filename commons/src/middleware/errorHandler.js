/**
 * Global error handler middleware
 */
const logger = require('../utils/logger').createLogger('error');

/**
 * Express error handler middleware
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details
  logger.error(message, {
    statusCode,
    method: req.method,
    path: req.path,
    stack: err.stack,
    body: req.body,
    query: req.query,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

module.exports = errorHandler;