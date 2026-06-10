'use strict';

const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'website-demo API',
      version: '1.0.0',
      description:
        'REST API for the ShopDemo demo storefront. Used as a CI and dependency-scanning test target.',
    },
    servers: [{ url: '/api', description: 'API base path' }],
    tags: [
      { name: 'Health' },
      { name: 'Products' },
      { name: 'Auth' },
      { name: 'Contact' },
    ],
  },
  // Scan route files for @openapi JSDoc annotations.
  apis: [path.join(__dirname, '..', 'routes', '*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
