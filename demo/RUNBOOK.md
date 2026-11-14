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
| 2 | `npm install @flex-ng/filter-pipe@1.1.0` | `npm error 403 ... Hour0 blocked @flex-ng/filter-pipe@1.1.0 - MALICIOUS (Trojan Packages)` and four evidence lines with file and line |
| 3 | Browser tab 2, refresh | Top row: the package, Malicious, Blocked, a few seconds ago |
| 4 | `cd ../..` | Back in the repo root for part 2 |

Scripted version of step 2, with pass/fail checks: `./demo/run_gatekeeper.sh` from the repo root.

## Part 2 - the pull request check (about 30 seconds)

| Step | You do | The audience sees |
|---|---|---|
| 1 | `./demo/run_pr.sh` | PR URL after about 5 seconds, then one line per Hour0 check as it finishes (about 14 seconds) |
| 2 | Open the printed URL | `Hour0 Dependency Scan` failed, `Hour0 Source Scan` needs action, `Hour0 Repo Guard` passed |
| 3 | Click `Hour0 Dependency Scan` | `Blocked: 1 malicious dependency`, the package and the reason |
| 4 | Click `Hour0 Source Scan` | `Flagged (alert-only): 1 source finding`, the file `server/src/utils/telemetry.ts` and what the code does |
| 5 | Optional: Files changed tab | The one-line dependency change and the mock file |
| 6 | Optional: browser tab 3 | The same run in the Hour0 dashboard |

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

## What this demo does and does not show

- The dependency is a real package that npm has since removed. Hour0 blocks it from the verdict it
  recorded when it scanned the package. It is not being scanned again live.
- The pull request is blocked by the dependency. The mock source file is flagged for review, not blocked.
- The mock file is harmless: it reads one placeholder env var and one placeholder file from
  `demo/fixtures/`, and its only network call goes to a `.invalid` host that cannot resolve.
- `demo/gatekeeper/.npmrc` sets `ignore-scripts=true`, so nothing from a package would run even if
  an install went through.
