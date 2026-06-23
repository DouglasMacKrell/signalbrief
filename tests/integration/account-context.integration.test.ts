import { describe, expect, it } from "vitest";

import {
  getAccountContext,
  getAccounts,
} from "@/src/domain/account-context";
import { calculateRiskSignals } from "@/src/domain/risk-engine";
import { DEMO_ACCOUNT_COUNT } from "@/src/seed/demo-accounts";

describe("account context (integration)", () => {
  it("returns five seeded accounts", async () => {
    const accounts = await getAccounts();
    expect(accounts).toHaveLength(DEMO_ACCOUNT_COUNT);
    expect(accounts.map((a) => a.id)).toContain("northstar-logistics");
  });

  it("loads full context for a seeded account", async () => {
    const context = await getAccountContext("northstar-logistics");

    expect(context).not.toBeNull();
    expect(context!.account.name).toBe("Northstar Logistics");
    expect(context!.opportunity.stage).toBe("Renewal");
    expect(context!.calls.length).toBeGreaterThan(0);
    expect(context!.health.healthScore).toBeLessThan(50);
  });

  it("returns null for unknown account ids", async () => {
    expect(await getAccountContext("does-not-exist")).toBeNull();
  });

  it("does not leak records across accounts", async () => {
    const acme = await getAccountContext("acme-creative");
    const northstar = await getAccountContext("northstar-logistics");

    expect(acme!.opportunity.accountId).toBe("acme-creative");
    expect(northstar!.opportunity.accountId).toBe("northstar-logistics");
    expect(acme!.calls.every((c) => c.accountId === "acme-creative")).toBe(true);
    expect(
      northstar!.calls.every((c) => c.accountId === "northstar-logistics"),
    ).toBe(true);
  });

  it("computes live risk signals from persisted data", async () => {
    const context = await getAccountContext("northstar-logistics");
    const risks = calculateRiskSignals(context!);

    expect(risks.some((r) => r.severity === "high")).toBe(true);
  });
});
