'use strict';

const request = require('supertest');
const createApp = require('../src/app');

const app = createApp();

describe('Product routes', () => {
  it('GET /api/products returns a list with a count', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.count).toBe(res.body.products.length);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it('GET /api/products?category=audio filters by category', async () => {
    const res = await request(app)
      .get('/api/products')
      .query({ category: 'audio' });
    expect(res.status).toBe(200);
    expect(res.body.products.every((p) => p.category === 'audio')).toBe(true);
  });

  it('GET /api/products?search=keyboard filters by search term', async () => {
    const res = await request(app)
      .get('/api/products')
      .query({ search: 'keyboard' });
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it('GET /api/products/categories returns sorted categories', async () => {
    const res = await request(app).get('/api/products/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
    const sorted = [...res.body.categories].sort();
    expect(res.body.categories).toEqual(sorted);
  });

  it('GET /api/products/:id returns 404 for an unknown id', async () => {
    const res = await request(app).get('/api/products/not-a-real-id');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/products/:id returns a product for a valid id', async () => {
    const list = await request(app).get('/api/products');
    const { id } = list.body.products[0];
    const res = await request(app).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.product.id).toBe(id);
  });

  it('GET /api/products/slug/:slug returns a product by slug', async () => {
    const list = await request(app).get('/api/products');
    const { slug } = list.body.products[0];
    expect(typeof slug).toBe('string');
    const res = await request(app).get(`/api/products/slug/${slug}`);
    expect(res.status).toBe(200);
    expect(res.body.product.slug).toBe(slug);
  });

  it('GET /api/products/slug/:slug returns 404 for an unknown slug', async () => {
    const res = await request(app).get('/api/products/slug/nope-not-real');
    expect(res.status).toBe(404);
  });

  it('GET /api/products/stats returns per-category statistics', async () => {
    const res = await request(app).get('/api/products/stats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.stats)).toBe(true);
    expect(res.body.stats[0]).toHaveProperty('category');
    expect(res.body.stats[0]).toHaveProperty('count');
    expect(res.body.stats[0]).toHaveProperty('averagePrice');
  });
});
