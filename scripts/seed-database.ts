import "dotenv/config";

import { prepareTestDatabase } from "../src/test/db-setup";

async function main() {
  const count = await prepareTestDatabase();
  console.log(`Seeded ${count} accounts.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
