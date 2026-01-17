/**
 * Prisma database client wrapper with connection pooling
 */
const { PrismaClient } = require('@prisma/client');
const config = require('../config');
const logger = require('../utils/logger').createLogger('db');

let prisma = null;

/**
 * Initialize Prisma client with connection pooling
 * @returns {PrismaClient}
 */
function getClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: config.app.isDevelopment
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ]
        : [{ emit: 'event', level: 'error' }],
    });

    // Log queries in development
    if (config.app.isDevelopment) {
      prisma.$on('query', (e) => {
        logger.debug(`Query: ${e.query}`, { duration: `${e.duration}ms` });
      });
    }

    prisma.$on('error', (e) => {
      logger.error('Database error', { error: e.message });
    });

    prisma.$on('warn', (e) => {
      logger.warn('Database warning', { warning: e.message });
    });
  }

  return prisma;
}

/**
 * Connect to database
 * @returns {Promise<void>}
 */
async function connect() {
  const client = getClient();
  try {
    await client.$connect();
    logger.info('Connected to database');
  } catch (error) {
    logger.error('Failed to connect to database', { error: error.message });
    throw error;
  }
}

/**
 * Disconnect from database
 * @returns {Promise<void>}
 */
async function disconnect() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    logger.info('Disconnected from database');
  }
}

/**
 * Health check for database connection
 * @returns {Promise<boolean>}
 */
async function healthCheck() {
  try {
    const client = getClient();
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed', { error: error.message });
    return false;
  }
}

module.exports = {
  getClient,
  connect,
  disconnect,
  healthCheck,
  get prisma() {
    return getClient();
  },
};