/**
 * Shared configuration for all services
 */

const config = {
  // Application
  app: {
    name: process.env.APP_NAME || '{{APP_NAME}}',
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Discord
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    guildId: process.env.DISCORD_GUILD_ID,
    prefix: process.env.COMMAND_PREFIX || '!',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Redis
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },

  // API Service
  api: {
    port: parseInt(process.env.API_PORT, 10) || 3001,
    url: process.env.API_SERVICE_URL || 'http://localhost:3001',
    key: process.env.API_KEY,
  },

  // Bot Service
  bot: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  // Dashboard
  dashboard: {
    port: parseInt(process.env.DASHBOARD_PORT, 10) || 3002,
    url: process.env.DASHBOARD_URL || 'http://localhost:3002',
  },

  // Encryption
  encryption: {
    key: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  },
};

module.exports = config;