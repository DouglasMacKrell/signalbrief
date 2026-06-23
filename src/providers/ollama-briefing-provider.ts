import { BriefingSchema } from "@/src/domain/briefing-schema";
import {
  BRIEFING_SYSTEM_PROMPT,
  buildBriefingPromptPayload,
} from "@/src/domain/briefing-prompt";
import type { BriefingProvider } from "@/src/domain/briefing-provider";

const DEFAULT_MODEL = "qwen3:14b";
const REQUEST_TIMEOUT_MS = 120_000;

function getOllamaBaseUrl(): string {
  const raw = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  const url = new URL(raw);
  const host = url.hostname;

  if (host !== "127.0.0.1" && host !== "localhost") {
    throw new Error("Ollama must be bound to localhost only");
  }

  return raw.replace(/\/$/, "");
}

function getOllamaModel(): string {
  return process.env.OLLAMA_MODEL ?? DEFAULT_MODEL;
}

export const ollamaBriefingProvider: BriefingProvider = {
  name: "ollama",

  async generate(context, risks) {
    const baseUrl = getOllamaBaseUrl();
    const model = getOllamaModel();
    const payload = buildBriefingPromptPayload(context, risks);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          stream: false,
          format: "json",
          messages: [
            { role: "system", content: BRIEFING_SYSTEM_PROMPT },
            {
              role: "user",
              content: JSON.stringify(payload),
            },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Ollama request failed (${response.status}): ${text.slice(0, 200)}`);
      }

      const data = (await response.json()) as {
        message?: { content?: string };
      };

      const content = data.message?.content;
      if (!content) {
        throw new Error("Ollama returned empty response");
      }

      const parsed = BriefingSchema.parse(JSON.parse(content));
      return parsed;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Ollama request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  },
};
