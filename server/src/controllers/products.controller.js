'use strict';

const { StatusCodes } = require('http-status-codes');
const store = require('../data/store');

function getProducts(req, res) {
  const { category, search } = req.query;
  const products = store.listProducts({ category, search });
  res.json({ count: products.length, products });
}

function getCategories(req, res) {
  res.json({ categories: store.listCategories() });
}

function getStats(req, res) {
  res.json({ stats: store.productStats() });
}

function getProductBySlug(req, res) {
  const product = store.findProductBySlug(req.params.slug);
  if (!product) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Product not found' });
  }
  return res.json({ product });
}

function getProductById(req, res) {
  const product = store.findProductById(req.params.id);
  if (!product) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Product not found' });
  }
  return res.json({ product });
}

module.exports = {
  getProducts,
  getCategories,
  getStats,
  getProductBySlug,
  getProductById,
};
