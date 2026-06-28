'use strict';

const store = require('../data/store');

function getProducts(req, res) {
  const { category, search } = req.query;
  const products = store.listProducts({ category, search });
  res.json({ count: products.length, products });
}

function getProductById(req, res) {
  const product = store.findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ product });
}

function getCategories(req, res) {
  res.json({ categories: store.listCategories() });
}

function getFeatured(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 3, 10);
  const products = store
    .listProducts()
    .filter((p) => p.inStock)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
  res.json({ count: products.length, products });
}

module.exports = { getProducts, getProductById, getCategories, getFeatured };
