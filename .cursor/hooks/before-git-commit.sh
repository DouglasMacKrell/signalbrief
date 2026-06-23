#!/usr/bin/env bash
# Cursor hook: warn when agent tries to skip pre-commit hooks.
set -euo pipefail

input=$(cat)
command=$(printf '%s' "$input" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).command||'')}catch{console.log('')}})")

if [[ "$command" =~ --no-verify|--no-gpg-sign ]]; then
  cat <<'EOF'
{
  "permission": "ask",
  "user_message": "This commit would skip pre-commit secret/PII checks. Only proceed if you explicitly accept that risk.",
  "agent_message": "User must approve bypassing Husky hooks. Prefer fixing scan failures instead."
}
EOF
  exit 0
fi

echo '{"permission":"allow"}'
