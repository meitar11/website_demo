'use strict';

const express = require('express');
const healthRoutes = require('./health.routes');
const productRoutes = require('./products.routes');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);

module.exports = router;
