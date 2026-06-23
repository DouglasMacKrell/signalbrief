import { differenceInDays, subDays } from "date-fns";

import {
  callEvidence,
  healthEvidence,
  opportunityEvidence,
  ticketEvidence,
} from "@/src/domain/evidence";
import type { AccountContext, RiskSignal } from "@/src/domain/types";

const NEGATIVE_THEMES = [
  "payroll errors",
  "slow support",
  "renewal concern",
  "frustration",
  "churn",
];

function daysSince(date: Date, now: Date): number {
  return differenceInDays(now, date);
}

function daysUntil(date: Date, now: Date): number {
  return differenceInDays(date, now);
}

function hasNegativeCallTheme(context: AccountContext, now: Date): boolean {
  const cutoff = subDays(now, 30);
  return context.calls.some(
    (call) =>
      call.occurredAt >= cutoff &&
      (call.sentiment === "negative" ||
        call.themes.some((theme) =>
          NEGATIVE_THEMES.some((neg) =>
            theme.toLowerCase().includes(neg.toLowerCase()),
          ),
        )),
  );
}

export function calculateRiskSignals(
  context: AccountContext,
  now = new Date(),
): RiskSignal[] {
  const risks: RiskSignal[] = [];
  const { opportunity, tickets, health, calls } = context;

  if (daysSince(opportunity.lastActivityAt, now) > 21) {
    risks.push({
      id: "risk-no-activity",
      severity: "medium",
      label: "No recent account activity",
      explanation: `Last meaningful activity was ${daysSince(opportunity.lastActivityAt, now)} days ago.`,
      evidence: [opportunityEvidence(opportunity)],
    });
  }

  if (opportunity.daysInStage > 30) {
    risks.push({
      id: "risk-stalled-opportunity",
      severity: "medium",
      label: "Opportunity may be stalled",
      explanation: `Opportunity has been in ${opportunity.stage} for ${opportunity.daysInStage} days.`,
      evidence: [opportunityEvidence(opportunity)],
    });
  }

  for (const ticket of tickets) {
    if (
      (ticket.priority === "high" || ticket.priority === "urgent") &&
      ticket.status !== "solved" &&
      daysSince(ticket.createdAt, now) > 7
    ) {
      risks.push({
        id: `risk-ticket-${ticket.id}`,
        severity: "high",
        label: "High-priority support issue remains unresolved",
        explanation: `${ticket.priority} ticket open for ${daysSince(ticket.createdAt, now)} days: ${ticket.summary}`,
        evidence: [ticketEvidence(ticket)],
      });
    }
  }

  if (
    health.usageTrend === "down" &&
    daysUntil(opportunity.closeDate, now) < 45
  ) {
    risks.push({
      id: "risk-usage-decline",
      severity: "high",
      label: "Usage decline near renewal or close window",
      explanation: `Usage is trending down with ${daysUntil(opportunity.closeDate, now)} days until close.`,
      evidence: [healthEvidence(health), opportunityEvidence(opportunity)],
    });
  }

  if (hasNegativeCallTheme(context, now)) {
    const negativeCall =
      calls.find(
        (c) =>
          c.sentiment === "negative" ||
          c.themes.some((t) =>
            NEGATIVE_THEMES.some((n) => t.toLowerCase().includes(n)),
          ),
      ) ?? calls[0];

    if (negativeCall) {
      risks.push({
        id: "risk-negative-call",
        severity: "medium",
        label: "Negative themes in recent call",
        explanation: "Recent conversation surfaced friction or dissatisfaction.",
        evidence: [callEvidence(negativeCall)],
      });
    }
  }

  if (
    health.healthScore < 50 &&
    opportunity.stage.toLowerCase().includes("renewal")
  ) {
    risks.push({
      id: "risk-low-health-renewal",
      severity: "high",
      label: "Low health score at renewal",
      explanation: `Health score is ${health.healthScore} during an active renewal cycle.`,
      evidence: [healthEvidence(health), opportunityEvidence(opportunity)],
    });
  }

  const severityOrder = { high: 0, medium: 1, low: 2 };
  return risks.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
}
