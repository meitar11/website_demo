'use strict';

const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/contact.controller');

const router = express.Router();

/**
 * @openapi
 * /contact:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Message accepted
 *       422:
 *         description: Validation error
 */
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('message')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Message must be at least 10 characters'),
  ],
  controller.createMessage
);

module.exports = router;
