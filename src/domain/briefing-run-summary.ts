import type { briefingRuns } from "@/src/db/schema";

export type BriefingRunSummary = {
  id: string;
  provider: string;
  status: "success" | "failure";
  latencyMs: number | null;
  errorMessage: string | null;
  createdAt: string;
};

export function toBriefingRunSummary(
  run: typeof briefingRuns.$inferSelect,
): BriefingRunSummary {
  return {
    id: run.id,
    provider: run.provider,
    status: run.status,
    latencyMs: run.latencyMs,
    errorMessage: run.errorMessage,
    createdAt: run.createdAt.toISOString(),
  };
}
