'use strict';

const request = require('supertest');
const createApp = require('../src/app');

const app = createApp();

describe('Contact routes', () => {
  it('rejects an invalid contact submission', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'A', email: 'nope', message: 'too short' });
    expect(res.status).toBe(422);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('accepts a valid contact submission', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Grace Hopper',
      email: 'grace@example.com',
      message: 'I love this demo storefront, great work!',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.message).toMatch(/reaching out/i);
  });
});
