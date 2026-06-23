import { randomUUID } from "node:crypto";

import { desc, eq } from "drizzle-orm";

import { getDb } from "@/src/db/client";
import { briefingRuns } from "@/src/db/schema";
import { getAccountContext } from "@/src/domain/account-context";
import { validateEvidenceIds } from "@/src/domain/evidence";
import { BriefingSchema, type Briefing } from "@/src/domain/briefing-schema";
import { getBriefingProvider } from "@/src/domain/briefing-provider";
import { calculateRiskSignals } from "@/src/domain/risk-engine";

export class BriefingValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BriefingValidationError";
  }
}

function validateBriefingEvidence(briefing: Briefing, context: NonNullable<Awaited<ReturnType<typeof getAccountContext>>>) {
  const allIds = [
    ...briefing.risks.flatMap((r) => r.evidenceIds),
    ...briefing.positiveSignals.flatMap((p) => p.evidenceIds),
    ...briefing.nextBestAction.evidenceIds,
  ];

  for (const id of allIds) {
    if (!validateEvidenceIds([id], context)) {
      throw new BriefingValidationError(`Unknown evidence ID: ${id}`);
    }
  }
}

export async function generateBriefing(accountId: string) {
  const context = await getAccountContext(accountId);
  if (!context) {
    return { error: "Account not found" as const, status: 404 };
  }

  const risks = calculateRiskSignals(context);
  const provider = getBriefingProvider();
  const started = Date.now();
  const runId = randomUUID();

  try {
    const raw = await provider.generate(context, risks);
    const briefing = BriefingSchema.parse(raw);
    validateBriefingEvidence(briefing, context);

    const latencyMs = Date.now() - started;
    const db = getDb();

    await db.insert(briefingRuns).values({
      id: runId,
      accountId,
      provider: provider.name,
      status: "success",
      latencyMs,
      outputJson: briefing,
      errorMessage: null,
      createdAt: new Date(),
    });

    return {
      briefing,
      briefingRunId: runId,
      provider: provider.name,
      status: 200,
    };
  } catch (err) {
    const latencyMs = Date.now() - started;
    const message = err instanceof Error ? err.message : "Briefing generation failed";
    const db = getDb();

    await db.insert(briefingRuns).values({
      id: runId,
      accountId,
      provider: provider.name,
      status: "failure",
      latencyMs,
      outputJson: null,
      errorMessage: message,
      createdAt: new Date(),
    });

    return { error: message, status: 422 };
  }
}

export async function getBriefingHistory(accountId: string) {
  const db = getDb();
  return db
    .select()
    .from(briefingRuns)
    .where(eq(briefingRuns.accountId, accountId))
    .orderBy(desc(briefingRuns.createdAt));
}
