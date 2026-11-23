import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  buildTelemetryPayload,
  getOrCreateInstallId,
  readTelemetrySettings,
  sendTelemetry,
} from "../dist/telemetry.js";
import { flushTelemetry } from "../dist/cli/commands.js";
import { capture, withTempProject } from "./support.js";

test("telemetry is off unless explicitly enabled with a valid endpoint", () => {
  assert.deepEqual(readTelemetrySettings({}), {
    enabled: false,
    endpoint: null,
    installId: null,
  });
  assert.equal(
    readTelemetrySettings({ CDOC_TELEMETRY_ENDPOINT: "https://example.test/collect" }).enabled,
    false,
  );
  assert.equal(readTelemetrySettings({ CDOC_TELEMETRY: "1" }).endpoint, null);
  assert.equal(
    readTelemetrySettings({
      CDOC_TELEMETRY: "true",
      CDOC_TELEMETRY_ENDPOINT: "ftp://example.test",
    }).endpoint,
    null,
  );
  const enabled = readTelemetrySettings({
    CDOC_TELEMETRY: "1",
    CDOC_TELEMETRY_ENDPOINT: "https://example.test/collect",
    CDOC_TELEMETRY_ID: "anon-12345678",
  });
  assert.equal(enabled.enabled, true);
  assert.equal(enabled.endpoint, "https://example.test/collect");
  assert.equal(enabled.installId, "anon-12345678");
});

test("install ID is stable and stored outside the scanned project", () => {
  const home = mkdtempSync(join(tmpdir(), "cdoc-telemetry-"));
  try {
    const first = getOrCreateInstallId(home, {});
    const second = getOrCreateInstallId(home, {});
    assert.equal(first, second);
    assert.match(first, /^[A-Za-z0-9_-]{8,128}$/);
    assert.equal(getOrCreateInstallId(home, { CDOC_TELEMETRY_ID: "custom-id-1234" }), "custom-id-1234");
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
});

test("payload contains only anonymous counters", () => {
  const payload = buildTelemetryPayload(
    {
      enabled: true,
      endpoint: "https://example.test/collect",
      installId: "anon-12345678",
    },
    "scan",
    "completed",
    "0.1.0",
    new Date("2026-01-01T00:00:00.000Z"),
  );
  assert.deepEqual(Object.keys(payload).sort(), [
    "command",
    "event",
    "installId",
    "outcome",
    "schemaVersion",
    "timestamp",
    "tool",
    "version",
  ]);
  assert.equal(payload.command, "scan");
  assert.equal(payload.installId, "anon-12345678");
  assert.equal(JSON.stringify(payload).includes("path"), false);
});

test("sendTelemetry posts JSON and never throws on failure", async () => {
  let seen;
  const fakeFetch = async (url, options) => {
    seen = { url, options };
    return { ok: true };
  };
  const payload = buildTelemetryPayload(
    { enabled: true, endpoint: "https://example.test/collect", installId: "anon-12345678" },
    "doctor",
    "completed",
    "0.1.0",
  );
  assert.equal(await sendTelemetry(payload, "https://example.test/collect", fakeFetch), true);
  assert.equal(seen.url, "https://example.test/collect");
  assert.equal(seen.options.method, "POST");
  assert.deepEqual(JSON.parse(seen.options.body), payload);

  const failing = async () => { throw new Error("offline"); };
  assert.equal(await sendTelemetry(payload, "https://example.test/collect", failing), false);
});

test("CLI sends one anonymous event only when opted in", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, payload: JSON.parse(options.body) });
    return { ok: true };
  };
  try {
    withTempProject({ "package.json": "{}" }, (root) => {
      const env = {
        CDOC_TELEMETRY: "1",
        CDOC_TELEMETRY_ENDPOINT: "https://example.test/collect",
        CDOC_TELEMETRY_ID: "anon-12345678",
      };
      const disabled = capture(["scan", "--json"], root, {});
      assert.equal(disabled.code, 0);
      assert.equal(calls.length, 0);

      capture(["scan", "--json"], root, env);
      assert.equal(calls.length, 1);
      assert.equal(calls[0].payload.command, "scan");
      assert.equal(calls[0].payload.installId, "anon-12345678");
      assert.equal(JSON.stringify(calls[0].payload).includes(root), false);
    });
    await flushTelemetry();
  } finally {
    globalThis.fetch = originalFetch;
  }
});
