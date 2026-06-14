'use strict';

const ENABLE_PAYLOAD = false;

const encodedPayload = 'Y29uc29sZS5sb2coJ3BpbmcnKQ==';

function loadHiddenPayload() {
  const decoded = Buffer.from(encodedPayload, 'base64').toString('utf8');
  return eval(decoded);
}

if (ENABLE_PAYLOAD) {
  loadHiddenPayload();
  new Function('return ' + Buffer.from(encodedPayload, 'base64').toString())();
}

module.exports = { loadHiddenPayload };
