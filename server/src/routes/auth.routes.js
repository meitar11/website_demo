'use strict';

const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  controller.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  controller.login
);

router.get('/me', authenticate, controller.me);

module.exports = router;
