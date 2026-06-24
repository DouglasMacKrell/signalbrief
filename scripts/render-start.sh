#!/usr/bin/env bash
# Legacy entrypoint — cold starts use `npm start` only (see render.yaml).
# Database migrate/bootstrap runs at deploy time via scripts/render-build.sh.
set -euo pipefail
exec npm start
