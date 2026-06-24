import { formatDistanceToNow } from "date-fns";

import type { EvidenceRef } from "@/src/domain/types";

export function EvidenceChip({ evidence }: { evidence: EvidenceRef }) {
  return (
    <span className="inline-flex max-w-full flex-col rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      <span className="font-medium leading-snug">{evidence.label}</span>
      <span className="font-mono text-[10px] leading-tight text-slate-500 dark:text-slate-400">
        {evidence.sourceSystem}:{evidence.sourceId}
      </span>
    </span>
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
