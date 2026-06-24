#!/usr/bin/env bash
set -euo pipefail

echo "render-build: installing dependencies…"
npm ci --include=dev

echo "render-build: building Next.js…"
npm run build

echo "render-build: preparing database (migrate + seed if empty)…"
for attempt in $(seq 1 12); do
  if npm run db:migrate && npm run db:bootstrap; then
    echo "render-build: database ready."
    exit 0
  fi
  echo "render-build: database not ready (attempt ${attempt}/12), retrying in 10s…"
  sleep 10
done

echo "render-build: database setup failed after 12 attempts." >&2
exit 1
