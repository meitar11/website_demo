'use strict';

const express = require('express');
const dayjs = require('dayjs');

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Service health check
 *     tags: [Health]
 *     responses:
 *       200: { description: Service is healthy }
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: dayjs().toISOString(),
  });
});

module.exports = router;
