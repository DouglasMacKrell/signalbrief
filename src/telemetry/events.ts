export type TelemetryEvent =
  | "account_viewed"
  | "briefing_requested"
  | "briefing_generated"
  | "briefing_failed"
  | "risk_signal_viewed"
  | "feedback_submitted"
  | "draft_follow_up_requested";

export type TelemetryPayload = {
  event: TelemetryEvent;
  accountId: string;
  provider?: string;
  latencyMs?: number;
  success?: boolean;
  sentiment?: "helpful" | "not_helpful";
  metadata?: Record<string, string | number | boolean>;
};
