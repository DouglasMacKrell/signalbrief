"use client";

import { useCallback, useEffect, useState } from "react";

import type { RecordedTelemetryEvent } from "@/src/telemetry/recent-events";

export function TrustDebugFooter({
  accountId,
  enabled,
}: {
  accountId: string;
  enabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<RecordedTelemetryEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/telemetry?accountId=${encodeURIComponent(accountId)}&debug=1`,
      );
      const data = await res.json();
      if (res.ok) setEvents(data.events ?? []);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    if (!enabled || !open) return;
    void loadEvents();
  }, [enabled, open, loadEvents]);

  if (!enabled) return null;

  return (
    <footer className="border-t border-dashed border-slate-300 bg-slate-100/80 dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
        >
          <span>Trust & telemetry (debug)</span>
          <span className="font-normal normal-case text-slate-500">
            {open ? "Hide" : "Show recent events"}
          </span>
        </button>

        {open && (
          <div className="mt-3 space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <p>
              Structured events are logged server-side with{" "}
              <code className="font-mono">[signalbrief:telemetry]</code>. No
              write-back to CRM, Gong, or Zendesk without explicit approval.
            </p>
            <button
              type="button"
              onClick={() => void loadEvents()}
              className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-white dark:border-slate-600 dark:hover:bg-slate-950"
            >
              Refresh
            </button>
            {loading && <p>Loading events…</p>}
            {!loading && events.length === 0 && (
              <p>No telemetry captured for this account yet.</p>
            )}
            {!loading && events.length > 0 && (
              <ul className="space-y-2 font-mono">
                {events.map((event, index) => (
                  <li
                    key={`${event.timestamp}-${event.event}-${index}`}
                    className="rounded border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950"
                  >
                    {event.timestamp} · {event.event}
                    {event.provider ? ` · ${event.provider}` : ""}
                    {event.latencyMs !== undefined ? ` · ${event.latencyMs}ms` : ""}
                    {event.sentiment ? ` · ${event.sentiment}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
