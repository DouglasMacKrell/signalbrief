import { describe, expect, it } from "vitest";

import { BriefingSchema } from "@/src/domain/briefing-schema";
import { validateEvidenceIds } from "@/src/domain/evidence";
import { calculateRiskSignals, getRiskRuleDescription } from "@/src/domain/risk-engine";
import { rulesFallbackProvider } from "@/src/providers/rules-fallback-provider";
import {
  buildContext,
  buildHealthyContext,
  now,
} from "./fixtures/account-context";

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

  it("creates low health risk at renewal for northstar", () => {
    const risks = calculateRiskSignals(buildContext(), now);
    expect(risks.some((r) => r.label.includes("Low health score"))).toBe(true);
  });

  it("returns no high-severity risks for healthy account", () => {
    const risks = calculateRiskSignals(buildHealthyContext(), now);
    expect(risks.filter((r) => r.severity === "high")).toHaveLength(0);
  });

  it("detects stalled discovery for harbor-style context", () => {
    const risks = calculateRiskSignals(
      buildContext({
        account: {
          id: "harbor-foods",
          name: "Harbor Foods Co-op",
          industry: "Grocery",
          owner: "Morgan Ellis",
          segment: "SMB",
          createdAt: now,
          updatedAt: now,
        },
        opportunity: {
          id: "opp-harbor-001",
          accountId: "harbor-foods",
          stage: "Discovery",
          amount: 12000,
          probability: 40,
          closeDate: new Date(now.getTime() + 60 * 86400000),
          daysInStage: 45,
          lastActivityAt: new Date(now.getTime() - 26 * 86400000),
          owner: "Morgan Ellis",
          sourceSystem: "salesforce",
          sourceId: "006Harbor000Discovery",
          sourceUpdatedAt: now,
        },
        tickets: [],
        health: {
          id: "health-harbor-001",
          accountId: "harbor-foods",
          healthScore: 48,
          usageTrend: "flat",
          activeUsers: 9,
          lastLoginAt: now,
          sourceSystem: "product_analytics",
          sourceId: "pa:health_harbor_001",
          sourceUpdatedAt: now,
        },
        calls: [],
      }),
      now,
    );

    expect(risks.some((r) => r.label.includes("stalled"))).toBe(true);
    expect(risks.some((r) => r.label.includes("No recent account activity"))).toBe(
      true,
    );
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

  it("requires talkingPoints with at least one entry", () => {
    const result = BriefingSchema.safeParse({
      summary: "Test",
      risks: [],
      positiveSignals: [],
      nextBestAction: {
        action: "Call customer",
        reason: "Renewal",
        evidenceIds: ["006Northstar000Renewal"],
      },
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

describe("getRiskRuleDescription", () => {
  it("maps known rule ids to deterministic explanations", () => {
    expect(getRiskRuleDescription("risk-no-activity")).toContain("21+ days");
    expect(getRiskRuleDescription("risk-stalled-opportunity")).toContain("30+ days");
    expect(getRiskRuleDescription("risk-low-health-renewal")).toContain("below 50");
  });

  it("handles ticket-specific risk ids", () => {
    expect(getRiskRuleDescription("risk-ticket-northstar-open")).toContain(
      "7 days",
    );
  });
});

describe("account context boundaries", () => {
  it("keeps child records aligned to account id in fixtures", () => {
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
