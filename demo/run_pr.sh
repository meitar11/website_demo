#!/usr/bin/env bash
# Part 2: open a pull request that adds a malicious dependency and mock malicious source code,
# then wait for the Hour0 checks. Same branch name and same content every run.
# Exits 0 only if the PR was created and the Hour0 checks flagged it.
set -euo pipefail
REPO='meitar11/website_demo'
BRANCH='demo/hour0-live'
DEP_NAME='@flex-ng/filter-pipe'
DEP_VERSION='1.1.0'
WAIT_SECONDS="${WAIT_SECONDS:-300}"
CHECKS=('Hour0 Dependency Scan' 'Hour0 Source Scan' 'Hour0 Repo Guard')
fail() { echo; echo "PR DEMO FAILED: $*" >&2; exit 1; }

cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
[ "$(git branch --show-current)" = main ] || fail "not on main - run demo/reset.sh first"
[ -z "$(git status --porcelain --untracked-files=no)" ] || fail "uncommitted changes - run demo/reset.sh first"
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  fail "branch $BRANCH already exists on GitHub - run demo/reset.sh first"
fi
git show-ref --verify --quiet "refs/heads/$BRANCH" && fail "local branch $BRANCH exists - run demo/reset.sh first"

START=$(date +%s)
git checkout -q -b "$BRANCH"

# (a) the new dependency, pinned, in the server manifest
DEP_NAME="$DEP_NAME" DEP_VERSION="$DEP_VERSION" node -e '
  const fs = require("fs");
  const file = "server/package.json";
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  pkg.dependencies[process.env.DEP_NAME] = process.env.DEP_VERSION;
  pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
'
# (b) the mock malicious source file
cp demo/fixtures/telemetry.ts server/src/utils/telemetry.ts

git add server/package.json server/src/utils/telemetry.ts
# [skip ci] keeps the repo's own GitHub Actions jobs off this branch; the Hour0 checks still run.
git commit -q -m "feat(server): product filter pipe and usage telemetry [skip ci]"
git push -q -u origin "$BRANCH" 2>/dev/null || fail "git push failed"
SHA=$(git rev-parse HEAD)
git checkout -q main

URL=$(gh pr create -R "$REPO" --base main --head "$BRANCH" \
  --title "Add product filter pipe and usage telemetry" \
  --body "Adds \`$DEP_NAME\` for product list filtering and a small usage telemetry helper.

Demo pull request for the Hour0 checks. Do not merge.") || fail "pull request was not created"
echo "PR opened in $(( $(date +%s) - START ))s: $URL"
echo "Waiting for the Hour0 checks (up to ${WAIT_SECONDS}s)..."

declare -a DONE=()
while :; do
  ELAPSED=$(( $(date +%s) - START ))
  RUNS=$(gh api "repos/$REPO/commits/$SHA/check-runs" \
    --jq '.check_runs[] | select(.app.slug=="hour0-security") | [.name, .status, (.conclusion // "-"), (.output.title // "-")] | @tsv')
  for NAME in "${CHECKS[@]}"; do
    case " ${DONE[*]-} " in *" ${NAME// /_} "*) continue ;; esac
    LINE=$(printf '%s\n' "$RUNS" | awk -F'\t' -v n="$NAME" '$1==n && $2=="completed"' | head -1)
    if [ -n "$LINE" ]; then
      DONE+=("${NAME// /_}")
      printf '  %3ss  %-22s %-16s %s\n' "$ELAPSED" "$NAME" "$(cut -f3 <<<"$LINE")" "$(cut -f4 <<<"$LINE")"
    fi
  done
  [ "${#DONE[@]}" -eq "${#CHECKS[@]}" ] && break
  if [ "$ELAPSED" -ge "$WAIT_SECONDS" ]; then
    [ -n "$RUNS" ] || fail "no Hour0 check started within ${WAIT_SECONDS}s - $URL"
    fail "Hour0 checks did not all finish within ${WAIT_SECONDS}s - $URL"
  fi
  sleep 4
done

conclusion() { printf '%s\n' "$RUNS" | awk -F'\t' -v n="$1" '$1==n {print $3}' | head -1; }
DEP=$(conclusion 'Hour0 Dependency Scan')
SRC=$(conclusion 'Hour0 Source Scan')
[ "$DEP" = failure ] || fail "Dependency Scan did not block the PR (conclusion: $DEP) - $URL"
case "$SRC" in
  failure|action_required) ;;
  *) fail "Source Scan did not flag the mock code (conclusion: $SRC) - $URL" ;;
esac
echo
echo "OK: dependency blocked ($DEP), source code flagged ($SRC), total $(( $(date +%s) - START ))s"
echo "$URL"
