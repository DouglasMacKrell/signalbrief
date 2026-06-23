import "dotenv/config";

const baseUrl = (process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434").replace(
  /\/$/,
  "",
);
const model = process.env.OLLAMA_MODEL ?? "qwen3:14b";

async function main() {
  try {
    const tagsRes = await fetch(`${baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(5_000),
    });
    if (!tagsRes.ok) {
      throw new Error(`Ollama not reachable (${tagsRes.status})`);
    }

    const tags = (await tagsRes.json()) as {
      models?: { name: string }[];
    };
    const names = tags.models?.map((m) => m.name) ?? [];
    const hasModel = names.some(
      (n) => n === model || n.startsWith(`${model}:`) || n.startsWith(model),
    );

    if (!hasModel) {
      console.error(`\n❌ Model "${model}" not found. Available: ${names.join(", ") || "(none)"}`);
      console.error(`   Run: ollama pull ${model}\n`);
      process.exit(1);
    }

    console.log(`✓ Ollama reachable at ${baseUrl}`);
    console.log(`✓ Model "${model}" is available`);
    console.log("\nEnable in .env:");
    console.log("  BRIEFING_PROVIDER=ollama");
    console.log("  OLLAMA_ENABLED=true\n");
  } catch (err) {
    console.error("\n❌ Ollama check failed.");
    console.error(`   ${err instanceof Error ? err.message : err}`);
    console.error("\n   Install: https://ollama.com");
    console.error(`   Then: ollama pull ${model}\n`);
    process.exit(1);
  }
}

main();
