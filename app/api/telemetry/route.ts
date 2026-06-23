import { NextResponse } from "next/server";
import { z } from "zod";

import { logTelemetry } from "@/src/telemetry/logger";
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
