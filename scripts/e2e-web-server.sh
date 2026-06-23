#!/usr/bin/env bash
set -euo pipefail

PORT="${PLAYWRIGHT_PORT:-3456}"

export BRIEFING_PROVIDER="${BRIEFING_PROVIDER:-rules-fallback}"
export OLLAMA_ENABLED="${OLLAMA_ENABLED:-false}"
export DATABASE_URL="${DATABASE_URL:-postgresql://signalbrief:signalbrief@127.0.0.1:5432/signalbrief}"
export NODE_ENV=production

if [[ ! -d .next ]]; then
  echo "e2e-web-server: missing .next — run npm run build first" >&2
  exit 1
fi

if [[ "${CI:-}" == "true" ]] && lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "e2e-web-server: port ${PORT} is already in use" >&2
  echo "  Free it: lsof -i :${PORT}" >&2
  exit 1
fi

echo "e2e-web-server: starting on http://127.0.0.1:${PORT}" >&2
exec npx next start -p "${PORT}"
