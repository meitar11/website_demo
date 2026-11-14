#!/usr/bin/env bash
# Brings the demo back to its clean starting state. Safe to run twice in a row.
set -euo pipefail
REPO='meitar11/website_demo'
BRANCH='demo/hour0-live'
fail() { echo; echo "RESET FAILED: $*" >&2; exit 1; }

cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

# 1. close any open demo PR
for N in $(gh pr list -R "$REPO" --head "$BRANCH" --state open --json number --jq '.[].number'); do
  gh pr close "$N" -R "$REPO" >/dev/null || fail "could not close PR #$N"
  echo "closed PR #$N"
done

# 2. undo demo edits left by a half-finished run, go back to main
git checkout -q -- server/package.json 2>/dev/null || true
git ls-files --error-unmatch server/src/utils/telemetry.js >/dev/null 2>&1 || rm -f server/src/utils/telemetry.js
[ -z "$(git status --porcelain --untracked-files=no)" ] || fail "uncommitted changes outside the demo files - resolve them by hand"
git checkout -q main || fail "could not check out main"
rm -f server/src/utils/telemetry.js
git pull -q --ff-only origin main || fail "could not fast-forward main"

# 3. delete the demo branch, remote and local
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  git push -q origin --delete "$BRANCH" 2>/dev/null || fail "could not delete the remote branch"
  echo "deleted remote branch $BRANCH"
fi
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git branch -q -D "$BRANCH"
  echo "deleted local branch $BRANCH"
fi
git fetch -q --prune origin

# 4. remove anything a Gatekeeper run could have left behind
rm -rf demo/gatekeeper/node_modules demo/gatekeeper/package-lock.json

# 5. verify and print the final state
OPEN=$(gh pr list -R "$REPO" --head "$BRANCH" --state open --json number --jq 'length')
[ "$OPEN" = 0 ] || fail "$OPEN demo PR still open"
git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1 && fail "remote branch $BRANCH still exists"
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || fail "local main differs from origin/main"
echo
echo "RESET OK"
echo "  branch:           $(git branch --show-current) @ $(git rev-parse --short HEAD)"
echo "  open demo PRs:    $OPEN"
echo "  demo branch:      absent (local and remote)"
echo "  gatekeeper dir:   $(ls -A demo/gatekeeper | tr '\n' ' ')"
echo "  working tree:     $(git status --porcelain | wc -l | tr -d ' ') changed files"
