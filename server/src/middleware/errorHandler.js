'use strict';

const logger = require('../utils/logger');

function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    logger.error('Unhandled error: %s', err.message, { stack: err.stack });
  }
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : err.message,
  });
}

module.exports = { errorHandler };
