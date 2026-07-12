# Scanner test samples (Python)

Synthetic, **inert** detection fixtures — the Python counterpart to the
JS scanner samples. They exist so the CI `security-scan` job / malware
scanner has known-bad Python to catch.

These files are **not** imported by the service (`app/`) and are excluded
from the pytest suite. They contain the *shape* of malicious code — the
static patterns a scanner keys on — but every dangerous branch is dead
code guarded by `INERT = True`, and the only network target is
`192.0.2.x`, an RFC 5737 address reserved for documentation that does not
route anywhere. Nothing here can execute a payload, open a shell, or
exfiltrate data.

| File | Patterns it exercises |
| ---- | --------------------- |
| `suspicious_payload.py` | base64-decoded `exec`, `eval`, obfuscated strings, download-and-run |
| `fake_reverse_shell.py` | `socket` + `subprocess` reverse-shell scaffold, `os.system` |
