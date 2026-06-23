import { describe, expect, it } from "vitest";

import {
  getAccountContextTool,
  getOpenSupportTickets,
  getRecentCalls,
  getRiskSignalsTool,
  listAccountsTool,
} from "@/src/mcp/tools";

describe("MCP read tools (integration)", () => {
  it("list_accounts returns seeded accounts", async () => {
    const accounts = await listAccountsTool();
    expect(accounts).toHaveLength(5);
  });

  it("get_account_context returns unified payload", async () => {
    const context = await getAccountContextTool("northstar-logistics");
    expect(context?.account.name).toBe("Northstar Logistics");
    expect(context?.calls.length).toBeGreaterThan(0);
  });

  it("get_risk_signals returns deterministic high risks for northstar", async () => {
    const risks = await getRiskSignalsTool("northstar-logistics");
    expect(risks.some((r) => r.severity === "high")).toBe(true);
  });

  it("get_recent_calls scopes to account", async () => {
    const calls = await getRecentCalls("acme-creative");
    expect(calls.every((c) => c.accountId === "acme-creative")).toBe(true);
  });

  it("get_open_support_tickets filters open and pending", async () => {
    const tickets = await getOpenSupportTickets("northstar-logistics");
    expect(tickets.length).toBeGreaterThan(0);
    expect(tickets.every((t) => t.status === "open" || t.status === "pending")).toBe(
      true,
    );
  });

  it("handles unknown account ids", async () => {
    expect(await getAccountContextTool("missing")).toBeNull();
    expect(await getRiskSignalsTool("missing")).toEqual([]);
    expect(await getRecentCalls("missing")).toEqual([]);
    expect(await getOpenSupportTickets("missing")).toEqual([]);
  });
});
