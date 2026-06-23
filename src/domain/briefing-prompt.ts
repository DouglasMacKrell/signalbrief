import type { AccountContext, RiskSignal } from "@/src/domain/types";
import { collectEvidenceIds } from "@/src/domain/evidence";

export const BRIEFING_SYSTEM_PROMPT = `You are an account-intelligence assistant for a revenue team.

Use only the supplied account context.
Do not invent customer facts, risks, dates, quotes, or outcomes.
Every risk, positive signal, and recommended action must cite supplied source IDs from validEvidenceIds.
When evidence is weak or conflicting, say so.
Return valid JSON matching this schema:
{
  "summary": "string",
  "risks": [{ "label": "string", "severity": "low"|"medium"|"high", "evidenceIds": ["string"] }],
  "positiveSignals": [{ "label": "string", "evidenceIds": ["string"] }],
  "nextBestAction": { "action": "string", "reason": "string", "evidenceIds": ["string"] },
  "talkingPoints": ["string"]
}`;

export function buildBriefingPromptPayload(
  context: AccountContext,
  risks: RiskSignal[],
) {
  return {
    account: {
      id: context.account.id,
      name: context.account.name,
      industry: context.account.industry,
      segment: context.account.segment,
      owner: context.account.owner,
    },
    opportunity: {
      stage: context.opportunity.stage,
      amount: context.opportunity.amount,
      probability: context.opportunity.probability,
      closeDate: context.opportunity.closeDate.toISOString(),
      daysInStage: context.opportunity.daysInStage,
      lastActivityAt: context.opportunity.lastActivityAt.toISOString(),
      sourceId: context.opportunity.sourceId,
    },
    calls: context.calls.map((c) => ({
      summary: c.summary,
      themes: c.themes,
      excerpts: c.excerpts,
      sentiment: c.sentiment,
      occurredAt: c.occurredAt.toISOString(),
      sourceId: c.sourceId,
    })),
    tickets: context.tickets.map((t) => ({
      priority: t.priority,
      status: t.status,
      summary: t.summary,
      createdAt: t.createdAt.toISOString(),
      sourceId: t.sourceId,
    })),
    health: {
      healthScore: context.health.healthScore,
      usageTrend: context.health.usageTrend,
      activeUsers: context.health.activeUsers,
      lastLoginAt: context.health.lastLoginAt.toISOString(),
      sourceId: context.health.sourceId,
    },
    deterministicRisks: risks.map((r) => ({
      label: r.label,
      severity: r.severity,
      explanation: r.explanation,
      evidenceIds: r.evidence.map((e) => e.sourceId),
    })),
    validEvidenceIds: [...collectEvidenceIds(context)],
  };
}
