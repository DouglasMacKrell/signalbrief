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
4. On **deploy**, `scripts/render-build.sh` runs migrations + idempotent bootstrap (with DB retries)
5. On **cold wake**, `npm start` only — no migrations before the server binds (fast spin-up)
6. Update the demo URL in root `README.md`

## Free tier note

Render **free** web services do not support `preDeployCommand`. Database setup runs at **build time** (`render-build.sh`), not on every cold start. Bootstrap seeds demo data only when the database is empty — restarts do not wipe feedback or briefing runs.

## Cold starts

Free-tier web services [spin down after ~15 minutes of inactivity](https://render.com/docs/free). Render shows its own loading page while the instance wakes; this normally takes **about one minute**, not 20+ minutes.

**What was slowing cold starts (fixed):** `render-start.sh` used to run `db:migrate` and `db:bootstrap` *before* `npm start` on every wake. If Postgres was slow to accept connections, the app never bound to a port and Render appeared stuck on the loading screen with little useful runtime logging.

**Current behavior:**

| Phase | Command | DB work |
|---|---|---|
| Deploy / redeploy | `render-build.sh` | migrate + bootstrap (with retries) |
| Cold wake | `npm start` | none — server up immediately |
| Health check | `GET /api/health` | none — liveness only |

**Before an interview or async review:**

1. Open [the live demo](https://signalbrief-web.onrender.com) **2–3 minutes early** and wait for Render’s loading page to clear
2. Optional: run the **Keep Render warm** GitHub Action (`workflow_dispatch`) ~30 minutes before — or let the scheduled `*/14` ping run (prevents spin-down; uses free instance hours while awake)
3. If the loading page persists **more than 3–4 minutes**, trigger **Manual Deploy** in the Render dashboard (same effect as this morning’s redeploy)

**If cold starts are still abnormally slow:**

- Check Render **Events** and **Logs** for the web service after a request (logs appear once the container starts)
- Confirm you have **free instance hours** remaining this month (exhausted hours suspend free services until the next month)
- Confirm Postgres is linked and `DATABASE_URL` is set on the web service

## Rollback

Push small commits frequently. To rollback:

```bash
git revert <commit>
git push origin main
```

Render auto-deploys from `main`.

## Health checks

Live demo: [https://signalbrief-web.onrender.com](https://signalbrief-web.onrender.com)

After deploy, verify:

- [ ] All five demo accounts on home page
- [ ] Northstar dashboard shows risk signals with **Why this fired**
- [ ] Generate Briefing returns valid JSON (rules fallback)
- [ ] Past briefing runs and feedback work

## Making the repo public

Render deploy does **not** require a public GitHub repo. Make the repo public separately when ready to share code with interviewers—see [security.md](./security.md) first.
