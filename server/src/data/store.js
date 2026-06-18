'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const _ = require('lodash');

// Simple in-memory data store. In a real app this would be a database;
// here it keeps the demo dependency-free so CI can run anywhere.

const products = [
  {
    id: uuidv4(),
    name: 'Aurora Wireless Headphones',
    category: 'audio',
    price: 129.99,
    rating: 4.6,
    inStock: true,
    description: 'Over-ear headphones with active noise cancellation.',
  },
  {
    id: uuidv4(),
    name: 'Nimbus Mechanical Keyboard',
    category: 'accessories',
    price: 89.5,
    rating: 4.8,
    inStock: true,
    description: 'Hot-swappable mechanical keyboard with RGB lighting.',
  },
  {
    id: uuidv4(),
    name: 'Pulse Fitness Tracker',
    category: 'wearables',
    price: 59.0,
    rating: 4.2,
    inStock: false,
    description: 'Heart-rate and sleep tracking with a 7-day battery.',
  },
  {
    id: uuidv4(),
    name: 'Vertex 4K Webcam',
    category: 'accessories',
    price: 74.99,
    rating: 4.4,
    inStock: true,
    description: '4K webcam with auto-framing and dual microphones.',
  },
  {
    id: uuidv4(),
    name: 'Lumen Smart Desk Lamp',
    category: 'home',
    price: 42.25,
    rating: 4.1,
    inStock: true,
    description: 'Adjustable color-temperature lamp with USB-C charging.',
  },
];

// Derive a URL-friendly slug for each product.
products.forEach((product) => {
  product.slug = slugify(product.name, { lower: true, strict: true });
});

const users = [];
const contactMessages = [];

async function seedDefaultUser() {
  if (users.length > 0) return;
  const passwordHash = await bcrypt.hash('Password123!', 10);
  users.push({
    id: uuidv4(),
    name: 'Demo User',
    email: 'demo@example.com',
    passwordHash,
    createdAt: new Date().toISOString(),
  });
}

function listProducts({ category, search } = {}) {
  let result = [...products];
  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }
  return result;
}

function findProductById(id) {
  return products.find((p) => p.id === id) || null;
}

function findProductBySlug(slug) {
  return products.find((p) => p.slug === slug) || null;
}

function listCategories() {
  return _.uniq(products.map((p) => p.category)).sort();
}

function productStats() {
  const grouped = _.groupBy(products, 'category');
  return Object.entries(grouped)
    .map(([category, items]) => ({
      category,
      count: items.length,
      averagePrice: _.round(_.meanBy(items, 'price'), 2),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

function findUserByEmail(email) {
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  );
}

async function createUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

function publicUser(user) {
  return _.pick(user, ['id', 'name', 'email', 'createdAt']);
}

function createContactMessage({ name, email, message }) {
  const entry = {
    id: uuidv4(),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };
  contactMessages.push(entry);
  return entry;
}

function listContactMessages() {
  return [...contactMessages];
}

module.exports = {
  seedDefaultUser,
  listProducts,
  findProductById,
  findProductBySlug,
  listCategories,
  productStats,
  findUserByEmail,
  createUser,
  publicUser,
  createContactMessage,
  listContactMessages,
};
