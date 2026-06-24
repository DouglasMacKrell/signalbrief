import { describe, expect, it } from "vitest";

import {
  formatBriefingRunId,
  formatLatencyMs,
} from "@/src/domain/format-latency";

describe("formatLatencyMs", () => {
  it("formats sub-second latency in milliseconds", () => {
    expect(formatLatencyMs(842)).toBe("842ms");
  });

  it("formats seconds with one decimal under ten seconds", () => {
    expect(formatLatencyMs(1_250)).toBe("1.3s");
  });

  it("formats long latency as whole seconds", () => {
    expect(formatLatencyMs(48_200)).toBe("48s");
  });
});

describe("formatBriefingRunId", () => {
  it("shortens UUIDs for display", () => {
    expect(formatBriefingRunId("a1b2c3d4-e5f6-7890-abcd-ef1234567890")).toBe(
      "a1b2c3d4…",
    );
  });
});
