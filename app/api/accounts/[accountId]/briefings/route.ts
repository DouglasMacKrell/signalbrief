import { NextResponse } from "next/server";

import { generateBriefing } from "@/src/domain/briefing-service";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ accountId: string }> },
) {
  const { accountId } = await params;
  const result = await generateBriefing(accountId);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    briefing: result.briefing,
    briefingRunId: result.briefingRunId,
    provider: result.provider,
    latencyMs: result.latencyMs,
  });
}
