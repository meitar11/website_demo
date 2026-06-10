'use strict';

const dotenv = require('dotenv');

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-only-insecure-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim()),
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 200,
  },
};

module.exports = config;
