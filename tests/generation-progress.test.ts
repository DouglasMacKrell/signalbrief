import { describe, expect, it } from "vitest";

import {
  estimateGenerationProgress,
  GENERATION_EXPECTED_MS,
} from "@/src/domain/generation-progress";

describe("estimateGenerationProgress", () => {
  it("starts at zero", () => {
    expect(estimateGenerationProgress(0, GENERATION_EXPECTED_MS.rules)).toBe(0);
  });

  it("approaches but does not exceed 92% while in flight", () => {
    const atExpected = estimateGenerationProgress(
      GENERATION_EXPECTED_MS.llm,
      GENERATION_EXPECTED_MS.llm,
    );
    const wellPast = estimateGenerationProgress(
      GENERATION_EXPECTED_MS.llm * 3,
      GENERATION_EXPECTED_MS.llm,
    );

    expect(atExpected).toBeGreaterThan(50);
    expect(wellPast).toBeLessThanOrEqual(92);
    expect(wellPast).toBeGreaterThan(90);
  });

  it("moves faster for rules-fallback than llm at the same elapsed time", () => {
    const rules = estimateGenerationProgress(1_000, GENERATION_EXPECTED_MS.rules);
    const llm = estimateGenerationProgress(1_000, GENERATION_EXPECTED_MS.llm);

    expect(rules).toBeGreaterThan(llm);
  });
});
