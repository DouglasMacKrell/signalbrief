import type { BriefingProvider } from "@/src/domain/briefing-provider";
import { BriefingSchema } from "@/src/domain/briefing-schema";
import type { AccountContext, RiskSignal } from "@/src/domain/types";

function severityRank(severity: RiskSignal["severity"]): number {
  return severity === "high" ? 0 : severity === "medium" ? 1 : 2;
}

export const rulesFallbackProvider: BriefingProvider = {
  name: "rules-fallback",

  async generate(context, risks) {
    const { account, opportunity, health, calls } = context;
    const topRisk = [...risks].sort(
      (a, b) => severityRank(a.severity) - severityRank(b.severity),
    )[0];

    const positiveSignals = [];

    if (health.usageTrend === "up") {
      positiveSignals.push({
        label: "Product usage is trending up",
        evidenceIds: [health.sourceId],
      });
    }

    const positiveCall = calls.find((c) => c.sentiment === "positive");
    if (positiveCall) {
      positiveSignals.push({
        label: "Recent call surfaced expansion or satisfaction themes",
        evidenceIds: [positiveCall.sourceId],
      });
    }

    if (positiveSignals.length === 0) {
      positiveSignals.push({
        label: "Account remains engaged on the current opportunity",
        evidenceIds: [opportunity.sourceId],
      });
    }

    const briefingRisks = risks.map((risk) => ({
      label: risk.label,
      severity: risk.severity,
      evidenceIds: risk.evidence.map((e) => e.sourceId),
    }));

    const summary =
      risks.length === 0
        ? `${account.name} is in ${opportunity.stage} with healthy signals and no major risks detected.`
        : `${account.name} is in ${opportunity.stage} with ${risks.length} risk signal(s). Health trend is ${health.usageTrend}.`;

    const nextBestAction = topRisk
      ? {
          action:
            topRisk.severity === "high"
              ? "Schedule executive outreach with CS and payroll specialist"
              : "Confirm next steps and document mutual action plan",
          reason: topRisk.explanation,
          evidenceIds: topRisk.evidence.map((e) => e.sourceId),
        }
      : {
          action: "Advance expansion conversation and confirm rollout timeline",
          reason: `Opportunity in ${opportunity.stage} with positive usage trends.`,
          evidenceIds: [opportunity.sourceId, health.sourceId],
        };

    const talkingPoints = [
      risks.length
        ? `Address top risk: ${topRisk?.label ?? risks[0].label}`
        : `Discuss expansion path for ${account.segment} segment`,
      positiveCall
        ? `Reference positive theme: ${positiveCall.themes[0]}`
        : `Confirm value on ${opportunity.stage} timeline`,
      `Close or renewal window: ${opportunity.closeDate.toLocaleDateString()}`,
    ];

    return BriefingSchema.parse({
      summary,
      risks: briefingRisks,
      positiveSignals,
      nextBestAction,
      talkingPoints,
    });
  },
};
