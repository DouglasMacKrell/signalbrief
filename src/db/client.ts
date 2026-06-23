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

  return postgres(connectionString, { max: 1 });
}

export function getDb() {
  if (!globalForDb.postgresClient) {
    globalForDb.postgresClient = createClient();
  }

  return drizzle(globalForDb.postgresClient, { schema });
}

export type Db = ReturnType<typeof getDb>;
