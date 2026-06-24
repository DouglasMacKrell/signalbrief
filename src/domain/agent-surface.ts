export const MCP_TOOLS = [
  { name: "list_accounts", purpose: "Account picker for workflows" },
  { name: "get_account_context", purpose: "Unified CRM, calls, support, health" },
  { name: "get_risk_signals", purpose: "Deterministic risks with evidence" },
  { name: "get_recent_calls", purpose: "Gong-style conversation data" },
  {
    name: "get_open_support_tickets",
    purpose: "Open and pending Zendesk-style tickets",
  },
] as const;

export const REST_ROUTES = [
  { method: "GET", path: "/api/accounts", purpose: "List demo accounts" },
  {
    method: "GET",
    path: "/api/accounts/:id/context",
    purpose: "Full account context payload",
  },
  {
    method: "GET",
    path: "/api/accounts/:id/risks",
    purpose: "Deterministic risk signals",
  },
  {
    method: "GET",
    path: "/api/accounts/:id/briefings",
    purpose: "Briefing run audit history",
  },
  {
    method: "POST",
    path: "/api/accounts/:id/briefings",
    purpose: "Generate validated briefing (web app)",
  },
  { method: "POST", path: "/api/feedback", purpose: "Helpful / not helpful" },
  {
    method: "POST",
    path: "/api/telemetry",
    purpose: "Structured client events (e.g. draft follow-up)",
  },
] as const;
