# Demo guide

A product-focused walkthrough for screen sharing. Fictional companies and data only.

## Problem (30 seconds)

Revenue teams prep for customer calls by jumping between CRM, call recordings, support tickets, and product usage dashboards. Context is scattered; renewal risk is easy to miss.

## Account selector

Open the app and choose between two contrasting demo accounts:

### Acme Creative — healthy expansion

- Mid-Market creative agency, ~85 employees
- Opportunity in **Negotiation**, strong probability
- Recent calls: positive themes (payroll automation, contractor onboarding)
- No open support tickets
- Product health trending **up**

**What to show:** Clean panels, low or no risk signals. Generate a briefing and point to evidence IDs tied to source records.

### Northstar Logistics — high-risk renewal

- SMB logistics company, ~38 employees
- Opportunity in **Renewal**, stalled in stage
- Recent calls: negative themes (payroll errors, support frustration)
- **High-priority support ticket** open multiple days
- Product health trending **down**, low score

**What to show:** Risk cards with severity badges and linked evidence. Briefing next-best-action. Stale-data banner if sources are outdated.

## Features to highlight

| Panel | Talking point |
|---|---|
| Account overview | Canonical identity + data freshness |
| Opportunity | Pipeline stage, amount, days in stage |
| Recent calls | Themes and excerpts from Gong-style data |
| Support | Open ticket priority and age |
| Product health | Score, usage trend, active users |
| Risk signals | Deterministic rules—not LLM guesses |
| AI briefing | Structured JSON, evidence citations, provider label |
| Feedback | Helpful / not helpful captured for iteration |

## Trust boundaries (1–2 minutes)

- Risks are computed in code before any briefing is generated
- Briefing output is schema-validated; bad output is rejected
- `briefing_runs` table provides an audit trail
- UI states: _SignalBrief does not write back to source systems without explicit user confirmation_

## Suggested flow (~10 minutes)

1. Problem framing
2. Architecture (README or `docs/architecture.md` diagram)
3. Acme Creative — healthy path
4. Northstar Logistics — at-risk path
5. Trust boundaries and production roadmap
6. Q&A

## After deploy

Replace the placeholder demo URL in the root README with your Render app URL.
