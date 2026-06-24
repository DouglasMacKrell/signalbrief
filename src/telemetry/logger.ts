import type { TelemetryPayload } from "./events";
import { recordTelemetryEvent } from "./recent-events";

const PREFIX = "[signalbrief:telemetry]";

export function logTelemetry(payload: TelemetryPayload) {
  const record = recordTelemetryEvent(payload);

  console.info(`${PREFIX} ${JSON.stringify(record)}`);
}

export type { TelemetryPayload } from "./events";
