'use strict';

const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const store = require('../data/store');

function createMessage(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: errors.array() });
  }

  const { name, email, message } = req.body;
  const entry = store.createContactMessage({ name, email, message });

  return res.status(StatusCodes.CREATED).json({
    message: 'Thanks for reaching out! We will get back to you shortly.',
    id: entry.id,
  });
}

module.exports = { createMessage };
