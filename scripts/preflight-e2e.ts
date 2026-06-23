import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

import { chromium } from "@playwright/test";

import {
  checkPostgres,
  isPortAvailable,
  waitForHttpOk,
} from "./preflight-postgres";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? "3456");
const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

async function checkPlaywrightBrowser() {
  try {
    const browser = await chromium.launch({ timeout: 10_000 });
    await browser.close();
  } catch {
    console.error("\n❌ Playwright Chromium is not installed.");
    console.error("   Run: npx playwright install chromium\n");
    process.exit(1);
  }
}

async function checkPortAndServer() {
  const portInUse = !(await isPortAvailable(PORT));

  if (process.env.CI === "true") {
    if (portInUse) {
      console.error(`\n❌ Port ${PORT} is already in use (CI expects a free port).`);
      console.error(`   Free it: lsof -i :${PORT}`);
      console.error(`   Or set PLAYWRIGHT_PORT to another value.\n`);
      process.exit(1);
    }
    return;
  }

  if (!portInUse) return;

  try {
    await waitForHttpOk(BASE_URL, { timeoutMs: 5_000 });
    console.log(`✓ Reusing app server at ${BASE_URL}`);
  } catch {
    console.error(`\n❌ Port ${PORT} is in use but ${BASE_URL} is not SignalBrief.`);
    console.error(`   Stop the other process: lsof -i :${PORT}`);
    console.error(`   Or run E2E on another port: PLAYWRIGHT_PORT=3457 npm run test:e2e\n`);
    process.exit(1);
  }
}

async function main() {
  process.env.DATABASE_URL ??=
    "postgresql://signalbrief:signalbrief@127.0.0.1:5432/signalbrief";

  console.log("Preflight: E2E checks…");

  if (!existsSync("playwright.config.ts")) {
    console.error("\n❌ Run npm run test:e2e from the repo root.\n");
    process.exit(1);
  }

  try {
    execSync("node --version", { stdio: "ignore" });
  } catch {
    console.error("\n❌ Node.js is required.\n");
    process.exit(1);
  }

  await checkPostgres({ label: "Postgres (E2E)" });
  await checkPlaywrightBrowser();
  await checkPortAndServer();

  console.log("✓ Preflight passed\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
