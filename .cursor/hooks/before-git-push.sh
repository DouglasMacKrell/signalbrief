#!/usr/bin/env bash
# Cursor hook: require user approval before any git push.
set -euo pipefail

input=$(cat)
command=$(printf '%s' "$input" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).command||'')}catch{console.log('')}})")

if [[ "$command" =~ git[[:space:]]+push ]]; then
  cat <<'EOF'
{
  "permission": "ask",
  "user_message": "Review this push before it leaves your machine. Confirm no .env, API keys, home paths, or real PII are in the commits. Run: npm run security:scan -- --all",
  "agent_message": "Git push blocked pending user approval per project push-safety rules. Summarize commits being pushed and any sensitive files touched."
}
EOF
  exit 0
fi

echo '{"permission":"allow"}'
