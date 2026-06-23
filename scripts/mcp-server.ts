import "dotenv/config";

import { closeDb } from "../src/db/client";
import { startMcpStdioServer } from "../src/mcp/server";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required for the MCP server.");
    process.exit(1);
  }

  await startMcpStdioServer();
}

main().catch(async (err) => {
  console.error(err);
  await closeDb().catch(() => undefined);
  process.exit(1);
});
