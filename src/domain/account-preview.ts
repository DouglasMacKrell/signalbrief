import { getAccountContext, getAccounts } from "@/src/domain/account-context";
import { calculateRiskSignals } from "@/src/domain/risk-engine";
import type { AccountSummary, RiskSignal } from "@/src/domain/types";

export type DemoRiskLevel = "low" | "medium" | "high";

export type AccountPreview = AccountSummary & {
  healthScore: number;
  riskCount: number;
  highestSeverity: RiskSignal["severity"] | null;
  storyLabel: string;
  riskLevel: DemoRiskLevel;
};

export const DEMO_ACCOUNT_STORIES: Record<
  string,
  { storyLabel: string; riskLevel: DemoRiskLevel }
> = {
  "acme-creative": { storyLabel: "Healthy expansion", riskLevel: "low" },
  "northstar-logistics": {
    storyLabel: "High-risk renewal",
    riskLevel: "high",
  },
  "brightline-health": {
    storyLabel: "Mixed renewal signals",
    riskLevel: "medium",
  },
  "summit-legal": { storyLabel: "Enterprise stable renewal", riskLevel: "low" },
  "harbor-foods": { storyLabel: "Stalled discovery", riskLevel: "medium" },
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
        riskLevel: story?.riskLevel ?? "medium",
      };
    }),
  );
}
