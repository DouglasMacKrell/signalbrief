# Demo guide

A product-focused walkthrough for screen sharing. Fictional companies and data only.

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

**Show:** Low risk count, Ollama or rules briefing with positive next steps.

### Northstar Logistics — high-risk renewal

- **Renewal** stalled 38 days · high-priority ticket open 12+ days
- Negative call themes · usage **down**, health score 41

**Show:** Risk cards with evidence chips, executive outreach in briefing.

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

| Panel | Talking point |
|---|---|
| Account overview | Canonical identity + data freshness |
| Opportunity | Pipeline stage, amount, days in stage |
| Recent calls | Themes and excerpts from Gong-style data |
| Support | Open ticket priority and age |
| Product health | Score, usage trend, active users |
| Risk signals | Deterministic rules—not LLM guesses |
| AI briefing | Structured JSON, evidence citations, provider label (`ollama` locally) |
| Feedback | Helpful / not helpful captured for iteration |

## Local Ollama demo tip

Enable in `.env`:

```env
BRIEFING_PROVIDER=ollama
OLLAMA_ENABLED=true
OLLAMA_MODEL=qwen3:14b
```

Mention: risks are computed in code first; the LLM summarizes curated context with schema validation—not free-form guessing.

## Trust boundaries (1–2 minutes)

- Risks are computed in code before any briefing is generated
- Briefing output is schema-validated; bad output is rejected
- `briefing_runs` table provides an audit trail
- UI states: _SignalBrief does not write back to source systems without explicit user confirmation_

## Suggested flow (~10 minutes)

1. Problem framing
2. Architecture ([QUICKSTART.md](./QUICKSTART.md) or [architecture.md](./architecture.md))
3. Acme Creative — healthy path + generate briefing
4. Northstar Logistics — at-risk path
5. Optional: Brightline for moderate risk
6. Trust boundaries and production roadmap
7. Q&A

## After deploy

Replace the placeholder demo URL in the root README with your Render app URL.
