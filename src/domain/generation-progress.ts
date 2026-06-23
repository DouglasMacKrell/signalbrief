export const GENERATION_EXPECTED_MS = {
  llm: 90_000,
  rules: 2_500,
} as const;

/** Eases toward 92% over expected duration; completes only when the caller sets 100. */
export function estimateGenerationProgress(
  elapsedMs: number,
  expectedMs: number,
): number {
  if (elapsedMs <= 0) return 0;
  return Math.min(92, (1 - Math.exp(-elapsedMs / (expectedMs * 0.55))) * 92);
}
