import { NextResponse } from "next/server";

import { getAccounts } from "@/src/domain/account-context";

export const dynamic = "force-dynamic";

export async function GET() {
  const accounts = await getAccounts();
  return NextResponse.json({ accounts });
}
