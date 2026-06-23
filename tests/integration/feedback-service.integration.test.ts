import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { getDb } from "@/src/db/client";
import { feedbackEvents } from "@/src/db/schema";
import { submitFeedback } from "@/src/domain/feedback-service";

describe("submitFeedback (integration)", () => {
  it("persists helpful feedback for an account", async () => {
    const before = await getDb().select().from(feedbackEvents);
    const countBefore = before.length;

    const result = await submitFeedback({
      accountId: "acme-creative",
      sentiment: "helpful",
      comment: "Integration test feedback",
    });

    expect(result.ok).toBe(true);

    const after = await getDb()
      .select()
      .from(feedbackEvents)
      .where(eq(feedbackEvents.accountId, "acme-creative"));

    expect(after.length).toBeGreaterThan(countBefore);
    expect(after.some((f) => f.comment === "Integration test feedback")).toBe(
      true,
    );
  });
});
