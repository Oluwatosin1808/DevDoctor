import assert from "node:assert/strict";
import { test } from "node:test";
import { makeFinding, severityRank } from "../dist/findings.js";
import { CheckRegistry } from "../dist/engine/registry.js";
import { runChecks, statusFromFindings } from "../dist/engine/runner.js";
import { buildReport, overallStatus } from "../dist/report/model.js";
import { formatJson } from "../dist/reporters/json.js";
import { formatTerminal } from "../dist/reporters/terminal.js";
import { makePaint } from "../dist/utils/colors.js";

const profile = {
  rootPath: "/project",
  projectName: "fixture",
  languages: ["typescript"],
  frameworks: ["nodejs"],
  packageManager: "npm",
  packageManagerEvidence: { lockfiles: ["package-lock.json"], declared: null, conflicts: [] },
  runtime: "node",
  hasTypeScript: true,
  hasGit: true,
  configurationFiles: ["package.json"],
  detectedAt: "2026-01-01T00:00:00.000Z",
};

function context(overrides = {}) {
  return {
    rootPath: "/project",
    profile,
    files: ["package.json", "src/index.ts"],
    verbose: false,
    has: () => true,
    readText: () => ({ ok: true, value: "", reason: null }),
    readJson: () => ({ ok: true, value: {}, reason: null }),
    trackedFiles: () => null,
    ...overrides,
  };
}

function check(id, findings = [], applies = true) {
  return {
    id,
    name: id,
    description: id,
    category: "test",
    defaultSeverity: "medium",
    applies: () => applies,
    execute: () => findings,
  };
}

test("registry registers and discovers checks, rejecting duplicate IDs", () => {
  const registry = new CheckRegistry().register(check("one"));
  assert.equal(registry.has("one"), true);
  assert.equal(registry.get("one")?.id, "one");
  assert.equal(registry.size, 1);
  assert.throws(() => registry.register(check("one")), /already registered/);
});

test("check status distinguishes passed, warning, failed and info-only findings", () => {
  assert.equal(statusFromFindings([]), "passed");
  assert.equal(
    statusFromFindings([makeFinding({ ...baseFinding(), severity: "info" })]),
    "passed",
  );
  assert.equal(
    statusFromFindings([makeFinding({ ...baseFinding(), severity: "low" })]),
    "warning",
  );
  assert.equal(
    statusFromFindings([makeFinding({ ...baseFinding(), severity: "high" })]),
    "failed",
  );
});

function baseFinding() {
  return {
    id: "test/finding",
    title: "Finding",
    description: "Description",
    severity: "medium",
    category: "test",
    checkId: "test",
  };
}

test("runner marks inapplicable checks as skipped, not passed", () => {
  const registry = new CheckRegistry().register(check("skipped", [], false));
  const [result] = runChecks(context(), registry);
  assert.equal(result?.status, "skipped");
  assert.notEqual(result?.status, "passed");
  assert.equal(result?.findings[0]?.id, "skipped/skipped");
});

test("one failing check does not stop the others", () => {
  const throwing = {
    ...check("explodes"),
    execute() { throw new Error("boom"); },
  };
  const registry = new CheckRegistry()
    .register(throwing)
    .register(check("healthy"));
  const results = runChecks(context(), registry);
  assert.equal(results[0]?.status, "error");
  assert.equal(results[0]?.findings[0]?.title, "Check could not complete");
  assert.equal(results[0]?.error?.stack, undefined);
  assert.equal(results[1]?.status, "passed");
});

test("verbose mode includes the stack for failed checks", () => {
  const throwing = {
    ...check("explodes"),
    execute() { throw new Error("boom"); },
  };
  const results = runChecks(context({ verbose: true }), new CheckRegistry().register(throwing));
  assert.match(results[0]?.error?.stack ?? "", /boom/);
});

test("findings normalise paths, redact secrets and keep metadata JSON-safe", () => {
  const finding = makeFinding({
    ...baseFinding(),
    file: ".\\src\\index.ts",
    line: 12,
    description: "token=ghp_abcdefghijklmnopqrstuvwxyz0123456789",
    recommendation: "Rotate the credential",
    confidence: "low",
    metadata: { count: 2, flag: true, empty: null, text: "safe" },
  });
  assert.equal(finding.file, "src/index.ts");
  assert.equal(finding.line, 12);
  assert.equal(finding.confidence, "low");
  assert.equal(finding.description.includes("ghp_abcdefghijklmnopqrstuvwxyz0123456789"), false);
  assert.deepEqual(finding.metadata, { count: 2, flag: true, empty: null, text: "safe" });
  assert.ok(severityRank("critical") > severityRank("info"));
});

test("report aggregates counts, groups findings, and has no health score", () => {
  const high = makeFinding({ ...baseFinding(), id: "a", severity: "high", category: "git" });
  const low = makeFinding({ ...baseFinding(), id: "b", severity: "low", category: "project" });
  const checks = [
    { id: "one", name: "One", status: "failed", findings: [high], durationMs: 1 },
    { id: "two", name: "Two", status: "warning", findings: [low], durationMs: 1 },
    { id: "three", name: "Three", status: "skipped", findings: [], durationMs: 1 },
  ];
  const report = buildReport({
    scanId: "scan-1",
    target: "/project",
    project: profile,
    startedAt: new Date("2026-01-01T00:00:00.000Z"),
    finishedAt: new Date("2026-01-01T00:00:00.005Z"),
    discovery: { files: 10, ignored: 2, truncated: false },
    checks,
  });
  assert.equal(report.status, "failed");
  assert.equal(overallStatus(checks), "failed");
  assert.deepEqual(report.totals, {
    checks: 3,
    passed: 0,
    warning: 1,
    failed: 1,
    skipped: 1,
    error: 0,
    findings: 2,
  });
  assert.equal(report.findingsBySeverity.high.length, 1);
  assert.equal(report.findingsBySeverity.low.length, 1);
  assert.ok(report.findingsByCategory.git);
  assert.ok(report.findingsByCategory.project);
  assert.equal("score" in report, false);
  assert.equal(report.durationMs, 5);
});

test("reporters produce valid JSON and colourless terminal output", () => {
  const finding = makeFinding({ ...baseFinding(), recommendation: "Fix it" });
  const report = buildReport({
    scanId: "scan-2",
    target: "/project",
    project: profile,
    startedAt: new Date("2026-01-01T00:00:00.000Z"),
    finishedAt: new Date("2026-01-01T00:00:00.001Z"),
    discovery: { files: 1, ignored: 0, truncated: false },
    checks: [{ id: "one", name: "One", status: "warning", findings: [finding], durationMs: 1 }],
  });
  const json = formatJson(report);
  assert.deepEqual(JSON.parse(json).scanId, "scan-2");
  const terminal = formatTerminal(report, makePaint(false));
  assert.match(terminal, /cDoc scan/);
  assert.match(terminal, /Fix it/);
  assert.equal(terminal.includes("\u001b["), false);
});
