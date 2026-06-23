import "dotenv/config";

import { beforeAll } from "vitest";

import { prepareTestDatabase } from "@/src/test/db-setup";
import { checkPostgres } from "../../scripts/preflight-postgres";

beforeAll(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is required for integration tests. Run: docker compose up -d",
    );
  }

  process.env.BRIEFING_PROVIDER = "rules-fallback";
  process.env.OLLAMA_ENABLED = "false";

  await checkPostgres({ label: "Postgres (integration)", timeoutMs: 5_000 });
  await prepareTestDatabase();
}, 30_000);
