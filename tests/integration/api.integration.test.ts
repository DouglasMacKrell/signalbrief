import { describe, expect, it } from "vitest";

import { GET as getAccounts } from "@/app/api/accounts/route";
import { GET as getContext } from "@/app/api/accounts/[accountId]/context/route";
import { GET as getRisks } from "@/app/api/accounts/[accountId]/risks/route";
import { POST as postBriefing } from "@/app/api/accounts/[accountId]/briefings/route";
import { POST as postFeedback } from "@/app/api/feedback/route";

describe("API routes (integration)", () => {
  it("GET /api/accounts returns seeded accounts", async () => {
    const res = await getAccounts();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.accounts).toHaveLength(5);
  });

  it("GET /api/accounts/:id/context returns account payload", async () => {
    const res = await getContext(new Request("http://test"), {
      params: Promise.resolve({ accountId: "summit-legal" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.account.id).toBe("summit-legal");
    expect(data.health).toBeDefined();
  });

  it("GET /api/accounts/:id/risks returns deterministic risks", async () => {
    const res = await getRisks(new Request("http://test"), {
      params: Promise.resolve({ accountId: "northstar-logistics" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.risks.some((r: { severity: string }) => r.severity === "high")).toBe(
      true,
    );
  });

  it("POST /api/accounts/:id/briefings generates briefing", async () => {
    const res = await postBriefing(new Request("http://test", { method: "POST" }), {
      params: Promise.resolve({ accountId: "brightline-health" }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.briefing.summary).toBeTruthy();
    expect(data.provider).toBe("rules-fallback");
  });

  it("POST /api/feedback accepts sentiment", async () => {
    const res = await postFeedback(
      new Request("http://test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: "harbor-foods",
          sentiment: "not_helpful",
          comment: "API integration test",
        }),
      }),
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
  });
});
