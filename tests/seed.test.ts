import { describe, expect, it } from "vitest";

import {
  DEMO_ACCOUNT_COUNT,
  demoAccountsSeed,
} from "@/src/seed/demo-accounts";

describe("demoAccountsSeed", () => {
  it("seeds exactly five accounts", () => {
    expect(DEMO_ACCOUNT_COUNT).toBe(5);
    expect(demoAccountsSeed.accounts).toHaveLength(5);
  });

  it("keeps related records scoped to the same accountId", () => {
    for (const account of demoAccountsSeed.accounts) {
      const opp = demoAccountsSeed.opportunities.find(
        (o) => o.accountId === account.id,
      );
      const health = demoAccountsSeed.healthSnapshots.find(
        (h) => h.accountId === account.id,
      );

      expect(opp?.accountId).toBe(account.id);
      expect(health?.accountId).toBe(account.id);

      for (const call of demoAccountsSeed.calls.filter(
        (c) => c.accountId === account.id,
      )) {
        expect(call.accountId).toBe(account.id);
      }
      for (const ticket of demoAccountsSeed.tickets.filter(
        (t) => t.accountId === account.id,
      )) {
        expect(ticket.accountId).toBe(account.id);
      }
    }
  });

  it("includes contrasting risk profiles", () => {
    const northstar = demoAccountsSeed.opportunities.find(
      (o) => o.accountId === "northstar-logistics",
    );
    const harbor = demoAccountsSeed.opportunities.find(
      (o) => o.accountId === "harbor-foods",
    );
    const acme = demoAccountsSeed.opportunities.find(
      (o) => o.accountId === "acme-creative",
    );

    expect(northstar?.stage).toBe("Renewal");
    expect(northstar?.daysInStage).toBeGreaterThan(30);
    expect(harbor?.stage).toBe("Discovery");
    expect(harbor?.daysInStage).toBeGreaterThan(30);
    expect(acme?.stage).toBe("Negotiation");
  });

  it("assigns source metadata on upstream records", () => {
    for (const opp of demoAccountsSeed.opportunities) {
      expect(opp.sourceSystem).toBe("salesforce");
      expect(opp.sourceId).toBeTruthy();
    }
  });
});
