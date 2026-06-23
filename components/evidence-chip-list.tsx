"use client";

import { EvidenceChip } from "@/components/dashboard-ui";
import { useEvidenceVisibility } from "@/components/evidence-visibility";
import { resolveEvidenceRefs } from "@/src/domain/evidence";
import type { EvidenceRef } from "@/src/domain/types";

export function EvidenceChipList({
  evidenceIds,
  evidenceIndex,
}: {
  evidenceIds: string[];
  evidenceIndex: Record<string, EvidenceRef>;
}) {
  const { showEvidence } = useEvidenceVisibility();

  if (!showEvidence || evidenceIds.length === 0) return null;

  const refs = resolveEvidenceRefs(evidenceIds, evidenceIndex);

  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {refs.map((evidence) => (
        <EvidenceChip
          key={`${evidence.sourceSystem}-${evidence.sourceId}`}
          evidence={evidence}
        />
      ))}
    </div>
  );
}
