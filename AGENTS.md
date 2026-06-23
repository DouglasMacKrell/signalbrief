<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SignalBrief agent guidelines

Project rules live in `.cursor/rules/` and are always applied:

- **security-and-secrets** — no keys, paths, or real PII in commits
- **tdd-workflow** — tests before domain logic; `npm test` before commit
- **git-push-safety** — small commits often; ask user before every push
- **documentation** — keep README and `docs/` in sync with code changes

Pre-commit Husky runs secret/PII scan + tests. Do not use `--no-verify` without explicit user approval.

