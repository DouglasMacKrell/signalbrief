export function formatLatencyMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 10) return `${seconds.toFixed(1)}s`;
  return `${Math.round(seconds)}s`;
}

export function formatBriefingRunId(runId: string): string {
  return `${runId.slice(0, 8)}…`;
}
