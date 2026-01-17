/**
 * Redis client for caching and pub/sub
 */
const Redis = require('ioredis');
const config = require('../config');
const logger = require('../utils/logger').createLogger('redis');

let client = null;
let subscriber = null;

/**
 * Get Redis client instance
 * @returns {Redis|null}
 */
function getClient() {
  if (!config.redis.enabled) {
    return null;
  }

  if (!client) {
    client = createClient('client');
  }

  return client;
}

/**
 * Get Redis subscriber instance (for pub/sub)
 * @returns {Redis|null}
 */
function getSubscriber() {
  if (!config.redis.enabled) {
    return null;
  }

  if (!subscriber) {
    subscriber = createClient('subscriber');
  }

  return subscriber;
}

/**
 * Create a new Redis client
 * @param {string} name - Client name for logging
 * @returns {Redis}
 */
function createClient(name = 'default') {
  const redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    db: config.redis.db,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redisClient.on('connect', () => {
    logger.info(`Redis ${name} connected`);
  });

  redisClient.on('error', (error) => {
    logger.error(`Redis ${name} error`, { error: error.message });
  });

  redisClient.on('close', () => {
    logger.warn(`Redis ${name} connection closed`);
  });

  return redisClient;
}

/**
 * Connect to Redis
 * @returns {Promise<void>}
 */
async function connect() {
  if (!config.redis.enabled) {
    logger.info('Redis is disabled, skipping connection');
    return;
  }

  getClient();
  logger.info('Redis client initialized');
}

/**
 * Disconnect from Redis
 * @returns {Promise<void>}
 */
async function disconnect() {
  const promises = [];

  if (client) {
    promises.push(client.quit());
    client = null;
  }

  if (subscriber) {
    promises.push(subscriber.quit());
    subscriber = null;
  }

  if (promises.length > 0) {
    await Promise.all(promises);
    logger.info('Redis disconnected');
  }
}

/**
 * Health check for Redis connection
 * @returns {Promise<boolean>}
 */
async function healthCheck() {
  if (!config.redis.enabled) {
    return true;
  }

  try {
    const redis = getClient();
    const pong = await redis.ping();
    return pong === 'PONG';
  } catch (error) {
    logger.error('Redis health check failed', { error: error.message });
    return false;
  }
}

/**
 * Cache helper methods
 */
const cache = {
  /**
   * Get cached value
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async get(key) {
    const redis = getClient();
    if (!redis) return null;

    const value = await redis.get(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return null;
  },

  /**
   * Set cached value
   * @param {string} key
   * @param {any} value
   * @param {number} ttl - TTL in seconds (default: 1 hour)
   * @returns {Promise<void>}
   */
  async set(key, value, ttl = 3600) {
    const redis = getClient();
    if (!redis) return;

    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await redis.setex(key, ttl, serialized);
  },

  /**
   * Delete cached value
   * @param {string} key
   * @returns {Promise<void>}
   */
  async del(key) {
    const redis = getClient();
    if (!redis) return;

    await redis.del(key);
  },

  /**
   * Clear cache by pattern
   * @param {string} pattern
   * @returns {Promise<void>}
   */
  async clearPattern(pattern) {
    const redis = getClient();
    if (!redis) return;

    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};

module.exports = {
  getClient,
  getSubscriber,
  createClient,
  connect,
  disconnect,
  healthCheck,
  cache,
};