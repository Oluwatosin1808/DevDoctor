import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Optional, anonymous usage counters. Telemetry is off unless both
 * CDOC_TELEMETRY and CDOC_TELEMETRY_ENDPOINT are set. The payload deliberately
 * contains no target path, file name, finding, source code or scan result.
 */

export interface TelemetrySettings {
  enabled: boolean;
  endpoint: string | null;
  installId: string | null;
}

export interface TelemetryPayload {
  schemaVersion: 1;
  tool: "cdoc";
  event: "command";
  command: "scan" | "doctor";
  outcome: "completed" | "failed";
  installId: string;
  version: string;
  timestamp: string;
}

const ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);
const ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

export function readTelemetrySettings(env: NodeJS.ProcessEnv): TelemetrySettings {
  const enabled = ENABLED_VALUES.has((env.CDOC_TELEMETRY ?? "").trim().toLowerCase());
  const rawEndpoint = env.CDOC_TELEMETRY_ENDPOINT;
  let endpoint: string | null = null;

  if (rawEndpoint !== undefined && rawEndpoint !== "") {
    try {
      const url = new URL(rawEndpoint);
      if (url.protocol === "http:" || url.protocol === "https:") endpoint = url.toString();
    } catch {
      endpoint = null;
    }
  }

  return { enabled, endpoint, installId: env.CDOC_TELEMETRY_ID ?? null };
}

/** Best-effort stable anonymous ID, stored outside the scanned project. */
export function getOrCreateInstallId(directory: string, env: NodeJS.ProcessEnv): string {
  const fromEnv = env.CDOC_TELEMETRY_ID;
  if (typeof fromEnv === "string" && ID_PATTERN.test(fromEnv)) return fromEnv;

  const configDirectory = join(directory, ".cdoc");
  const idFile = join(configDirectory, "telemetry-id");
  try {
    const existing = readFileSync(idFile, "utf8").trim();
    if (ID_PATTERN.test(existing)) return existing;
  } catch {
    // A missing or unreadable file simply means a new ID is generated.
  }

  const id = randomUUID();
  try {
    mkdirSync(configDirectory, { recursive: true });
    writeFileSync(idFile, id, { encoding: "utf8", mode: 0o600 });
  } catch {
    // Telemetry still works with a per-run ID if the home directory is read-only.
  }
  return id;
}

export function buildTelemetryPayload(
  settings: TelemetrySettings,
  command: TelemetryPayload["command"],
  outcome: TelemetryPayload["outcome"],
  version: string,
  now: Date = new Date(),
): TelemetryPayload {
  const installId =
    settings.installId !== null && ID_PATTERN.test(settings.installId)
      ? settings.installId
      : getOrCreateInstallId(homedir(), {});

  return {
    schemaVersion: 1,
    tool: "cdoc",
    event: "command",
    command,
    outcome,
    installId,
    version,
    timestamp: now.toISOString(),
  };
}

/** Never throws: telemetry must not affect the exit code or scan output. */
export async function sendTelemetry(
  payload: TelemetryPayload,
  endpoint: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(1500),
    });
    return response.ok;
  } catch {
    return false;
  }
}
