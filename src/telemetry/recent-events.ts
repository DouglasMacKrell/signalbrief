import type { TelemetryPayload } from "./events";

export type RecordedTelemetryEvent = TelemetryPayload & {
  timestamp: string;
};

const MAX_RECENT_EVENTS = 30;
const recentEvents: RecordedTelemetryEvent[] = [];

export function recordTelemetryEvent(
  payload: TelemetryPayload,
  timestamp = new Date().toISOString(),
): RecordedTelemetryEvent {
  const record = { ...payload, timestamp };
  recentEvents.unshift(record);
  if (recentEvents.length > MAX_RECENT_EVENTS) {
    recentEvents.length = MAX_RECENT_EVENTS;
  }
  return record;
}

export function getRecentTelemetry(accountId?: string): RecordedTelemetryEvent[] {
  if (!accountId) return [...recentEvents];
  return recentEvents.filter((event) => event.accountId === accountId);
}

export function clearRecentTelemetryForTests() {
  recentEvents.length = 0;
}
