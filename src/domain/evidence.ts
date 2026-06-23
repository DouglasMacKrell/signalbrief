import type {
  AccountContext,
  Call,
  EvidenceRef,
  HealthSnapshot,
  Opportunity,
  SupportTicket,
} from "./types";

export function opportunityEvidence(opportunity: Opportunity): EvidenceRef {
  return {
    sourceSystem: opportunity.sourceSystem,
    sourceId: opportunity.sourceId,
    recordType: "opportunity",
    label: `${opportunity.stage} · $${opportunity.amount.toLocaleString()}`,
  };
}

export function callEvidence(call: Call): EvidenceRef {
  return {
    sourceSystem: call.sourceSystem,
    sourceId: call.sourceId,
    recordType: "call",
    label: call.summary.slice(0, 60),
  };
}

export function ticketEvidence(ticket: SupportTicket): EvidenceRef {
  return {
    sourceSystem: ticket.sourceSystem,
    sourceId: ticket.sourceId,
    recordType: "ticket",
    label: `${ticket.priority} · ${ticket.summary.slice(0, 50)}`,
  };
}

export function healthEvidence(health: HealthSnapshot): EvidenceRef {
  return {
    sourceSystem: health.sourceSystem,
    sourceId: health.sourceId,
    recordType: "health",
    label: `Health score ${health.healthScore}`,
  };
}

export function collectEvidenceIds(context: AccountContext): Set<string> {
  const ids = new Set<string>();
  ids.add(context.opportunity.sourceId);
  ids.add(context.health.sourceId);
  for (const call of context.calls) ids.add(call.sourceId);
  for (const ticket of context.tickets) ids.add(ticket.sourceId);
  return ids;
}

export function validateEvidenceIds(
  evidenceIds: string[],
  context: AccountContext,
): boolean {
  const validIds = collectEvidenceIds(context);
  return evidenceIds.every((id) => validIds.has(id));
}
