# Hour0 live demo runbook

Two parts, about 2 minutes of commands in total. Measured on 2026-11-14 against production,
four runs in a row: part 1 took 11 to 12 seconds, part 2 took 13 to 14 seconds, same text every run.

## Pre-flight (10 minutes before)

- [ ] Network up. `gh auth status` shows you logged in as `meitar11`.
- [ ] Terminal in the repo root, font large. Run `source demo/env.sh` (loads the Gatekeeper token
      from `~/.npmrc` into `HOUR0_TOKEN`; prints nothing when it works).
- [ ] One full rehearsal: `./demo/reset.sh && ./demo/run_gatekeeper.sh && ./demo/run_pr.sh`.
      All three must end with `OK`. This also warms the npm cache.
- [ ] `./demo/reset.sh` again. It must end with `RESET OK` and `open demo PRs: 0`.
- [ ] Browser tabs, logged in:
  1. https://github.com/meitar11/website_demo/pulls
  2. https://platform.hour0.ai/gatekeeper
  3. https://platform.hour0.ai/advisory
- [ ] `demo/backup/` open in Finder, in case the network fails.

## Part 1 - Gatekeeper blocks an install (about 15 seconds)

| Step | You do | The audience sees |
|---|---|---|
| 1 | `cd demo/gatekeeper && cat .npmrc` | The project sends npm installs through `registry.hour0.ai` |
| 2 | `npm install is-number@7.0.0` | A normal package installs in about 1 second: `added 1 package`, `found 0 vulnerabilities` |
| 3 | `npm install @flex-ng/filter-pipe@1.1.0` | `npm error 403 ... Hour0 blocked @flex-ng/filter-pipe@1.1.0 - MALICIOUS (Trojan Packages)` and four evidence lines with file and line |
| 4 | Browser tab 2, refresh | Top rows: `@flex-ng/filter-pipe` Malicious, Blocked, and `is-number` Delivered, both a few seconds ago |
| 5 | `cd ../..` | Back in the repo root for part 2 |

The folder's `.npmrc` sets `save=false` and `package-lock=false`, so an install here never edits
`package.json`. Both packages are answered from verdicts Hour0 already holds.

Scripted version of step 3, with pass/fail checks: `./demo/run_gatekeeper.sh` from the repo root.

## Part 2 - the pull request check (about 30 seconds)

| Step | You do | The audience sees |
|---|---|---|
| 1 | `./demo/run_pr.sh` | PR URL after about 5 seconds, then one line per Hour0 check as it finishes (about 14 seconds) |
| 2 | Open the printed URL | `Hour0 Dependency Scan` failed, `Hour0 Source Scan` failed, `Hour0 Repo Guard` passed |
| 3 | Click `Hour0 Dependency Scan` | `Blocked: 1 malicious dependency`, the package and the reason |
| 4 | Click `Hour0 Source Scan` | `Blocked: 1 malicious source finding`, the file `server/src/utils/telemetry.ts`, what the code does, and `Confirmed on second review` |
| 5 | Browser tab 3, expand the new run | The package's findings with code, and where it sends data: `outbound host: o4510485815754752.ingest.us.sentry.io` and the URL line under `src/index.js:7`. Below it, three AI findings for the mock file |
| 6 | Back on GitHub: Files changed tab, `server/src/utils/telemetry.ts` | The lines behind the three AI findings: the credentials file read, the env token, and the `https://img-cdn-edge-cache-...` URL |

The Advisory page lists the AI findings for the mock file as text, without the code lines. Step 6
is where the audience sees the code.

The pull request adds `@flex-ng/filter-pipe` 1.1.0 to `server/package.json` and adds
`server/src/utils/telemetry.ts`, a copy of `demo/fixtures/telemetry.ts`.

## After the demo

`./demo/reset.sh` closes the pull request, deletes the branch `demo/hour0-live` and returns to `main`.

## If a step hangs for more than 60 seconds

| Where | What to do |
|---|---|
| `npm install` in part 1 | Ctrl-C, run it once more. Still stuck: show `demo/backup/gatekeeper-block.png`. |
| `run_pr.sh` prints no PR URL | Ctrl-C, `./demo/reset.sh`, run it once more. |
| PR is open, checks do not appear | Refresh the PR page once. Still nothing: show `demo/backup/pr-dependency-scan.png` and `demo/backup/pr-source-scan.png`. The script itself gives up after 300 seconds with a clear message. |
| Any script prints `FAILED` | Read the line, it says which step. Do not improvise: go to the backup screenshots. |

## Do not say

- That Hour0 scanned the blocked package just now, or that its AI analysis catches it today. Say:
  "Hour0 flagged this package in October and has blocked it since."
- That the block message in the terminal shows where the data goes. The destination is on the
  Advisory page only.
- That the Advisory page shows the code lines for source findings. Show them on GitHub.
- That the merge is blocked, unless the three Hour0 checks are set as required on `main`.
- Anything about pip or PyPI on the Gatekeeper, or about suspicious packages being blocked at
  install. Only malicious ones are.
- Do not click the `details:` link in the block message. That page does not exist.

## Before the meeting: change nothing in production

No deploy, no model promotion and no re-scan of `@flex-ng/filter-pipe` until the demo is over. The
block rests on one stored verdict (scan 2715). Its display text was corrected by hand on 2026-11-15
(real outbound host, full URL line); the verdict was not touched.

## What this demo does and does not show

- The dependency is a real package that npm has since removed. Hour0 blocks it from the verdict it
  recorded when it scanned the package. It is not being scanned again live.
- Both the dependency and the mock source file are rated malicious, and both checks fail. Measured
  on 2026-11-14: the source check returned malicious in 5 of 5 runs. The same code pointed at a
  `.invalid` host is rated suspicious instead, because Hour0 treats a placeholder host as a payload
  that is not armed yet.
- The mock file is harmless: it reads one placeholder env var and one placeholder file from
  `demo/fixtures/`, and its only network call names a host that can never exist: one part of the name is 69 characters,
  over the 63-character limit of DNS, so no lookup and no connection can happen. The file's own
  comment only says it is a demo fixture; the full explanation is here, not in the file.
- `demo/gatekeeper/.npmrc` sets `ignore-scripts=true`, so nothing from a package would run even if
  an install went through.
