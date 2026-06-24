import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined;
};

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const isRender =
    process.env.RENDER === "true" ||
    connectionString.includes("render.com");

  return postgres(connectionString, {
    max: 1,
    connect_timeout: 10,
    ...(isRender ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

export function getDb() {
  if (!globalForDb.postgresClient) {
    globalForDb.postgresClient = createClient();
  }

  return drizzle(globalForDb.postgresClient, { schema });
}

export async function closeDb() {
  if (!globalForDb.postgresClient) return;
  await globalForDb.postgresClient.end({ timeout: 5 });
  globalForDb.postgresClient = undefined;
}

export type Db = ReturnType<typeof getDb>;
