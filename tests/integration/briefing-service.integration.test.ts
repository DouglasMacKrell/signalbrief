import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { getDb } from "@/src/db/client";
import { briefingRuns } from "@/src/db/schema";
import { generateBriefing } from "@/src/domain/briefing-service";
import { BriefingSchema } from "@/src/domain/briefing-schema";

describe("generateBriefing (integration)", () => {
  it("persists a successful rules-fallback briefing run", async () => {
    const result = await generateBriefing("acme-creative");

    expect(result.status).toBe(200);
    if ("error" in result) throw new Error("expected success");

    expect(result.provider).toBe("rules-fallback");
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(BriefingSchema.safeParse(result.briefing).success).toBe(true);

    const db = getDb();
    const [run] = await db
      .select()
      .from(briefingRuns)
      .where(eq(briefingRuns.id, result.briefingRunId))
      .limit(1);

    expect(run?.status).toBe("success");
    expect(run?.provider).toBe("rules-fallback");
  });

  it("returns 404 for unknown accounts", async () => {
    const result = await generateBriefing("missing-account");
    expect(result.status).toBe(404);
    expect(result).toHaveProperty("error");
  });
});
