# Source this file: `source demo/env.sh`. Sets HOUR0_TOKEN for the Gatekeeper .npmrc.
# The token is read from ~/.npmrc on this machine. It is never stored in the repo.
if [ -z "${HOUR0_TOKEN:-}" ]; then
  HOUR0_TOKEN=$(grep -E '^//registry\.(hour0\.ai|cyrokai\.io)/cyrokai/:_authToken=' "$HOME/.npmrc" 2>/dev/null | head -1 | cut -d= -f2-)
fi
if [ -z "${HOUR0_TOKEN:-}" ]; then
  echo "demo/env.sh: no Gatekeeper token found. Set HOUR0_TOKEN or add the token line to ~/.npmrc." >&2
  return 1 2>/dev/null || exit 1
fi
export HOUR0_TOKEN
