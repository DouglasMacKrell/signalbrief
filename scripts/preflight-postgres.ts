import net from "node:net";

import postgres from "postgres";

const DEFAULT_DATABASE_URL =
  "postgresql://signalbrief:signalbrief@127.0.0.1:5432/signalbrief";

export function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;
}

export async function checkPostgres(options?: {
  timeoutMs?: number;
  label?: string;
}): Promise<void> {
  const timeoutMs = options?.timeoutMs ?? 5_000;
  const label = options?.label ?? "Postgres";
  const url = getDatabaseUrl();

  const sql = postgres(url, {
    max: 1,
    connect_timeout: Math.ceil(timeoutMs / 1000),
  });

  try {
    await Promise.race([
      sql`select 1 as ok`,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`${label} did not respond within ${timeoutMs / 1000}s`)),
          timeoutMs,
        ),
      ),
    ]);
  } catch (err) {
    console.error(`\n❌ ${label} is not reachable at ${sanitizeUrl(url)}`);
    console.error("   Start Postgres: docker compose up -d");
    console.error("   Then seed:      npm run db:setup\n");
    if (err instanceof Error && err.message.includes("did not respond")) {
      console.error(`   (${err.message})\n`);
    }
    throw err;
  } finally {
    await sql.end({ timeout: 1 }).catch(() => undefined);
  }
}

export async function isPortAvailable(port: number, host = "127.0.0.1") {
  return new Promise<boolean>((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, host);
  });
}

export async function waitForHttpOk(
  url: string,
  options?: { timeoutMs?: number; mustInclude?: string },
): Promise<void> {
  const timeoutMs = options?.timeoutMs ?? 5_000;
  const mustInclude = options?.mustInclude ?? "SignalBrief";
  const deadline = Date.now() + timeoutMs;
  let lastError = "no response";

  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2_000) });
      const body = await res.text();
      if (res.ok && body.includes(mustInclude)) return;
      lastError = res.ok
        ? `HTTP ${res.status} but page is not SignalBrief (wrong service on this port?)`
        : `HTTP ${res.status}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
    await sleep(250);
  }

  throw new Error(`${url} not ready after ${timeoutMs / 1000}s (${lastError})`);
}

function sanitizeUrl(url: string) {
  return url.replace(/:[^:@/]+@/, ":***@");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
