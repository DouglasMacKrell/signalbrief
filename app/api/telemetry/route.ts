import { NextResponse } from "next/server";
import { z } from "zod";

import { logTelemetry } from "@/src/telemetry/logger";
import { getRecentTelemetry } from "@/src/telemetry/recent-events";
import type { TelemetryEvent } from "@/src/telemetry/events";

const bodySchema = z.object({
  event: z.enum([
    "account_viewed",
    "draft_follow_up_requested",
    "risk_signal_viewed",
  ]),
  accountId: z.string().min(1),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid telemetry payload" }, { status: 400 });
  }

  logTelemetry({
    event: parsed.data.event as TelemetryEvent,
    accountId: parsed.data.accountId,
    metadata: parsed.data.metadata,
  });

  return NextResponse.json({ ok: true });
}

function isTelemetryDebugEnabled(request: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const url = new URL(request.url);
  return url.searchParams.get("debug") === "1";
}

export async function GET(request: Request) {
  if (!isTelemetryDebugEnabled(request)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const accountId = url.searchParams.get("accountId") ?? undefined;

  return NextResponse.json({
    events: getRecentTelemetry(accountId),
  });
}
