# Security fixtures — INERT malware test samples

> ⚠️ **These files are deliberately crafted as test fixtures for a malware /
> dependency scanner. They are NOT real malware.**

Every sample in this directory is **defanged and inert**:

- The dangerous operations are guarded behind a constant that is always `false`,
  so running any file does nothing.
- All exfiltration targets point at `example.com`, `127.0.0.1`, or the reserved
  `.invalid` TLD — never a real host.
- Any base64 / obfuscated payloads decode to harmless `console.log` strings.
- The `suspicious-dependency/` folder is **not** installed by npm (it is not a
  workspace and not referenced as a dependency), so its `postinstall` never runs.

The point is to give a static analyzer realistic **signatures** to detect
(obfuscated `eval`, credential harvesting, reverse-shell patterns, malicious
install hooks, crypto-miner invocation, typosquat-style names) without putting
any actual malicious behavior into the repository or CI runner.

This is the same idea as the [EICAR test file](https://www.eicar.org/download-anti-malware-testfile/)
for antivirus engines: a safe, standardized way to confirm a scanner works.

## Samples

| File                                   | Signature it exercises                         |
| -------------------------------------- | ---------------------------------------------- |
| `obfuscated-loader.js`                 | base64-decoded `eval` of a hidden payload      |
| `credential-harvester.js`             | reads env vars / `~/.ssh`, `~/.npmrc` and exfiltrates |
| `reverse-shell.js`                     | `net` socket piped into a spawned shell        |
| `crypto-miner.js`                      | downloads & launches a mining binary           |
| `suspicious-dependency/package.json`   | malicious `preinstall`/`postinstall` lifecycle hook |
| `suspicious-dependency/install.js`     | install-time remote code fetch + exec          |

These fixtures are excluded from ESLint, Prettier, Jest, and Vitest so the
normal CI stays green; only the dedicated security-scan job should flag them.
