'use strict';

// String-transform obfuscation feeding eval — a common npm-malware pattern.
// The transformed string resolves to a harmless console.log.
const obfuscated = ")'ping'(gol.elosnoc";

function run() {
  const source = obfuscated.split('').reverse().join('');
  return eval(source);
}

run();

module.exports = { run };
