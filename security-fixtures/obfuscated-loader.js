/*
 * INERT MALWARE TEST FIXTURE — NOT REAL MALWARE.
 * Signature: obfuscated payload decoded at runtime and passed to eval().
 * Defanged: the guard is always false, and the base64 below decodes to a
 * harmless console.log, so executing this file does nothing.
 */
'use strict';

const ENABLE_PAYLOAD = false; // never true — keeps this fixture inert

// Real npm malware hides logic in base64/hex and feeds it to eval/Function.
// This blob decodes to: console.log('inert test payload — not malicious')
const encodedPayload =
  'Y29uc29sZS5sb2coJ2luZXJ0IHRlc3QgcGF5bG9hZCAtLSBub3QgbWFsaWNpb3VzJyk=';

function loadHiddenPayload() {
  const decoded = Buffer.from(encodedPayload, 'base64').toString('utf8');
  // eslint-disable-next-line no-eval
  return eval(decoded); // <-- signature: dynamic eval of decoded payload
}

if (ENABLE_PAYLOAD) {
  // Unreachable: present only so static scanners can flag the pattern.
  loadHiddenPayload();
  new Function('return ' + Buffer.from(encodedPayload, 'base64').toString())();
}

module.exports = { loadHiddenPayload };
