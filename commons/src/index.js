/**
 * Commons library - shared utilities for {{APP_TITLE}}
 * @module @{{APP_NAME}}/commons
 */

const config = require('./config');
const logger = require('./utils/logger');
const db = require('./db');
const redis = require('./redis');
const middleware = require('./middleware');

module.exports = {
  config,
  logger,
  db,
  redis,
  middleware,
};