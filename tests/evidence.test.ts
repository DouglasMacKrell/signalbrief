import { describe, expect, it } from "vitest";

import {
  buildEvidenceIndex,
  collectEvidenceIds,
  resolveEvidenceRefs,
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

  it("builds a lookup index keyed by sourceId", () => {
    const context = buildContext();
    const index = buildEvidenceIndex(context);

    expect(index["006Northstar000Renewal"]?.recordType).toBe("opportunity");
    expect(index["zendesk:northstar_8831"]?.recordType).toBe("ticket");
    expect(index["gong:call_northstar_001"]?.recordType).toBe("call");
  });

  it("resolves briefing evidenceIds to evidence refs", () => {
    const context = buildContext();
    const index = buildEvidenceIndex(context);
    const refs = resolveEvidenceRefs(
      ["006Northstar000Renewal", "zendesk:northstar_8831"],
      index,
    );

    expect(refs).toHaveLength(2);
    expect(refs[0]?.label).toContain("Renewal");
    expect(refs[1]?.sourceSystem).toBe("zendesk");
  });

  it("falls back for unknown evidenceIds in resolve", () => {
    const refs = resolveEvidenceRefs(["missing-id"], {});

    expect(refs[0]?.sourceId).toBe("missing-id");
    expect(refs[0]?.sourceSystem).toBe("unknown");
  });
});
