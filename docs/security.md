# Security

## What never belongs in git

- `.env` and real connection strings
- API keys, tokens, private keys
- Tunnel credentials (ngrok, Cloudflare, Tailscale)
- Personal filesystem paths
- Real customer PII outside fictional demo seed data

Use `.env.example` for placeholders only. Copy to `.env` locally.

## Automated gates

### Pre-commit (Husky)

Every commit runs:

1. `npm run security:scan` — staged files checked for secrets and common PII patterns
2. `npm test` — Vitest suite must pass

Do not use `git commit --no-verify` unless you explicitly accept bypassing these checks.

### CI (GitHub Actions)

On push/PR to `main`: full-repo scan + tests (`.github/workflows/secret-scan.yml`).

### Cursor hooks

- `git push` → prompts for review before remote exposure
- `git commit --no-verify` → warns before skipping hooks

## Ollama (local only)

- Bind Ollama to `127.0.0.1` only—never `0.0.0.0`
- Never expose port `11434` publicly
- All LLM calls are server-side; no browser-to-Ollama requests
- Production deployment uses `BRIEFING_PROVIDER=rules-fallback`

## Model output safety

- Validate all briefing output with Zod
- Reject output with unknown evidence IDs
- Never execute model output as code or SQL
- Never write back to CRM/support systems without explicit user confirmation

## Repository visibility

This repo may start **private** during development. Before making it **public**:

```bash
npm run security:scan:all
```

Manually review commits for accidental leaks. Rotate any credential that was ever committed.

## Reporting issues

If you discover a secret in the repository history, rotate the credential immediately and notify the maintainer before pushing further.
