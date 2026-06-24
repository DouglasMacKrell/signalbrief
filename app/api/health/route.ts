export const dynamic = "force-dynamic";

/** Liveness probe for Render — no database dependency. */
export async function GET() {
  return Response.json({
    ok: true,
    service: "signalbrief",
    ts: new Date().toISOString(),
  });
}
