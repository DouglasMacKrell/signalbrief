import { formatDistanceToNow } from "date-fns";

import type { EvidenceRef, RiskSignal } from "@/src/domain/types";

export function EvidenceChip({ evidence }: { evidence: EvidenceRef }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {evidence.sourceSystem}:{evidence.sourceId}
    </span>
  );
}

export function RiskCard({ risk }: { risk: RiskSignal }) {
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
      <p className="mt-2 text-sm opacity-90">{risk.explanation}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {risk.evidence.map((e) => (
          <EvidenceChip key={`${e.sourceSystem}-${e.sourceId}`} evidence={e} />
        ))}
      </div>
    </div>
  );
}

export function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function formatRelative(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true });
}
