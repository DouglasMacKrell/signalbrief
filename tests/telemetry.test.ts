import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { logTelemetry, type TelemetryPayload } from "@/src/telemetry/logger";

describe("telemetry logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs structured JSON with event type and accountId", () => {
    const payload: TelemetryPayload = {
      event: "briefing_generated",
      accountId: "acme-creative",
      provider: "rules-fallback",
      latencyMs: 42,
      success: true,
    };

    logTelemetry(payload);

    expect(console.info).toHaveBeenCalledOnce();
    const logged = (console.info as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(logged).toContain('"event":"briefing_generated"');
    expect(logged).toContain('"accountId":"acme-creative"');
    expect(logged).toContain('"provider":"rules-fallback"');
  });

  it("includes optional sentiment for feedback events", () => {
    logTelemetry({
      event: "feedback_submitted",
      accountId: "northstar-logistics",
      sentiment: "helpful",
    });

    const logged = (console.info as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(logged).toContain('"sentiment":"helpful"');
  });
});
