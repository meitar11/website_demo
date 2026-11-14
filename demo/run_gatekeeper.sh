#!/usr/bin/env bash
# Part 1: try to install a malicious package through the Hour0 Gatekeeper registry.
# Exits 0 only if the install was blocked with the Hour0 block message.
set -uo pipefail
PKG='@flex-ng/filter-pipe@1.1.0'
REGISTRY='https://registry.hour0.ai/cyrokai/'
HERE="$(cd "$(dirname "$0")" && pwd)"
fail() { echo; echo "GATEKEEPER DEMO FAILED: $*" >&2; exit 1; }

. "$HERE/env.sh" || fail "no Gatekeeper token"
cd "$HERE/gatekeeper" || fail "demo/gatekeeper is missing"
[ "$(npm config get registry)" = "$REGISTRY" ] || fail "npm is not pointed at $REGISTRY in this folder"

START=$(date +%s)
echo "\$ npm install $PKG"
OUT=$(npm install "$PKG" 2>&1)
RC=$?
echo "$OUT" | grep -v 'A complete log of this run'
SECS=$(( $(date +%s) - START ))

if [ -d node_modules/@flex-ng ]; then
  rm -rf node_modules package-lock.json
  fail "the package was INSTALLED, not blocked (files removed, install scripts were disabled)"
fi
[ "$RC" -ne 0 ] || fail "npm exited 0, the install was NOT blocked"
echo "$OUT" | grep -q "Hour0 blocked $PKG" || fail "npm failed, but not with the Hour0 block message (exit $RC)"
echo
echo "OK: blocked by Hour0 Gatekeeper in ${SECS}s"
