"use client";

import { EvidenceChip } from "@/components/dashboard-ui";
import { useEvidenceVisibility } from "@/components/evidence-visibility";
import { getRiskRuleDescription } from "@/src/domain/risk-engine";
import type { RiskSignal } from "@/src/domain/types";

export function RiskCard({ risk }: { risk: RiskSignal }) {
  const { showEvidence } = useEvidenceVisibility();
  const ruleDescription = getRiskRuleDescription(risk.id);

  const severityStyles = {
    high: "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
    medium:
      "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
    low: "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
  };

  return (
    <div className={`rounded-lg border p-4 ${severityStyles[risk.severity]}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{risk.label}</h3>
        <span className="text-xs uppercase tracking-wide">{risk.severity}</span>
      </div>
      <p className="mt-1 text-xs font-medium opacity-80">
        Why this fired: {ruleDescription}
      </p>
      <p className="mt-2 text-sm opacity-90">{risk.explanation}</p>
      {showEvidence && (
        <div className="mt-3 flex flex-wrap gap-2">
          {risk.evidence.map((e) => (
            <EvidenceChip key={`${e.sourceSystem}-${e.sourceId}`} evidence={e} />
          ))}
        </div>
      )}
    </div>
  );
}
