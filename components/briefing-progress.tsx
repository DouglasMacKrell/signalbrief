"use client";

import { useEffect, useState } from "react";

import {
  estimateGenerationProgress,
  GENERATION_EXPECTED_MS,
} from "@/src/domain/generation-progress";

export function BriefingProgressBar({
  active,
  llmBriefing,
  complete,
}: {
  active: boolean;
  llmBriefing: boolean;
  complete: boolean;
}) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setElapsedSec(0);
      setProgress(0);
      return;
    }

    const expectedMs = llmBriefing
      ? GENERATION_EXPECTED_MS.llm
      : GENERATION_EXPECTED_MS.rules;
    const started = Date.now();

    const tick = () => {
      const elapsedMs = Date.now() - started;
      setElapsedSec(Math.floor(elapsedMs / 1000));
      setProgress(estimateGenerationProgress(elapsedMs, expectedMs));
    };

    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [active, llmBriefing]);

  useEffect(() => {
    if (complete) setProgress(100);
  }, [complete]);

  if (!active) return null;

  return (
    <div className="mb-4" role="status" aria-live="polite" aria-busy="true">
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          {llmBriefing
            ? "Running local model inference…"
            : "Building structured briefing…"}
        </span>
        <span className="tabular-nums">{elapsedSec}s</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-slate-900 transition-[width] duration-300 ease-out dark:bg-slate-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      {llmBriefing && elapsedSec >= 15 && progress < 100 && (
        <p className="mt-2 text-xs text-slate-500">
          Large local models can take 30–90 seconds on first run.
        </p>
      )}
    </div>
  );
}
