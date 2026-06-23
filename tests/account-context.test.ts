import { describe, expect, it } from "vitest";

import { computeFreshness } from "@/src/domain/account-context";
import { buildContext, now } from "./fixtures/account-context";

describe("computeFreshness", () => {
  it("flags sources older than seven days as stale", () => {
    const context = buildContext();
    const freshness = computeFreshness(
      context.opportunity,
      context.calls,
      context.tickets,
      context.health,
      now,
    );

    expect(freshness.staleSources.length).toBeGreaterThan(0);
    expect(freshness.staleSources).toContain("gong");
  });

  it("returns no stale sources when all data is recent", () => {
    const context = buildContext({
      opportunity: {
        ...buildContext().opportunity,
        sourceUpdatedAt: now,
        lastActivityAt: now,
      },
      calls: [],
      tickets: [],
      health: {
        ...buildContext().health,
        sourceUpdatedAt: now,
      },
    });

    const freshness = computeFreshness(
      context.opportunity,
      context.calls,
      context.tickets,
      context.health,
      now,
    );

    expect(freshness.staleSources).toHaveLength(0);
  });
});
