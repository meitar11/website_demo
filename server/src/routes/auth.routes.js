'use strict';

const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     responses:
 *       201: { description: User created, returns a JWT }
 *       409: { description: Email already registered }
 *       422: { description: Validation error }
 * /auth/login:
 *   post:
 *     summary: Log in and receive a JWT
 *     tags: [Auth]
 *     responses:
 *       200: { description: Authenticated, returns a JWT }
 *       401: { description: Invalid credentials }
 * /auth/me:
 *   get:
 *     summary: Get the current authenticated user
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: The current user }
 *       401: { description: Missing or invalid token }
 */
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
