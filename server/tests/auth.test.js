'use strict';

const request = require('supertest');
const createApp = require('../src/app');
const store = require('../src/data/store');

const app = createApp();

beforeAll(async () => {
  await store.seedDefaultUser();
});

describe('Auth routes', () => {
  const newUser = {
    name: 'Ada Lovelace',
    email: `ada-${Date.now()}@example.com`,
    password: 'Sup3rSecret!',
  };

  it('rejects registration with invalid payload', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'not-an-email', password: 'short' });
    expect(res.status).toBe(422);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(newUser.email);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('prevents duplicate registration', async () => {
    const res = await request(app).post('/api/auth/register').send(newUser);
    expect(res.status).toBe(409);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: newUser.email, password: newUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: newUser.email, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('returns the current user for a valid token', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: newUser.email, password: newUser.password });
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(newUser.email);
  });

  it('rejects /me without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
