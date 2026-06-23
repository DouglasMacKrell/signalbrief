import { addDays, subDays } from "date-fns";

import type { AccountContext } from "@/src/domain/types";

export const now = new Date("2026-06-23T12:00:00Z");

export function buildContext(
  overrides: Partial<AccountContext> = {},
): AccountContext {
  const base: AccountContext = {
    account: {
      id: "northstar-logistics",
      name: "Northstar Logistics",
      industry: "Logistics",
      owner: "Sam Rivera",
      segment: "SMB",
      createdAt: subDays(now, 600),
      updatedAt: now,
    },
    opportunity: {
      id: "opp-northstar-001",
      accountId: "northstar-logistics",
      stage: "Renewal",
      amount: 18000,
      probability: 55,
      closeDate: addDays(now, 22),
      daysInStage: 38,
      lastActivityAt: subDays(now, 24),
      owner: "Sam Rivera",
      sourceSystem: "salesforce",
      sourceId: "006Northstar000Renewal",
      sourceUpdatedAt: subDays(now, 2),
    },
    calls: [
      {
        id: "call-northstar-001",
        accountId: "northstar-logistics",
        occurredAt: subDays(now, 8),
        owner: "Sam Rivera",
        summary: "Renewal discussion surfaced payroll errors",
        themes: ["payroll errors", "slow support response"],
        excerpts: ["We are frustrated before renewal."],
        sentiment: "negative",
        sourceSystem: "gong",
        sourceId: "gong:call_northstar_001",
        sourceUpdatedAt: subDays(now, 8),
      },
    ],
    tickets: [
      {
        id: "ticket-northstar-open",
        accountId: "northstar-logistics",
        priority: "high",
        status: "open",
        createdAt: subDays(now, 12),
        summary: "Payroll tax filing discrepancy",
        sourceSystem: "zendesk",
        sourceId: "zendesk:northstar_8831",
        sourceUpdatedAt: subDays(now, 1),
      },
    ],
    health: {
      id: "health-northstar-001",
      accountId: "northstar-logistics",
      healthScore: 41,
      usageTrend: "down",
      activeUsers: 22,
      lastLoginAt: subDays(now, 19),
      sourceSystem: "product_analytics",
      sourceId: "pa:health_northstar_001",
      sourceUpdatedAt: subDays(now, 2),
    },
    freshness: {
      oldestSourceUpdatedAt: subDays(now, 8),
      staleSources: [],
    },
  };

  return { ...base, ...overrides };
}

export function buildHealthyContext(): AccountContext {
  return buildContext({
    account: {
      id: "acme-creative",
      name: "Acme Creative",
      industry: "Creative agency",
      owner: "Jordan Lee",
      segment: "Mid-Market",
      createdAt: subDays(now, 400),
      updatedAt: now,
    },
    opportunity: {
      id: "opp-acme-001",
      accountId: "acme-creative",
      stage: "Negotiation",
      amount: 42000,
      probability: 75,
      closeDate: addDays(now, 28),
      daysInStage: 10,
      lastActivityAt: subDays(now, 3),
      owner: "Jordan Lee",
      sourceSystem: "salesforce",
      sourceId: "006Acme000Negotiation",
      sourceUpdatedAt: subDays(now, 1),
    },
    tickets: [],
    health: {
      id: "health-acme-001",
      accountId: "acme-creative",
      healthScore: 82,
      usageTrend: "up",
      activeUsers: 68,
      lastLoginAt: subDays(now, 1),
      sourceSystem: "product_analytics",
      sourceId: "pa:health_acme_001",
      sourceUpdatedAt: subDays(now, 1),
    },
    calls: [
      {
        id: "call-acme-001",
        accountId: "acme-creative",
        occurredAt: subDays(now, 5),
        owner: "Jordan Lee",
        summary: "Expansion planning",
        themes: ["payroll automation"],
        excerpts: ["Ready to add contractors."],
        sentiment: "positive",
        sourceSystem: "gong",
        sourceId: "gong:call_acme_001",
        sourceUpdatedAt: subDays(now, 5),
      },
    ],
  });
}
