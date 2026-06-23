import { describe, expect, it } from "vitest";

import { buildBriefingPromptPayload } from "@/src/domain/briefing-prompt";
import { calculateRiskSignals } from "@/src/domain/risk-engine";
import { buildContext, now } from "./fixtures/account-context";

describe("buildBriefingPromptPayload", () => {
  it("includes validEvidenceIds from account context", () => {
    const context = buildContext();
    const risks = calculateRiskSignals(context, now);
    const payload = buildBriefingPromptPayload(context, risks);

    expect(payload.validEvidenceIds).toContain("006Northstar000Renewal");
    expect(payload.validEvidenceIds).toContain("zendesk:northstar_8831");
    expect(payload.deterministicRisks.length).toBeGreaterThan(0);
    expect(payload.account.name).toBe("Northstar Logistics");
  });
});
