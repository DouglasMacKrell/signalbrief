# Demo guide

A product-focused walkthrough for screen sharing. Fictional companies and data only.

**Live demo:** [https://signalbrief-web.onrender.com](https://signalbrief-web.onrender.com) (rules-fallback briefings; open before the call — free tier cold starts).

## Problem (30 seconds)

Revenue teams prep for customer calls by jumping between CRM, call recordings, support tickets, and product usage dashboards. Context is scattered; renewal risk is easy to miss.

## Five demo accounts

| Account | Segment | Story | Risk level |
|---|---|---|---|
| **Acme Creative** | Mid-Market | Expansion-ready; positive calls, usage up | Low |
| **Northstar Logistics** | SMB | Renewal at risk; payroll errors, open high-priority ticket | High |
| **Brightline Health Clinic** | Mid-Market | Mixed renewal signals; onboarding friction | Medium |
| **Summit Legal Partners** | Enterprise | Stable enterprise renewal; compliance positive | Low |
| **Harbor Foods Co-op** | SMB | Stalled discovery; long time in stage, quiet outreach | Medium |

### Acme Creative — healthy expansion

- Opportunity in **Negotiation**, strong probability
- Recent calls: payroll automation, contractor onboarding
- No open support tickets · usage **up**

**Show:** Low risk count → **Generate Briefing** → **Positive signals** section → helpful feedback.

### Northstar Logistics — high-risk renewal

- **Renewal** stalled 38 days · high-priority ticket open 12+ days
- Negative call themes · usage **down**, health score 41

**Show:** Risk cards with evidence chips → briefing with executive outreach → **Draft follow-up task** (logs intent, no CRM write-back).

### Brightline Health Clinic — moderate renewal

- Renewal in 40 days · normal open ticket on benefits docs
- Neutral call: wants better onboarding before open enrollment
- Health score 58, flat usage

**Show:** Medium risks only; balanced briefing.

### Summit Legal Partners — enterprise stable

- $120k renewal, 85% probability · positive compliance call
- No open tickets · health 76

**Show:** Clean account; contrast with Northstar.

### Harbor Foods Co-op — stalled discovery

- **Discovery** deal, 45 days in stage, last activity 26 days ago
- Pending support ticket for demo access

**Show:** Stalled opportunity + no-activity risks.

## Features to highlight

| Panel / control | Talking point |
|---|---|
| **Home cards** | Story badge, health score, risk count — pick the right demo account fast |
| **Agent layer** (home, expand) | Same domain via MCP + REST; read-only; no write-back |
| Account overview | Canonical identity + data freshness |
| Opportunity | Pipeline stage, amount, days in stage |
| Recent calls | Sentiment badge + themes/excerpts (Gong-style) |
| Support | **Open** vs **Resolved** ticket sections |
| Product health | Score, usage trend, active users |
| **Show evidence** (header) | Toggle source citations on risks and briefing |
| Risk signals | **Why this fired** rule + deterministic explanation + evidence chips |
| Structured briefing | Validated JSON; evidence on risks, signals, next action |
| After briefing | **Run ID · latency · provider** audit footer |
| **Past briefing runs** | Collapsible history from `briefing_runs` |
| Positive signals | Rules/Ollama surface strengths with evidence |
| Feedback | Helpful / not helpful + optional comment |
| Draft follow-up | Human-in-the-loop; telemetry only, no write-back |
| **`?debug=1`** | Trust footer with recent telemetry events |

## Local Ollama demo (real AI — recommended for interview)

Render uses **rules-fallback** (no API cost). For a **real LLM briefing**, run locally:

```bash
npm run ollama:check          # Ollama up + qwen3:14b pulled?
docker compose up -d
npm run db:setup
# .env: BRIEFING_PROVIDER=ollama, OLLAMA_ENABLED=true
npm run dev                   # → http://localhost:3001
```

Panel shows **AI briefing** and provider `ollama (qwen3:14b)`. First generation can take 30–90s.

![Acme Creative briefing panel configured for local Ollama inference](docs/images/local-ollama-briefing-panel.png)

**Screen-share flow:** Open Render URL for “production” data story → switch to **localhost:3001** for “here’s the same app with local Ollama inference.”

## Local Ollama config

Enable in `.env`:

```env
BRIEFING_PROVIDER=ollama
OLLAMA_ENABLED=true
OLLAMA_MODEL=qwen3:14b
```

Mention: risks are computed in code first; the LLM summarizes curated context with schema validation—not free-form guessing. **Render demo uses rules-fallback only.**

## Trust boundaries (1–2 minutes)

- Risks are computed in code before any briefing is generated
- Briefing output is schema-validated; bad output is rejected
- `briefing_runs` table provides an audit trail
- Structured telemetry logs key events in server output
- UI states: _SignalBrief does not write back to source systems without explicit user confirmation_

## Suggested flow (~10 minutes)

1. Problem framing
2. Open **live demo** → home previews + optional **Agent layer** expand
3. **Northstar Logistics** — at-risk path → **Show evidence** → risks + briefing + audit trail
4. **Acme Creative** — healthy contrast + positive signals
5. Optional: `?debug=1` trust footer · local Ollama on `:3001` if showing real AI
6. Trust boundaries and production roadmap ([architecture.md](./architecture.md))
7. Q&A — MCP only if asked ([mcp.md](./mcp.md))

## If asked about agents / GTM engineering

> “The dashboard is the seller-facing surface. The same domain services power read-only MCP tools for internal workflows—prep bots, workflow steps—without giving agents CRM write access.”

Do not demo Cursor MCP configuration in the interview unless the room is deeply technical and asks for it.
