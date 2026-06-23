"use client";

import { useState } from "react";

import { EvidenceChipList } from "@/components/dashboard-ui";
import type { Briefing } from "@/src/domain/briefing-schema";
import type { EvidenceRef } from "@/src/domain/types";

export function BriefingPanel({
  accountId,
  configuredProvider,
  llmBriefing,
  evidenceIndex,
}: {
  accountId: string;
  configuredProvider: string;
  llmBriefing: boolean;
  evidenceIndex: Record<string, EvidenceRef>;
}) {
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
          {llmBriefing ? "AI briefing" : "Structured briefing"}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Configured: {configuredProvider}
            {provider && provider !== configuredProvider ? ` · used: ${provider}` : ""}
          </span>
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
          {llmBriefing
            ? "Generate a structured account briefing via local Ollama — evidence-backed risks and next steps."
            : "Generate a deterministic briefing from risk signals and account data (no LLM on this deployment)."}
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
              <ul className="mt-2 space-y-3">
                {briefing.risks.map((risk) => (
                  <li key={risk.label}>
                    <span>
                      [{risk.severity}] {risk.label}
                    </span>
                    <EvidenceChipList
                      evidenceIds={risk.evidenceIds}
                      evidenceIndex={evidenceIndex}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {briefing.positiveSignals.length > 0 && (
            <div>
              <h3 className="font-semibold">Positive signals</h3>
              <ul className="mt-2 space-y-3">
                {briefing.positiveSignals.map((signal) => (
                  <li key={signal.label}>
                    {signal.label}
                    <EvidenceChipList
                      evidenceIds={signal.evidenceIds}
                      evidenceIndex={evidenceIndex}
                    />
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
            <EvidenceChipList
              evidenceIds={briefing.nextBestAction.evidenceIds}
              evidenceIndex={evidenceIndex}
            />
          </div>

          <div>
            <h3 className="font-semibold">Talking points</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {briefing.talkingPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <FeedbackForm
            accountId={accountId}
            briefingRunId={briefingRunId}
            briefing={briefing}
          />
        </div>
      )}
    </section>
  );
}

function FeedbackForm({
  accountId,
  briefingRunId,
  briefing,
}: {
  accountId: string;
  briefingRunId: string | null;
  briefing: Briefing;
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

  async function draftFollowUp() {
    const res = await fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "draft_follow_up_requested",
        accountId,
        metadata: {
          action: briefing.nextBestAction.action.slice(0, 120),
        },
      }),
    });

    if (res.ok) {
      setMessage("Draft follow-up logged — no write-back to source systems.");
    } else {
      setMessage("Could not log draft follow-up.");
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
      <button
        type="button"
        onClick={draftFollowUp}
        className="mt-3 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-900"
      >
        Draft follow-up task
      </button>
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
