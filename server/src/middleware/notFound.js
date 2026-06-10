'use strict';

function notFound(req, res, _next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}

module.exports = { notFound };
