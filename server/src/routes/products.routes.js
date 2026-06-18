'use strict';

const express = require('express');
const controller = require('../controllers/products.controller');

const router = express.Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: A list of products }
 * /products/categories:
 *   get:
 *     summary: List product categories
 *     tags: [Products]
 *     responses:
 *       200: { description: Sorted list of categories }
 * /products/stats:
 *   get:
 *     summary: Product counts and average price per category
 *     tags: [Products]
 *     responses:
 *       200: { description: Per-category statistics }
 * /products/slug/{slug}:
 *   get:
 *     summary: Get a product by its slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The product }
 *       404: { description: Product not found }
 * /products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The product }
 *       404: { description: Product not found }
 */
// Static sub-routes must be declared before the `/:id` wildcard.
router.get('/', controller.getProducts);
router.get('/categories', controller.getCategories);
router.get('/stats', controller.getStats);
router.get('/slug/:slug', controller.getProductBySlug);
router.get('/:id', controller.getProductById);

module.exports = router;
