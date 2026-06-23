import { afterEach, describe, expect, it } from "vitest";

import {
  getBriefingProvider,
  getBriefingProviderLabel,
  isLlmBriefingConfigured,
} from "@/src/domain/briefing-provider";

describe("getBriefingProvider", () => {
  afterEach(() => {
    delete process.env.OLLAMA_ENABLED;
    delete process.env.BRIEFING_PROVIDER;
    delete process.env.OLLAMA_MODEL;
  });

  it("defaults to rules-fallback", () => {
    expect(getBriefingProvider().name).toBe("rules-fallback");
    expect(getBriefingProviderLabel()).toBe("rules-fallback");
  });

  it("uses ollama when explicitly enabled", () => {
    process.env.OLLAMA_ENABLED = "true";
    process.env.BRIEFING_PROVIDER = "ollama";
    process.env.OLLAMA_MODEL = "qwen3:14b";

    expect(getBriefingProvider().name).toBe("ollama");
    expect(getBriefingProviderLabel()).toBe("ollama (qwen3:14b)");
    expect(isLlmBriefingConfigured()).toBe(true);
  });

  it("isLlmBriefingConfigured is false for rules-fallback", () => {
    expect(isLlmBriefingConfigured()).toBe(false);
  });

  it("stays on rules-fallback when ollama env is not fully set", () => {
    process.env.OLLAMA_ENABLED = "true";
    process.env.BRIEFING_PROVIDER = "rules-fallback";

    expect(getBriefingProvider().name).toBe("rules-fallback");
  });
});
