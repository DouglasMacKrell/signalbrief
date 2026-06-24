import {
  formatBriefingRunId,
  formatLatencyMs,
} from "@/src/domain/format-latency";

export function BriefingRunMeta({
  runId,
  latencyMs,
  providerLabel,
}: {
  runId: string;
  latencyMs: number;
  providerLabel: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
      <span className="font-mono">Run {formatBriefingRunId(runId)}</span>
      <span aria-hidden="true" className="mx-2">
        ·
      </span>
      <span>{formatLatencyMs(latencyMs)}</span>
      <span aria-hidden="true" className="mx-2">
        ·
      </span>
      <span>{providerLabel}</span>
    </div>
  );
}
