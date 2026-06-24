import { describe, expect, it, beforeEach } from "vitest";

import {
  clearRecentTelemetryForTests,
  getRecentTelemetry,
  recordTelemetryEvent,
} from "@/src/telemetry/recent-events";

describe("recent telemetry buffer", () => {
  beforeEach(() => {
    clearRecentTelemetryForTests();
  });

  it("stores and filters events by account", () => {
    recordTelemetryEvent({ event: "account_viewed", accountId: "acme-creative" });
    recordTelemetryEvent({
      event: "briefing_generated",
      accountId: "northstar-logistics",
      provider: "rules-fallback",
      success: true,
    });

    expect(getRecentTelemetry("acme-creative")).toHaveLength(1);
    expect(getRecentTelemetry()).toHaveLength(2);
  });

  it("caps the in-memory buffer", () => {
    for (let i = 0; i < 35; i += 1) {
      recordTelemetryEvent({
        event: "account_viewed",
        accountId: `account-${i}`,
      });
    }

    expect(getRecentTelemetry()).toHaveLength(30);
  });
});
