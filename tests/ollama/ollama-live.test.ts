import { beforeAll, describe, expect, it } from "vitest";

import { BriefingSchema } from "@/src/domain/briefing-schema";
import { calculateRiskSignals } from "@/src/domain/risk-engine";
import { ollamaBriefingProvider } from "@/src/providers/ollama-briefing-provider";
import { buildContext, now } from "../fixtures/account-context";

function isOllamaIntegrationEnabled(): boolean {
  return (
    process.env.OLLAMA_INTEGRATION === "1" &&
    process.env.CI !== "true"
  );
}

function getOllamaBaseUrl(): string {
  return (process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434").replace(
    /\/$/,
    "",
  );
}

function getOllamaModel(): string {
  return process.env.OLLAMA_MODEL ?? "qwen3:14b";
}

describe.skipIf(!isOllamaIntegrationEnabled())("Ollama live inference", () => {
  beforeAll(async () => {
    const baseUrl = getOllamaBaseUrl();
    const model = getOllamaModel();

    const tagsRes = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(5_000),
    });
    if (!tagsRes.ok) {
      throw new Error(`Ollama not reachable at ${baseUrl} (${tagsRes.status})`);
    }

    const tags = (await tagsRes.json()) as {
      models?: { name: string }[];
    };
    const names = tags.models?.map((m) => m.name) ?? [];
    const hasModel = names.some(
      (n) => n === model || n.startsWith(`${model}:`) || n.startsWith(model),
    );

    if (!hasModel) {
      throw new Error(
        `Model "${model}" not found. Run: ollama pull ${model}`,
      );
    }
  });

  it("generates a schema-valid briefing for Northstar Logistics", async () => {
    const context = buildContext();
    const risks = calculateRiskSignals(context, now);

    const briefing = await ollamaBriefingProvider.generate(context, risks);

    expect(BriefingSchema.safeParse(briefing).success).toBe(true);
    expect(briefing.summary.length).toBeGreaterThan(10);
    expect(briefing.talkingPoints.length).toBeGreaterThanOrEqual(1);
    expect(briefing.nextBestAction.action.length).toBeGreaterThan(0);
    expect(briefing.nextBestAction.evidenceIds.length).toBeGreaterThanOrEqual(1);
  });
});
