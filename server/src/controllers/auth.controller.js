'use strict';

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const store = require('../data/store');
const { signToken } = require('../utils/token');

function collectValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return true;
  }
  return false;
}

async function register(req, res) {
  if (collectValidationErrors(req, res)) return;

  const { name, email, password } = req.body;
  if (store.findUserByEmail(email)) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  const user = await store.createUser({ name, email, password });
  const token = signToken({ sub: user.id, email: user.email });
  return res.status(201).json({ user: store.publicUser(user), token });
}

async function login(req, res) {
  if (collectValidationErrors(req, res)) return;

  const { email, password } = req.body;
  const user = store.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ sub: user.id, email: user.email });
  return res.json({ user: store.publicUser(user), token });
}

function me(req, res) {
  const user = store.findUserByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ user: store.publicUser(user) });
}

module.exports = { register, login, me };
