import "dotenv/config";

import { prepareTestDatabase } from "../src/test/db-setup";

async function main() {
  await prepareTestDatabase();
  console.log("Database ready for E2E.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
