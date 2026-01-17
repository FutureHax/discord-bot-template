/**
 * Winston-based structured logging
 */
const winston = require('winston');
const config = require('../config');

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, service, ...metadata }) => {
  let msg = `${timestamp} [${service || 'app'}] ${level}: ${message}`;
  if (Object.keys(metadata).length > 0 && metadata.stack === undefined) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  if (metadata.stack) {
    msg += `\n${metadata.stack}`;
  }
  return msg;
});

// JSON format for production
const jsonFormat = printf(({ level, message, timestamp, service, ...metadata }) => {
  return JSON.stringify({
    timestamp,
    level,
    service: service || 'app',
    message,
    ...metadata,
  });
});

/**
 * Create a logger instance for a service
 * @param {string} serviceName - Name of the service (e.g., 'bot', 'api', 'dashboard')
 * @returns {winston.Logger}
 */
function createLogger(serviceName = 'app') {
  const isProduction = config.app.isProduction;

  return winston.createLogger({
    level: config.logging.level,
    defaultMeta: { service: serviceName },
    format: combine(
      errors({ stack: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
      new winston.transports.Console({
        format: isProduction
          ? combine(jsonFormat)
          : combine(colorize(), consoleFormat),
      }),
    ],
  });
}

// Default logger instance
const logger = createLogger();

// Attach factory method
logger.createLogger = createLogger;

module.exports = logger;