import { describe, expect, it } from "vitest";

import { MCP_TOOLS, REST_ROUTES } from "@/src/domain/agent-surface";

describe("agent surface", () => {
  it("documents MCP tools and REST routes for the agent layer callout", () => {
    expect(MCP_TOOLS.length).toBe(5);
    expect(REST_ROUTES.some((route) => route.path.includes("briefings"))).toBe(
      true,
    );
  });
});
