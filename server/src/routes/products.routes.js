'use strict';

const express = require('express');
const controller = require('../controllers/products.controller');

const router = express.Router();

router.get('/', controller.getProducts);
router.get('/categories', controller.getCategories);
router.get('/:id', controller.getProductById);

module.exports = router;
