'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const routes = require('./routes');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.cors.origin, credentials: true }));
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (config.env !== 'test') {
    app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
  }

  app.use(
    '/api',
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get('/', (req, res) => {
    res.json({
      name: 'website-demo API',
      version: '1.0.0',
      docs: '/api/health',
    });
  });

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
