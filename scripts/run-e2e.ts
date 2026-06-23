import { spawn } from "node:child_process";

import { prepareTestDatabase } from "../src/test/db-setup";
import { closeDb } from "../src/db/client";

const BUILD_TIMEOUT_MS = 120_000;
const PLAYWRIGHT_TIMEOUT_MS = 180_000;

function runStep(
  label: string,
  command: string,
  args: string[],
  timeoutMs: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`→ ${label}…`);

    const child = spawn(command, args, {
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    });

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 2_000).unref();
      reject(
        new Error(
          `${label} timed out after ${timeoutMs / 1000}s — aborting E2E run`,
        ),
      );
    }, timeoutMs);

    child.on("error", (err) => {
      clearTimeout(timer);
      reject(new Error(`${label} failed to start: ${err.message}`));
    });

    child.on("exit", (code, signal) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `${label} failed${signal ? ` (signal ${signal})` : ""} with exit code ${code ?? "unknown"}`,
        ),
      );
    });
  });
}

async function prepareDatabase() {
  console.log("→ Preparing E2E database…");

  await Promise.race([
    prepareTestDatabase(),
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Database setup timed out after 30s — is Postgres running? (docker compose up -d)",
            ),
          ),
        30_000,
      ),
    ),
  ]);

  console.log("✓ Database ready for E2E\n");
}

const DEFAULT_DATABASE_URL =
  "postgresql://signalbrief:signalbrief@127.0.0.1:5432/signalbrief";

async function main() {
  process.env.DATABASE_URL ??= DEFAULT_DATABASE_URL;
  process.env.BRIEFING_PROVIDER ??= "rules-fallback";
  process.env.OLLAMA_ENABLED ??= "false";

  await runStep(
    "Preflight",
    "npx",
    ["tsx", "scripts/preflight-e2e.ts"],
    30_000,
  );

  await prepareDatabase();
  await closeDb();

  await runStep("Production build", "npm", ["run", "build"], BUILD_TIMEOUT_MS);

  await runStep(
    "Playwright E2E",
    "npx",
    ["playwright", "test"],
    PLAYWRIGHT_TIMEOUT_MS,
  );

  console.log("\n✓ E2E complete\n");
}

main().catch((err) => {
  console.error(`\n❌ E2E aborted: ${err instanceof Error ? err.message : err}\n`);
  process.exit(1);
});
