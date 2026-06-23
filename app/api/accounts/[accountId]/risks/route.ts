import { NextResponse } from "next/server";

import { getAccountContext } from "@/src/domain/account-context";
import { calculateRiskSignals } from "@/src/domain/risk-engine";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ accountId: string }> },
) {
  const { accountId } = await params;
  const context = await getAccountContext(accountId);

  if (!context) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json({ risks: calculateRiskSignals(context) });
}
