import type { Briefing } from "@/src/domain/briefing-schema";
import { rulesFallbackProvider } from "@/src/providers/rules-fallback-provider";
import type { AccountContext, RiskSignal } from "@/src/domain/types";

export type BriefingProviderName = "rules-fallback" | "ollama";

export interface BriefingProvider {
  name: BriefingProviderName;
  generate(context: AccountContext, risks: RiskSignal[]): Promise<Briefing>;
}

export function getBriefingProvider(): BriefingProvider {
  const provider = process.env.BRIEFING_PROVIDER ?? "rules-fallback";
  if (provider === "ollama" && process.env.OLLAMA_ENABLED === "true") {
    throw new Error("Ollama provider not implemented in MVP");
  }
  return rulesFallbackProvider;
}
