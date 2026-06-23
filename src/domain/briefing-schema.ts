import { z } from "zod";

export const BriefingRiskSchema = z.object({
  label: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  evidenceIds: z.array(z.string()).min(1),
});

export const BriefingPositiveSignalSchema = z.object({
  label: z.string(),
  evidenceIds: z.array(z.string()).min(1),
});

export const BriefingNextActionSchema = z.object({
  action: z.string(),
  reason: z.string(),
  evidenceIds: z.array(z.string()).min(1),
});

export const BriefingSchema = z.object({
  summary: z.string(),
  risks: z.array(BriefingRiskSchema),
  positiveSignals: z.array(BriefingPositiveSignalSchema),
  nextBestAction: BriefingNextActionSchema,
  talkingPoints: z.array(z.string()).min(1),
});

export type Briefing = z.infer<typeof BriefingSchema>;
