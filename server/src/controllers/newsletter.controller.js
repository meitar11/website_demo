'use strict';

const validator = require('validator');
const { nanoid } = require('nanoid');

// In-memory list of newsletter subscribers (demo only).
const subscribers = [];

function subscribe(req, res) {
  const email = (req.body.email || '').trim();

  if (!validator.isEmail(email)) {
    return res.status(422).json({ error: 'A valid email is required' });
  }

  const normalized = validator.normalizeEmail(email);
  if (subscribers.some((s) => s.email === normalized)) {
    return res.status(409).json({ error: 'You are already subscribed' });
  }

  const entry = {
    id: nanoid(12),
    email: normalized,
    createdAt: new Date().toISOString(),
  };
  subscribers.push(entry);

  return res.status(201).json({ message: 'Subscribed!', id: entry.id });
}

module.exports = { subscribe };
