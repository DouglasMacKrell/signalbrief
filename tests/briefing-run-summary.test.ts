import { describe, expect, it } from "vitest";

import { toBriefingRunSummary } from "@/src/domain/briefing-run-summary";

describe("toBriefingRunSummary", () => {
  it("serializes briefing run rows for API responses", () => {
    const createdAt = new Date("2026-06-23T12:00:00Z");
    const summary = toBriefingRunSummary({
      id: "run-123",
      accountId: "acme-creative",
      provider: "rules-fallback",
      status: "success",
      latencyMs: 42,
      outputJson: null,
      errorMessage: null,
      createdAt,
    });

    expect(summary).toEqual({
      id: "run-123",
      provider: "rules-fallback",
      status: "success",
      latencyMs: 42,
      errorMessage: null,
      createdAt: createdAt.toISOString(),
    });
  });
});
