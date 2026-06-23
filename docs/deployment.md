# Deployment (Render)

## Topology

```text
Render Web Service     → Next.js app + API routes
Render Postgres        → Application database
```

Configured via `render.yaml` (added during deploy phase).

## Environment variables

| Variable | Production value | Notes |
|---|---|---|
| `DATABASE_URL` | Render Postgres internal URL | Auto-linked from database |
| `BRIEFING_PROVIDER` | `rules-fallback` | Required for reliable public demo |
| `NODE_ENV` | `production` | |
| `OLLAMA_ENABLED` | unset or `false` | Do not enable on Render |

Do **not** set `OLLAMA_BASE_URL` in production.

## Deploy steps

1. Connect the GitHub repo to Render (private repo is fine)
2. Apply the Blueprint from `render.yaml` or create services manually
3. Set env vars; link Postgres to the web service
4. Release command runs migrations + idempotent seed
5. Update the demo URL in root `README.md`

## Cold starts

Free-tier Render services spin down after ~15 minutes of inactivity. First request after idle may take **30–60 seconds**. Open the demo URL before a live interview or screen share.

## Rollback

Push small commits frequently. To rollback:

```bash
git revert <commit>
git push origin main
```

Render auto-deploys from `main`.

## Health checks

After deploy, verify:

- [ ] Account selector loads
- [ ] Both demo accounts render panels from Postgres
- [ ] Risk signals show with evidence chips
- [ ] Generate Briefing returns valid JSON (rules fallback)
- [ ] Feedback saves successfully

## Making the repo public

Render deploy does **not** require a public GitHub repo. Make the repo public separately when ready to share code with interviewers—see [security.md](./security.md) first.
