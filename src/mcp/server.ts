import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  getAccountContextTool,
  getOpenSupportTickets,
  getRecentCalls,
  getRiskSignalsTool,
  listAccountsTool,
} from "@/src/mcp/tools";

function jsonContent(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function createMcpServer() {
  const server = new McpServer({
    name: "signalbrief",
    version: "0.1.0",
  });

  server.registerTool(
    "list_accounts",
    {
      description:
        "List demo GTM accounts with id, name, industry, segment, and owner.",
      inputSchema: {},
    },
    async () => jsonContent(await listAccountsTool()),
  );

  server.registerTool(
    "get_account_context",
    {
      description:
        "Unified account payload: CRM opportunity, Gong calls, Zendesk tickets, product health, and freshness.",
      inputSchema: {
        accountId: z.string().describe("Canonical account id, e.g. northstar-logistics"),
      },
    },
    async ({ accountId }) => jsonContent(await getAccountContextTool(accountId)),
  );

  server.registerTool(
    "get_risk_signals",
    {
      description:
        "Deterministic risk cards with severity, label, and evidence IDs for an account.",
      inputSchema: {
        accountId: z.string().describe("Canonical account id"),
      },
    },
    async ({ accountId }) => jsonContent(await getRiskSignalsTool(accountId)),
  );

  server.registerTool(
    "get_recent_calls",
    {
      description: "Recent Gong-style calls for an account (summary, themes, excerpts).",
      inputSchema: {
        accountId: z.string().describe("Canonical account id"),
        limit: z.number().int().min(1).max(10).optional().describe("Max calls to return"),
      },
    },
    async ({ accountId, limit }) =>
      jsonContent(await getRecentCalls(accountId, limit ?? 5)),
  );

  server.registerTool(
    "get_open_support_tickets",
    {
      description: "Open or pending Zendesk-style support tickets for an account.",
      inputSchema: {
        accountId: z.string().describe("Canonical account id"),
      },
    },
    async ({ accountId }) => jsonContent(await getOpenSupportTickets(accountId)),
  );

  return server;
}

export async function startMcpStdioServer() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
