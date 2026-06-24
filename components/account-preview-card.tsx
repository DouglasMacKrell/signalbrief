import Link from "next/link";

import type { AccountPreview } from "@/src/domain/account-preview";
import type { RiskSignal } from "@/src/domain/types";

const riskLevelStyles: Record<
  AccountPreview["riskLevel"],
  string
> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  medium:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  high: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

const severityStyles: Record<RiskSignal["severity"], string> = {
  high: "text-red-700 dark:text-red-300",
  medium: "text-amber-700 dark:text-amber-300",
  low: "text-slate-600 dark:text-slate-400",
};

function riskSummary(preview: AccountPreview): {
  countLabel: string;
  detailLabel: string;
  detailClassName: string;
} {
  if (preview.riskCount === 0) {
    return {
      countLabel: "0",
      detailLabel: "None detected",
      detailClassName: "text-slate-500",
    };
  }

  const severity = preview.highestSeverity ?? "low";
  return {
    countLabel: String(preview.riskCount),
    detailLabel: `Highest · ${severity}`,
    detailClassName: severityStyles[severity],
  };
}

export function AccountPreviewCard({ preview }: { preview: AccountPreview }) {
  const risks = riskSummary(preview);

  return (
    <Link
      href={`/accounts/${preview.id}`}
      className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold leading-snug">{preview.name}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {preview.industry} · {preview.segment}
        </p>
      </div>

      <span
        title={preview.storyHint}
        className={`mt-3 inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskLevelStyles[preview.riskLevel]}`}
      >
        {preview.storyLabel}
      </span>

      <dl className="mt-4 grid flex-1 grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
        <div title="Latest product health score from product analytics">
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Health
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums">
            {preview.healthScore}
          </dd>
        </div>
        <div
          title={
            preview.riskCount === 0
              ? "No deterministic risk rules fired for this account"
              : `${preview.riskCount} risk signal(s) from deterministic rules — open account for Why this fired`
          }
        >
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Risks
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums">
            {risks.countLabel}
          </dd>
          <dd className={`mt-0.5 text-xs font-medium ${risks.detailClassName}`}>
            {risks.detailLabel}
          </dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-500 dark:border-slate-800">
        Owner: {preview.owner}
      </p>
    </Link>
  );
}
