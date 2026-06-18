'use strict';

const request = require('supertest');
const createApp = require('../src/app');

const app = createApp();

describe('API docs', () => {
  it('serves the OpenAPI spec as JSON', async () => {
    const res = await request(app).get('/api/docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toMatch(/^3\./);
    expect(res.body.info.title).toBe('website-demo API');
    expect(res.body.paths).toHaveProperty('/contact');
  });
});
