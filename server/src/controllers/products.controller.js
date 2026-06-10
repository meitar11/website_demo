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

module.exports = { getProducts, getProductById, getCategories };
