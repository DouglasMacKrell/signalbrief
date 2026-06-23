import { describe, expect, it } from "vitest";

import {
  collectEvidenceIds,
  validateEvidenceIds,
} from "@/src/domain/evidence";
import { buildContext } from "./fixtures/account-context";

describe("evidence", () => {
  it("collects all source IDs from account context", () => {
    const context = buildContext();
    const ids = collectEvidenceIds(context);

    expect(ids.has("006Northstar000Renewal")).toBe(true);
    expect(ids.has("gong:call_northstar_001")).toBe(true);
    expect(ids.has("zendesk:northstar_8831")).toBe(true);
    expect(ids.has("pa:health_northstar_001")).toBe(true);
  });

  it("rejects unknown evidence IDs", () => {
    const context = buildContext();
    expect(validateEvidenceIds(["006Northstar000Renewal"], context)).toBe(true);
    expect(validateEvidenceIds(["fake-id"], context)).toBe(false);
  });
});
