import { addDays, subDays } from "date-fns";
import { describe, expect, it } from "vitest";

import { BriefingSchema } from "@/src/domain/briefing-schema";
import { validateEvidenceIds } from "@/src/domain/evidence";
import { calculateRiskSignals } from "@/src/domain/risk-engine";
import type { AccountContext } from "@/src/domain/types";
import { rulesFallbackProvider } from "@/src/providers/rules-fallback-provider";

const now = new Date("2026-06-23T12:00:00Z");

function buildContext(overrides: Partial<AccountContext> = {}): AccountContext {
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

describe("calculateRiskSignals", () => {
  it("creates high severity risk for high-priority ticket open over 7 days", () => {
    const risks = calculateRiskSignals(buildContext(), now);
    expect(
      risks.some(
        (r) =>
          r.severity === "high" &&
          r.label.includes("High-priority support issue"),
      ),
    ).toBe(true);
  });

  it("creates stalled opportunity risk when daysInStage exceeds 30", () => {
    const risks = calculateRiskSignals(buildContext(), now);
    expect(risks.some((r) => r.label.includes("stalled"))).toBe(true);
  });

  it("creates usage decline risk near renewal window", () => {
    const risks = calculateRiskSignals(buildContext(), now);
    expect(
      risks.some((r) => r.label.includes("Usage decline near renewal")),
    ).toBe(true);
  });

  it("returns no major risks for healthy account context", () => {
    const healthy = buildContext({
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

    const risks = calculateRiskSignals(healthy, now);
    expect(risks.filter((r) => r.severity === "high")).toHaveLength(0);
  });
});

describe("BriefingSchema", () => {
  it("rejects invalid briefing JSON", () => {
    const result = BriefingSchema.safeParse({
      summary: "Test",
      risks: [],
      positiveSignals: [],
      nextBestAction: { action: "x", reason: "y", evidenceIds: [] },
      talkingPoints: [],
    });

    expect(result.success).toBe(false);
  });
});

describe("rulesFallbackProvider", () => {
  it("produces valid briefing with evidence IDs from context", async () => {
    const context = buildContext();
    const risks = calculateRiskSignals(context, now);
    const briefing = await rulesFallbackProvider.generate(context, risks);

    expect(BriefingSchema.safeParse(briefing).success).toBe(true);
    expect(validateEvidenceIds(briefing.nextBestAction.evidenceIds, context)).toBe(
      true,
    );
  });
});

describe("account context boundaries", () => {
  it("uses only records belonging to the selected account in fixtures", () => {
    const context = buildContext();
    expect(context.opportunity.accountId).toBe(context.account.id);
    expect(context.health.accountId).toBe(context.account.id);
    for (const call of context.calls) {
      expect(call.accountId).toBe(context.account.id);
    }
    for (const ticket of context.tickets) {
      expect(ticket.accountId).toBe(context.account.id);
    }
  });
});
