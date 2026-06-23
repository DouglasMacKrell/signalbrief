# Documentation index

Public, interviewer-safe documentation for SignalBrief. Internal planning notes stay local (gitignored).

| Document | When to read |
|---|---|
| [architecture.md](./architecture.md) | System design, data model, service layer |
| [security.md](./security.md) | Secrets handling, LLM boundaries, hooks |
| [deployment.md](./deployment.md) | Render deploy, env vars, operations |
| [demo-guide.md](./demo-guide.md) | Product walkthrough for live demos |

## Keeping docs current

Update documentation in the same PR/commit as the feature when you change:

- API routes or contracts
- Environment variables (also update `.env.example`)
- Deployment steps or `render.yaml`
- Risk rules or briefing schema
- Demo account narratives

Root [README.md](../README.md) should always reflect: what the app does, how to run it locally, and the live demo URL.
