import {
  getAccountContext,
  getAccounts,
} from "@/src/domain/account-context";
import { calculateRiskSignals } from "@/src/domain/risk-engine";

export async function listAccountsTool() {
  return getAccounts();
}

export async function getAccountContextTool(accountId: string) {
  return getAccountContext(accountId);
}

export async function getRiskSignalsTool(accountId: string) {
  const context = await getAccountContext(accountId);
  if (!context) return [];
  return calculateRiskSignals(context);
}

export async function getRecentCalls(accountId: string, limit = 5) {
  const context = await getAccountContext(accountId);
  if (!context) return [];
  return context.calls.slice(0, limit);
}

export async function getOpenSupportTickets(accountId: string) {
  const context = await getAccountContext(accountId);
  if (!context) return [];
  return context.tickets.filter(
    (t) => t.status === "open" || t.status === "pending",
  );
}
