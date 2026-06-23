import "dotenv/config";

import { ensureMigrated } from "../src/test/db-setup";

async function main() {
  await ensureMigrated();
  console.log("Migrations complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
