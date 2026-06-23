import type { TelemetryPayload } from "./events";

const PREFIX = "[signalbrief:telemetry]";

export function logTelemetry(payload: TelemetryPayload) {
  const record = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  console.info(`${PREFIX} ${JSON.stringify(record)}`);
}
