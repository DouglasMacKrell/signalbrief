# Documentation index

Public, interviewer-safe documentation for SignalBrief. Internal planning notes stay local (gitignored).

## Pick your path

| You are… | Start here |
|---|---|
| **Hiring manager / exploring async** | **[explorer-guide.md](./explorer-guide.md)** |
| **Running locally** | [QUICKSTART.md](./QUICKSTART.md) |
| **Candidate screen-sharing** | [demo-guide.md](./demo-guide.md) |
| **Reviewing engineering** | [architecture.md](./architecture.md) → [security.md](./security.md) |

## All documents

| Document | Contents |
|---|---|
| **[explorer-guide.md](./explorer-guide.md)** | Self-serve live demo tour, UI checklist, engineering signals |
| [QUICKSTART.md](./QUICKSTART.md) | Install, seed, Ollama, tests, troubleshooting |
| [demo-guide.md](./demo-guide.md) | Product walkthrough for live demos |
| [architecture.md](./architecture.md) | Data model, services, risk engine, MCP |
| [security.md](./security.md) | Secrets, Ollama boundaries, validation, hooks |
| [deployment.md](./deployment.md) | Render deploy, env vars, cold starts |
| [mcp.md](./mcp.md) | Read-only MCP tools for GTM workflows |

## Keeping docs current

Update documentation in the same commit as the feature when you change:

- API routes or contracts
- Environment variables (also update `.env.example`)
- Deployment steps or `render.yaml`
- Risk rules or briefing schema
- Demo account narratives or UI affordances

Root [README.md](../README.md) should always reflect: what the app does, live demo URL, and link to [explorer-guide.md](./explorer-guide.md).
