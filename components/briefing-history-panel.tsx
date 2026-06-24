"use client";

import { useEffect, useState } from "react";

import {
  formatBriefingRunId,
  formatLatencyMs,
} from "@/src/domain/format-latency";
import type { BriefingRunSummary } from "@/src/domain/briefing-run-summary";

export function BriefingHistoryPanel({
  accountId,
  refreshToken,
}: {
  accountId: string;
  refreshToken: number;
}) {
  const [open, setOpen] = useState(false);
  const [runs, setRuns] = useState<BriefingRunSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/accounts/${accountId}/briefings`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load briefing history");
        }

        if (!cancelled) {
          setRuns(data.runs ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load history");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [accountId, open, refreshToken]);

  return (
    <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        <span>Past briefing runs</span>
        <span className="text-xs font-normal text-slate-500">
          {open ? "Hide" : "Show audit trail"}
        </span>
      </button>

      {open && (
        <div className="mt-3">
          {loading && (
            <p className="text-sm text-slate-500">Loading briefing history…</p>
          )}
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}
          {!loading && !error && runs.length === 0 && (
            <p className="text-sm text-slate-500">No briefing runs yet.</p>
          )}
          {!loading && !error && runs.length > 0 && (
            <ul className="space-y-2">
              {runs.map((run) => (
                <li
                  key={run.id}
                  className="rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      Run {formatBriefingRunId(run.id)}
                    </span>
                    <span
                      className={
                        run.status === "success"
                          ? "text-xs font-medium text-emerald-700 dark:text-emerald-300"
                          : "text-xs font-medium text-red-700 dark:text-red-300"
                      }
                    >
                      {run.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(run.createdAt).toLocaleString()} ·{" "}
                    {run.latencyMs !== null
                      ? formatLatencyMs(run.latencyMs)
                      : "—"}{" "}
                    · {run.provider}
                  </p>
                  {run.errorMessage && (
                    <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                      {run.errorMessage}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
