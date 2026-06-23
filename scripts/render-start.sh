#!/usr/bin/env bash
set -euo pipefail

echo "render-start: migrating…"
npm run db:migrate

echo "render-start: bootstrapping demo data (skip if already seeded)…"
npm run db:bootstrap

echo "render-start: starting Next.js…"
exec npm start
