<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SignalBrief agent guidelines

Project rules live in `.cursor/rules/` and are always applied:

- **security-and-secrets** — no keys, paths, or real PII in commits
- **tdd-workflow** — failing test first (unit → integration → E2E); `npm test` before commit
- **git-push-safety** — auto-commit on `develop` when hooks pass; ask before every push
- **documentation** — keep README and `docs/` in sync with code changes
- **simplicity** — lightweight showcase; readable code over enterprise patterns

## Branches

- Work on **`develop`**; merge tested milestones to **`main`**

Pre-commit Husky runs secret/PII scan + tests. Do not use `--no-verify` without explicit user approval.

