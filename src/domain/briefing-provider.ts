import type { Briefing } from "@/src/domain/briefing-schema";
import { ollamaBriefingProvider } from "@/src/providers/ollama-briefing-provider";
import { rulesFallbackProvider } from "@/src/providers/rules-fallback-provider";
import type { AccountContext, RiskSignal } from "@/src/domain/types";

export type BriefingProviderName = "rules-fallback" | "ollama";

export interface BriefingProvider {
  name: BriefingProviderName;
  generate(context: AccountContext, risks: RiskSignal[]): Promise<Briefing>;
}

export function isOllamaEnabled(): boolean {
  return process.env.OLLAMA_ENABLED === "true";
}

export function getBriefingProvider(): BriefingProvider {
  if (isOllamaEnabled() && process.env.BRIEFING_PROVIDER === "ollama") {
    return ollamaBriefingProvider;
  }
  return rulesFallbackProvider;
}

export function getBriefingProviderLabel(): string {
  if (isOllamaEnabled() && process.env.BRIEFING_PROVIDER === "ollama") {
    return `ollama (${process.env.OLLAMA_MODEL ?? "qwen3:14b"})`;
  }
  return "rules-fallback";
}
