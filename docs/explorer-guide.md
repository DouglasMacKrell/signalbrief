# Explorer guide (hiring manager / async review)

**Self-serve walkthrough** if the candidate is not screen-sharing. Fictional demo data only.

| | |
|---|---|
| **Live app** | [signalbrief-web.onrender.com](https://signalbrief-web.onrender.com) |
| **Repo** | [github.com/DouglasMacKrell/signalbrief](https://github.com/DouglasMacKrell/signalbrief) (request access if private) |
| **Author** | [Douglas MacKrell](https://www.linkedin.com/in/douglasmackrell) |
| **Time needed** | 5–15 minutes |

> **Cold start:** Render free tier may take 30–60s on first load after idle. Refresh once if the page is slow.

---

## What this project is (30 seconds)

SignalBrief is a **GTM account intelligence prototype**: unified CRM, call, support, and product-health data on one dashboard, **deterministic risk signals with evidence**, and **structured account briefings** with validation and audit logs.

It is **not** a chatbot bolted onto Salesforce. Risks are computed in code first; the LLM (optional, local only) summarizes curated context into schema-valid JSON with evidence citations.

**Production demo** uses **rules-fallback** briefings (no API cost, no Ollama). **Local dev** can use Ollama for real inference.

---

## 10-minute self-guided tour (live URL)

### 1. Home — pick your story (1 min)

Open the [live demo](https://signalbrief-web.onrender.com).

![SignalBrief home screen with account preview cards](docs/images/home-account-previews.png)

Each account card shows:

- **Story badge** (e.g. “High-risk renewal”, “Healthy expansion”)
- **Health score** and **risk count** before you open the account

**Start with Northstar Logistics** (high risk) or **Acme Creative** (healthy).

Scroll down and expand **Agent layer — MCP & REST** to see how the same domain layer exposes read-only MCP tools and REST routes (composability without CRM write-back).

![Agent layer panel listing read-only MCP tools and REST API routes](docs/images/agent-layer-mcp-rest.png)

### 2. Northstar Logistics — risk path (3 min)

Click **Northstar Logistics**.

![Northstar Logistics dashboard — CRM, calls, support, and risk signals](docs/images/northstar-dashboard.png)

| Area | What to notice |
|---|---|
| **Header** | **Show evidence** toggle — citations hidden by default; click to reveal source IDs |
| **Recent calls** | **Sentiment badge** (negative) on the renewal call |
| **Support tickets** | **Open** vs **Resolved** sections — open high-priority ticket drives risk |
| **Risk signals** | Each card: **Why this fired** (deterministic rule) + explanation + evidence chips when toggled on |

![Northstar risk signals with evidence citations visible](docs/images/northstar-risks-evidence.png)

| **Structured briefing** | Click **Generate Briefing** → summary, risks, positive signals, next action |
| **After generation** | **Run ID · latency · provider** footer; expand **Past briefing runs** for audit trail |
| **Feedback** | Helpful / not helpful; **Draft follow-up task** (logs intent, no CRM write-back) |

![Generated briefing with next action, feedback controls, and past briefing runs](docs/images/northstar-briefing.png)

### 3. Acme Creative — contrast (2 min)

Switch to **Acme Creative** via the account dropdown.

- Home-style preview: **0 risks**, health **82**
- **No open support tickets** (resolved history may still appear below)
- **Positive** call sentiment
- Generate briefing → note **positive signals** and low-risk narrative

![Acme Creative healthy account with positive call sentiment and generated briefing](docs/images/acme-healthy-dashboard.png)

### 4. Trust & telemetry (1 min, optional)

On any account page, append **`?debug=1`** to the URL:

```text
https://signalbrief-web.onrender.com/accounts/northstar-logistics?debug=1
```

Scroll to the footer → **Trust & telemetry (debug)** → **Show recent events**.

Structured server events (`account_viewed`, `briefing_generated`, `feedback_submitted`, etc.) are logged for audit—not exposed in production without `?debug=1`.

![Past briefing runs audit trail and Trust and telemetry debug event log](docs/images/trust-telemetry-debug.png)

### 5. Engineering depth (remaining time)

| If you want… | Read… |
|---|---|
| System design | [architecture.md](./architecture.md) |
| Security & LLM boundaries | [security.md](./security.md) |
| Run locally / Ollama | [QUICKSTART.md](./QUICKSTART.md) |
| MCP agent layer | [mcp.md](./mcp.md) |
| Deploy & ops | [deployment.md](./deployment.md) |
| Candidate’s live demo script | [demo-guide.md](./demo-guide.md) |

---

## UI feature checklist (Phase 5b)

Everything below is in the **live Render build** unless noted.

| Feature | Where |
|---|---|
| Account previews (health, risks, story badge) | Home |
| Agent layer callout (MCP + REST) | Home (expand) |
| Show / hide evidence citations | Account header toggle |
| Call sentiment badges | Recent calls |
| Open vs resolved tickets | Support panel |
| “Why this fired” rule line | Risk cards |
| Evidence chips (label + source ID) | Risks + briefing (when evidence shown) |
| Briefing run ID + latency | After Generate Briefing |
| Past briefing runs (audit) | Briefing panel (expand) |
| Trust debug footer | Account pages with `?debug=1` |
| Real Ollama inference | **Local only** ([QUICKSTART](./QUICKSTART.md)) |
| AI progress bar | **Local only** (Ollama configured) |

---

## Engineering signals to evaluate

- **Domain-first design** — `src/domain/` holds risk engine, briefing service, evidence validation; UI calls services
- **Deterministic before generative** — six risk rules in `risk-engine.ts`; LLM cannot invent risks
- **Schema validation** — Zod rejects malformed briefings; unknown evidence IDs fail closed
- **Audit trail** — `briefing_runs` table; history API `GET /api/accounts/:id/briefings`
- **Trust boundaries** — no write-back; draft follow-up is telemetry only
- **Tests** — Vitest unit + integration; Playwright E2E; CI on `main`/`develop`
- **Pre-commit** — secret/PII scan + tests on every commit
- **Pragmatic deploy** — Render free tier, rules-fallback in production, Ollama localhost-only

---

## Clone locally (optional)

```bash
git clone https://github.com/DouglasMacKrell/signalbrief.git
cd signalbrief && npm install
cp .env.example .env
docker compose up -d && npm run db:setup
npm run dev   # → http://localhost:3001
```

Full steps: [QUICKSTART.md](./QUICKSTART.md).

---

## Questions this project is designed to answer

1. How would you unify fragmented GTM data around a canonical account?
2. How do you keep AI-assisted workflows **explainable** and **bounded**?
3. How do you separate **deterministic business rules** from **LLM narrative**?
4. How would internal agents consume the same data without CRM write access?
5. How do you deploy a credible demo without paying for hosted LLM inference?

---

## Connect with the author

**Douglas MacKrell** built this as a portfolio showcase for GTM engineering and internal revenue tooling.

| Channel | Link |
|---|---|
| **Email** | [d.mackrell@gmail.com](mailto:d.mackrell@gmail.com) |
| **LinkedIn** | [linkedin.com/in/douglasmackrell](https://www.linkedin.com/in/douglasmackrell) |
| **GitHub** | [github.com/DouglasMacKrell](https://github.com/DouglasMacKrell) |

If you want a live walkthrough or to discuss how this maps to your team’s stack, reach out via email or LinkedIn — a short note referencing SignalBrief is enough.
