import "dotenv/config";

import { bootstrapDatabase } from "../src/test/db-setup";
import { closeDb } from "../src/db/client";

async function main() {
  const count = await bootstrapDatabase();
  console.log(`Database ready (${count} demo accounts).`);
  await closeDb();
  process.exit(0);
}

main().catch(async (err) => {
  console.error(err);
  await closeDb().catch(() => undefined);
  process.exit(1);
});
