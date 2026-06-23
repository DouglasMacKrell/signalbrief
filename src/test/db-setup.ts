import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";

import { getDb } from "@/src/db/client";
import {
  accounts,
  calls,
  healthSnapshots,
  opportunities,
  supportTickets,
} from "@/src/db/schema";
import {
  DEMO_ACCOUNT_COUNT,
  demoAccountsSeed,
} from "@/src/seed/demo-accounts";

export async function ensureMigrated() {
  const db = getDb();
  await migrate(db, { migrationsFolder: "./drizzle" });
}

export async function resetDemoDatabase() {
  const db = getDb();

  await db.execute(sql`TRUNCATE TABLE accounts RESTART IDENTITY CASCADE`);

  await db.insert(accounts).values(demoAccountsSeed.accounts);
  await db.insert(opportunities).values(demoAccountsSeed.opportunities);
  await db.insert(calls).values(demoAccountsSeed.calls);
  await db.insert(supportTickets).values(demoAccountsSeed.tickets);
  await db.insert(healthSnapshots).values(demoAccountsSeed.healthSnapshots);

  return DEMO_ACCOUNT_COUNT;
}

export async function prepareTestDatabase() {
  await ensureMigrated();
  return resetDemoDatabase();
}

/** Production-safe: migrate always; seed only when the database is empty. */
export async function bootstrapDatabase() {
  await ensureMigrated();

  const db = getDb();
  const existing = await db.select({ id: accounts.id }).from(accounts).limit(1);
  if (existing.length > 0) {
    return existing.length;
  }

  await db.insert(accounts).values(demoAccountsSeed.accounts);
  await db.insert(opportunities).values(demoAccountsSeed.opportunities);
  await db.insert(calls).values(demoAccountsSeed.calls);
  await db.insert(supportTickets).values(demoAccountsSeed.tickets);
  await db.insert(healthSnapshots).values(demoAccountsSeed.healthSnapshots);

  return DEMO_ACCOUNT_COUNT;
}
