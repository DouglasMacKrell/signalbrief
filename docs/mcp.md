# MCP agent layer

SignalBrief exposes **read-only** MCP tools so **internal GTM workflows** (prep agents, Slack bots, workflow steps) can consume the same canonical account data as the dashboard—without duplicating Salesforce/Gong/Zendesk glue or granting write access.

**This is not the interview screen-share demo.** Lead with the [live web app](https://signalbrief-web.onrender.com). Mention MCP only when discussing how the domain layer composes for automation.

Briefing generation stays in the web app (validation + `briefing_runs` audit). MCP tools return read paths only.

## Tools

| Tool | Purpose |
|---|---|
| `list_accounts` | Account picker for workflows |
| `get_account_context` | Unified CRM, calls, support, health payload |
| `get_risk_signals` | Deterministic risk cards with evidence |
| `get_recent_calls` | Gong-style conversation data |
| `get_open_support_tickets` | Open/pending Zendesk-style tickets |

## Interview talking point

> “We normalized account context once. The dashboard is one consumer. If we added a pre-call prep agent or internal bot, it would call the same read-only tools—not a separate integration per channel, and not write-back to Salesforce.”

## Local development (optional)

Prerequisites: Docker Postgres + seeded data (`docker compose up -d && npm run db:setup`).

```bash
npm run mcp
```

Stdio transport for MCP-compatible clients that spawn a subprocess. Example config for local experimentation is in `.cursor/mcp.json` (gitignored).

## Production note

The public Render demo does **not** expose MCP over HTTP. A dedicated MCP service could sit beside the web app in production (see [architecture.md](./architecture.md)).
