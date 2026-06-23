import { afterEach, describe, expect, it, vi } from "vitest";

import { buildContext } from "./fixtures/account-context";
import { calculateRiskSignals } from "@/src/domain/risk-engine";
import { ollamaBriefingProvider } from "@/src/providers/ollama-briefing-provider";
import { now } from "./fixtures/account-context";

const validBriefingJson = {
  summary: "Northstar Logistics faces renewal risk.",
  risks: [
    {
      label: "High-priority support issue remains unresolved",
      severity: "high",
      evidenceIds: ["zendesk:northstar_8831"],
    },
  ],
  positiveSignals: [
    {
      label: "Account remains engaged on renewal",
      evidenceIds: ["006Northstar000Renewal"],
    },
  ],
  nextBestAction: {
    action: "Schedule executive outreach",
    reason: "Open payroll tax ticket threatens renewal.",
    evidenceIds: ["zendesk:northstar_8831", "006Northstar000Renewal"],
  },
  talkingPoints: [
    "Address payroll tax filing ticket",
    "Confirm renewal timeline",
    "Offer dedicated CS support",
  ],
};

describe("ollamaBriefingProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OLLAMA_BASE_URL;
  });

  it("parses valid Ollama JSON responses", async () => {
    process.env.OLLAMA_BASE_URL = "http://127.0.0.1:11434";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          message: { content: JSON.stringify(validBriefingJson) },
        }),
      }),
    );

    const context = buildContext();
    const risks = calculateRiskSignals(context, now);
    const briefing = await ollamaBriefingProvider.generate(context, risks);

    expect(briefing.summary).toContain("Northstar");
    expect(briefing.talkingPoints).toHaveLength(3);
  });

  it("rejects non-localhost Ollama URLs", async () => {
    process.env.OLLAMA_BASE_URL = "http://192.168.1.10:11434";

    await expect(
      ollamaBriefingProvider.generate(buildContext(), []),
    ).rejects.toThrow(/localhost/);
  });
});
