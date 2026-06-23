import { NextResponse } from "next/server";
import { z } from "zod";

import { submitFeedback } from "@/src/domain/feedback-service";

const FeedbackSchema = z.object({
  accountId: z.string(),
  briefingRunId: z.string().nullable().optional(),
  sentiment: z.enum(["helpful", "not_helpful"]),
  comment: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = FeedbackSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid feedback payload" }, { status: 400 });
  }

  await submitFeedback(parsed.data);
  return NextResponse.json({ ok: true });
}
