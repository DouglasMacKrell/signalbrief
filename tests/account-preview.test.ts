import { describe, expect, it } from "vitest";

import {
  DEMO_ACCOUNT_STORIES,
  summarizeRisks,
} from "@/src/domain/account-preview";
import type { RiskSignal } from "@/src/domain/types";

function risk(severity: RiskSignal["severity"]): RiskSignal {
  return {
    id: "risk-test",
    severity,
    label: "Test",
    explanation: "Test",
    evidence: [],
  };
}

describe("summarizeRisks", () => {
  it("returns zero count and null severity when no risks", () => {
    expect(summarizeRisks([])).toEqual({ count: 0, highestSeverity: null });
  });

  it("picks the highest severity among risks", () => {
    expect(
      summarizeRisks([risk("low"), risk("medium"), risk("high")]),
    ).toEqual({ count: 3, highestSeverity: "high" });
  });
});

describe("DEMO_ACCOUNT_STORIES", () => {
  it("covers all five demo accounts", () => {
    expect(Object.keys(DEMO_ACCOUNT_STORIES)).toHaveLength(5);
    expect(DEMO_ACCOUNT_STORIES["northstar-logistics"]?.riskLevel).toBe("high");
    expect(DEMO_ACCOUNT_STORIES["acme-creative"]?.storyLabel).toBe(
      "Healthy expansion",
    );
  });
});
