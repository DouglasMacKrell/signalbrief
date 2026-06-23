# MCP agent layer

SignalBrief exposes **read-only** MCP tools so agents (Cursor, Claude Desktop, etc.) can compose GTM account data without going through the web UI.

Briefing generation stays in the web app (validation + audit). MCP tools return the same domain payloads the dashboard uses.

## Tools

| Tool | Description |
|---|---|
| `list_accounts` | Demo account picker |
| `get_account_context` | Unified CRM, calls, support, health payload |
| `get_risk_signals` | Deterministic risk cards with evidence |
| `get_recent_calls` | Gong-style conversation data |
| `get_open_support_tickets` | Open/pending Zendesk-style tickets |

## Run locally (stdio)

Prerequisites: Docker Postgres + seeded data (`docker compose up -d && npm run db:setup`).

```bash
npm run mcp
```

The server uses **stdio** transport — designed for MCP clients that spawn a subprocess.

## Cursor configuration

Add to your user or project MCP config (adjust the absolute path):

```json
{
  "mcpServers": {
    "signalbrief": {
      "command": "npx",
      "args": ["tsx", "scripts/mcp-server.ts"],
      "cwd": "/absolute/path/to/signalbrief",
      "env": {
        "DATABASE_URL": "<same as .env.example — local Docker Postgres>"
      }
    }
  }
}
```

Restart Cursor after saving. Ask the agent to `list_accounts` or `get_risk_signals` for `northstar-logistics`.

## Example agent prompts

- “Use SignalBrief MCP to list accounts and summarize risks for Northstar Logistics.”
- “Pull recent calls and open tickets for Brightline Health Clinic.”

## Production note

The public Render demo does **not** expose MCP over HTTP in this prototype. Run the stdio server locally against your Postgres, or deploy a dedicated MCP service later (see [architecture.md](./architecture.md)).
