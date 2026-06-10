'use strict';

const createApp = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const store = require('./data/store');

async function start() {
  await store.seedDefaultUser();
  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(
      `API listening on http://localhost:${config.port} [${config.env}]`
    );
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => process.exit(0));
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});
