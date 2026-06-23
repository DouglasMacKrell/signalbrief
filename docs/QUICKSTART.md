# Quickstart

Get SignalBrief running locally in about 10 minutes. Works on macOS, Linux, or Windows with Docker.

> **Ollama default:** `OLLAMA_MODEL` is **`qwen3:14b`** — the model this project is developed and tested against. You do not need to change it if you already have it installed. For faster responses or lower memory use, see [lighter alternatives](#choosing-a-model).

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20+ | `node -v` |
| Docker | recent | Local Postgres via `docker compose` |
| Git | any | Clone the repo |
| Ollama | optional | Local AI briefings only — skip if using rules fallback |

## 1. Clone and install

```bash
git clone https://github.com/DouglasMacKrell/signalbrief.git
cd signalbrief
npm install
```

Use the `develop` branch for the latest work; `main` holds stable milestones.

## 2. Configure environment

```bash
cp .env.example .env
```

### Option A — Rules fallback (simplest, no AI setup)

Works everywhere. Briefings are generated deterministically from risk signals — ideal for CI, Render, or a first run.

```env
BRIEFING_PROVIDER=rules-fallback
OLLAMA_ENABLED=false
```

### Option B — Ollama briefings (local AI)

```env
BRIEFING_PROVIDER=ollama
OLLAMA_ENABLED=true
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:14b
```

`DATABASE_URL` in `.env.example` matches the Docker Postgres settings below — no edit needed for local dev.

## 3. Start Postgres and seed data

```bash
docker compose up -d
npm run db:setup    # migrate + seed 5 demo accounts
```

## 4. (Optional) Ollama setup

Skip if you chose **Option A**.

```bash
# Install Ollama: https://ollama.com
npm run ollama:check   # verifies reachability + model pull
curl http://127.0.0.1:11434/api/tags

# Project default model
ollama pull qwen3:14b
```

### Choosing a model

SignalBrief sends structured account context and expects JSON back. **`qwen3:14b`** is the project default — use it unless you have a reason to switch.

| Tier | Model | Approx. RAM | When to use |
|---|---|---|---|
| **Default** | `qwen3:14b` | ~10 GB | Project default; best quality for structured briefings |
| **Balanced** | `qwen3:8b` | ~6 GB | Faster responses, still strong JSON output |
| **Balanced** | `qwen2.5:7b` | ~5 GB | Widely available alternative |
| **Lightweight** | `llama3.2:3b` | ~2 GB | Quick demos or very tight RAM |
| **Lightweight** | `phi3:mini` | ~2 GB | Snappy, simpler briefings |
| **Lightweight** | `qwen2.5:3b` | ~2 GB | Minimal footprint |

```env
OLLAMA_MODEL=qwen3:14b
```

**Tips**

- Match `OLLAMA_MODEL` to what `ollama list` shows — any tier above works.
- First inference with a large model can take 30–90s; the app allows up to 120s.
- For screen shares, kick off **Generate Briefing** before you narrate the result.

**Security:** Ollama must stay on `127.0.0.1` or `localhost` only. Never bind `0.0.0.0:11434`. SignalBrief rejects non-localhost URLs.

## 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

> **Port note:** SignalBrief dev runs on **3001** by default. Port 3000 is often taken by Docker Desktop or other local tools on macOS — if you see a non-SignalBrief page or broken WebSocket/HMR errors at `:3000`, use `:3001` instead.

## 6. Try the demo

1. Open **Acme Creative** — healthy expansion, few risks  
2. Click **Generate Briefing** — note the provider label (`ollama (qwen3:14b)` or `rules-fallback`)  
3. Switch to **Northstar Logistics** — high-risk renewal with evidence-backed risk cards  
4. Submit **Helpful / Not helpful** feedback  

| Account | Profile |
|---|---|
| Acme Creative | Healthy expansion |
| Northstar Logistics | High-risk renewal |
| Brightline Health Clinic | Moderate renewal — mixed signals |
| Summit Legal Partners | Enterprise stable renewal |
| Harbor Foods Co-op | Early-stage deal, stalled discovery |

Full walkthrough: [demo-guide.md](./demo-guide.md).

## 7. Run tests (TDD)

Tests are layered — write a failing test before changing behavior. See `.cursor/rules/tdd-workflow.mdc`.

**Prerequisites:** Docker Postgres running (`docker compose up -d`).

```bash
npm run test:unit          # Fast — domain, providers, schemas (no DB)
npm run test:integration   # Postgres — services + API routes
npm run test:e2e           # Playwright — browser flows (production build on :3456)
npm test                   # Unit + integration (pre-commit hook)
npm run test:all           # Everything — run before merging to main
npm run test:coverage      # Unit coverage report
```

First-time E2E setup:

```bash
npx playwright install chromium
npm run test:e2e
```

Each step has a timeout and fails fast with a actionable message (Postgres down, port in use, missing browser, server never ready). Typical full E2E run is under 2 minutes when healthy.

CI runs all layers on push/PR to `main` and `develop`.

## Common commands

```bash
npm run dev              # Dev server
npm run db:seed          # Re-seed demo data
npm run db:setup         # Migrate + seed
npm run security:scan    # Scan staged files for secrets
npm run build            # Production build check
```

## Troubleshooting

### Browser shows wrong app or WebSocket / HMR errors

Port **3000** may be used by Docker or another tool (not SignalBrief). Use the dev URL:

```bash
npm run dev
# → http://localhost:3001
```

Check what is bound to 3000:

```bash
lsof -i :3000
curl -I http://127.0.0.1:3000/
```

E2E tests use port **3456** (`PLAYWRIGHT_PORT`) with a production build — not the dev server.

### No accounts on the home page

```bash
docker compose ps
npm run db:setup
```

### Briefing fails with Ollama

1. `curl http://127.0.0.1:11434/api/tags`  
2. `ollama list` — confirm `qwen3:14b` (or your `OLLAMA_MODEL`) is present  
3. Try a lighter model if needed: `OLLAMA_MODEL=llama3.2:3b`  
4. Fall back: `BRIEFING_PROVIDER=rules-fallback` and `OLLAMA_ENABLED=false`  

### Pre-commit hook fails

Integration tests need Postgres:

```bash
docker compose up -d
npm run security:scan:all
npm test
```

## Production / Render

Deployed environments use **rules-fallback only** — no Ollama. See [deployment.md](./deployment.md).

## Next steps

- [architecture.md](./architecture.md) — system design  
- [security.md](./security.md) — secrets and LLM boundaries  
- [deployment.md](./deployment.md) — deploy to Render  
