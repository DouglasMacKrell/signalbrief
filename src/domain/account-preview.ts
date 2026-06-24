import { getAccountContext, getAccounts } from "@/src/domain/account-context";
import { calculateRiskSignals } from "@/src/domain/risk-engine";
import type { AccountSummary, RiskSignal } from "@/src/domain/types";

export type DemoRiskLevel = "low" | "medium" | "high";

export type AccountPreview = AccountSummary & {
  healthScore: number;
  riskCount: number;
  highestSeverity: RiskSignal["severity"] | null;
  storyLabel: string;
  storyHint: string;
  riskLevel: DemoRiskLevel;
};

export const DEMO_ACCOUNT_STORIES: Record<
  string,
  { storyLabel: string; riskLevel: DemoRiskLevel; hint: string }
> = {
  "acme-creative": {
    storyLabel: "Healthy expansion",
    riskLevel: "low",
    hint: "Expansion-ready; positive calls, usage trending up",
  },
  "northstar-logistics": {
    storyLabel: "High-risk renewal",
    riskLevel: "high",
    hint: "Renewal at risk; open high-priority ticket, negative calls",
  },
  "brightline-health": {
    storyLabel: "Mixed renewal signals",
    riskLevel: "medium",
    hint: "Renewal in 40 days with onboarding friction on calls",
  },
  "summit-legal": {
    storyLabel: "Enterprise stable renewal",
    riskLevel: "low",
    hint: "Stable $120k renewal; positive compliance themes",
  },
  "harbor-foods": {
    storyLabel: "Stalled discovery",
    riskLevel: "medium",
    hint: "Long time in discovery; quiet outreach and stale Gong data",
  },
};

const SEVERITY_RANK: Record<RiskSignal["severity"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function summarizeRisks(risks: RiskSignal[]): {
  count: number;
  highestSeverity: RiskSignal["severity"] | null;
} {
  if (risks.length === 0) {
    return { count: 0, highestSeverity: null };
  }

  const highest = [...risks].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
  )[0]?.severity;

  return { count: risks.length, highestSeverity: highest ?? null };
}

export async function getAccountPreviews(): Promise<AccountPreview[]> {
  const accounts = await getAccounts();

  return Promise.all(
    accounts.map(async (account) => {
      const context = await getAccountContext(account.id);
      if (!context) {
        throw new Error(`Missing account context for ${account.id}`);
      }

      const risks = calculateRiskSignals(context);
      const { count, highestSeverity } = summarizeRisks(risks);
      const story = DEMO_ACCOUNT_STORIES[account.id];

      return {
        ...account,
        healthScore: context.health.healthScore,
        riskCount: count,
        highestSeverity,
        storyLabel: story?.storyLabel ?? account.segment,
        storyHint:
          story?.hint ??
          "Open the account dashboard for CRM, calls, tickets, and health",
        riskLevel: story?.riskLevel ?? "medium",
      };
    }),
  );
}
