'use strict';

const express = require('express');
const dayjs = require('dayjs');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: dayjs().toISOString(),
  });
});

module.exports = router;
