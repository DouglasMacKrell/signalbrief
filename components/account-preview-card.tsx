import Link from "next/link";

import type { AccountPreview } from "@/src/domain/account-preview";

const riskLevelStyles: Record<
  AccountPreview["riskLevel"],
  string
> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  medium:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  high: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

function formatRiskSummary(preview: AccountPreview): string {
  if (preview.riskCount === 0) return "No risk signals";
  const severity = preview.highestSeverity ?? "low";
  const label = preview.riskCount === 1 ? "signal" : "signals";
  return `${preview.riskCount} ${label} · highest ${severity}`;
}

export function AccountPreviewCard({ preview }: { preview: AccountPreview }) {
  return (
    <Link
      href={`/accounts/${preview.id}`}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold">{preview.name}</h2>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${riskLevelStyles[preview.riskLevel]}`}
        >
          {preview.storyLabel}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {preview.industry} · {preview.segment}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">Health</dt>
          <dd className="font-semibold tabular-nums">{preview.healthScore}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Risks</dt>
          <dd className="font-medium">{formatRiskSummary(preview)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-slate-500">Owner: {preview.owner}</p>
    </Link>
  );
}
