import { randomUUID } from "node:crypto";

import { getDb } from "@/src/db/client";
import { feedbackEvents } from "@/src/db/schema";

export async function submitFeedback(input: {
  accountId: string;
  briefingRunId?: string | null;
  sentiment: "helpful" | "not_helpful";
  comment?: string | null;
}) {
  const db = getDb();

  await db.insert(feedbackEvents).values({
    id: randomUUID(),
    accountId: input.accountId,
    briefingRunId: input.briefingRunId ?? null,
    sentiment: input.sentiment,
    comment: input.comment ?? null,
    createdAt: new Date(),
  });

  return { ok: true as const };
}
