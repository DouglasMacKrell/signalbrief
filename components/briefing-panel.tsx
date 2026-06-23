"use client";

import { useState } from "react";

import type { Briefing } from "@/src/domain/briefing-schema";

export function BriefingPanel({ accountId }: { accountId: string }) {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [briefingRunId, setBriefingRunId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/accounts/${accountId}/briefings`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to generate briefing");
        return;
      }

      setBriefing(data.briefing);
      setProvider(data.provider);
      setBriefingRunId(data.briefingRunId);
    } catch {
      setError("Network error while generating briefing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          AI Briefing
        </h2>
        <div className="flex items-center gap-3">
          {provider && (
            <span className="text-xs text-slate-500">Provider: {provider}</span>
          )}
          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            {loading ? "Generating…" : "Generate Briefing"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {!briefing && !error && (
        <p className="text-sm text-slate-500">
          Generate a structured account briefing with evidence-backed risks and
          next steps.
        </p>
      )}

      {briefing && (
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Summary
            </h3>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              {briefing.summary}
            </p>
          </div>

          {briefing.risks.length > 0 && (
            <div>
              <h3 className="font-semibold">Top risks</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {briefing.risks.map((risk) => (
                  <li key={risk.label}>
                    [{risk.severity}] {risk.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-semibold">Next best action</h3>
            <p className="mt-1">{briefing.nextBestAction.action}</p>
            <p className="text-slate-600 dark:text-slate-400">
              {briefing.nextBestAction.reason}
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Talking points</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {briefing.talkingPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <FeedbackForm accountId={accountId} briefingRunId={briefingRunId} />
        </div>
      )}
    </section>
  );
}

function FeedbackForm({
  accountId,
  briefingRunId,
}: {
  accountId: string;
  briefingRunId: string | null;
}) {
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function send(sentiment: "helpful" | "not_helpful") {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId,
        briefingRunId,
        sentiment,
        comment: comment || null,
      }),
    });

    if (res.ok) {
      setMessage("Thanks — feedback saved.");
    } else {
      setMessage("Could not save feedback.");
    }
  }

  return (
    <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
      <h3 className="font-semibold">Feedback</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => send("helpful")}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          Helpful
        </button>
        <button
          type="button"
          onClick={() => send("not_helpful")}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          Not helpful
        </button>
      </div>
      <input
        type="text"
        placeholder="What was missing?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      />
      {message && <p className="mt-2 text-xs text-slate-500">{message}</p>}
      <p className="mt-3 text-xs text-slate-500">
        SignalBrief does not write back to source systems without explicit user
        confirmation.
      </p>
    </div>
  );
}
