import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  briefingRuns,
  feedbackEvents,
  accounts,
  calls,
  healthSnapshots,
  opportunities,
  supportTickets,
} from "../src/db/schema";
import { demoAccountsSeed, DEMO_ACCOUNT_COUNT } from "../src/seed/demo-accounts";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const client = postgres(url, { max: 1 });
  const db = drizzle(client);

  console.log("Seeding demo accounts...");

  await db.delete(feedbackEvents);
  await db.delete(briefingRuns);
  await db.delete(supportTickets);
  await db.delete(calls);
  await db.delete(healthSnapshots);
  await db.delete(opportunities);
  await db.delete(accounts);

  await db.insert(accounts).values(demoAccountsSeed.accounts);
  await db.insert(opportunities).values(demoAccountsSeed.opportunities);
  await db.insert(calls).values(demoAccountsSeed.calls);
  await db.insert(supportTickets).values(demoAccountsSeed.tickets);
  await db.insert(healthSnapshots).values(demoAccountsSeed.healthSnapshots);

  console.log(`Seeded ${DEMO_ACCOUNT_COUNT} accounts.`);

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
