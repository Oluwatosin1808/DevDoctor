import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { capture, withTempProject } from "./support.js";

const PACKAGE = JSON.stringify({
  name: "fixture",
  version: "1.0.0",
  description: "A test fixture",
  license: "MIT",
  engines: { node: ">=20" },
  scripts: { test: "node --test" },
}, null, 2);

const BASE = {
  "package.json": PACKAGE,
  "package-lock.json": JSON.stringify({ name: "fixture", lockfileVersion: 3 }),
  ".gitignore": "node_modules/\n.env\n",
  "README.md": "# fixture\n",
};

test("--version prints the package version and exits 0", () => {
  const { code, out } = capture(["--version"], process.cwd());
  assert.equal(code, 0);
  assert.match(out.trim(), /^\d+\.\d+\.\d+$/);
});

test("--help documents both commands and exits 0", () => {
  const { code, out } = capture(["--help"], process.cwd());
  assert.equal(code, 0);
  assert.match(out, /cdoc scan \[target\]/);
  assert.match(out, /cdoc doctor \[target\]/);
  assert.match(out, /--json/);
  assert.match(out, /--no-color/);
});

test("unknown options and commands are usage errors", () => {
  assert.equal(capture(["--nope"], process.cwd()).code, 2);
  assert.match(capture(["--nope"], process.cwd()).err, /Unknown option/);
  assert.equal(capture(["diagnose"], process.cwd()).code, 2);
  assert.match(capture(["diagnose"], process.cwd()).err, /Unknown command/);
});

test("scan accepts a positional target directory", () => {
  withTempProject(BASE, (outer) => {
    const nested = join(outer, "some-project");
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(nested, "package.json"), PACKAGE);
    writeFileSync(join(nested, "package-lock.json"), "{}");
    writeFileSync(join(nested, ".gitignore"), "node_modules/\n.env\n");

    const { code, out } = capture(["scan", "./some-project", "--json"], outer);
    assert.equal(code, 0, out);
    const report = JSON.parse(out);
    assert.match(report.target.replace(/\\/g, "/"), /some-project$/);
    assert.equal(report.project.projectName, "fixture");
  });
});

test("--cwd remains supported", () => {
  withTempProject(BASE, (outer) => {
    const nested = join(outer, "nested");
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(nested, "package.json"), PACKAGE);
    writeFileSync(join(nested, ".gitignore"), "node_modules/\n.env\n");

    const { code, out } = capture(["scan", "--json", "--cwd", "nested"], outer);
    assert.equal(code, 0, out);
    assert.match(JSON.parse(out).target.replace(/\\/g, "/"), /nested$/);
  });
});

test("JSON mode writes only valid JSON to stdout", () => {
  withTempProject(BASE, (root) => {
    const { code, out, err } = capture(["scan", "--json"], root);
    assert.equal(code, 0);
    assert.equal(err, "");
    const report = JSON.parse(out);
    assert.equal(report.tool, "cdoc");
    assert.equal(report.schemaVersion, 1);
    assert.equal(report.totals.checks, 5);
    assert.ok(report.scanId);
    assert.ok(report.startedAt);
    assert.ok(report.finishedAt);
    assert.equal(typeof report.durationMs, "number");
    assert.ok(Array.isArray(report.findingsBySeverity.critical));
    assert.ok(report.findingsByCategory);
    assert.equal("score" in report, false);
  });
});

test("terminal output is branded, colourless when requested, and real", () => {
  withTempProject(BASE, (root) => {
    const { code, out } = capture(["scan", "--no-color"], root);
    assert.equal(code, 0);
    assert.match(out, /cDoc scan/);
    assert.match(out, /Project/);
    assert.match(out, /fixture/);
    assert.match(out, /Frameworks/);
    assert.match(out, /Languages/);
    assert.match(out, /Package mgr/);
    assert.match(out, /Progress/);
    assert.match(out, /Checks/);
    assert.match(out, /Findings by severity/);
    assert.match(out, /Recommended next steps/);
    assert.match(out, /Summary/);
    assert.equal(out.includes("\u001b["), false);
  });
});

test("doctor is a real alias of the scan engine", () => {
  withTempProject(BASE, (root) => {
    const { code, out } = capture(["doctor", "--no-color"], root);
    assert.equal(code, 0);
    assert.match(out, /cDoc doctor/);
    assert.match(out, /check\(s\) executed/);
  });
});

test("invalid target paths exit 2 and produce a readable error", () => {
  withTempProject(BASE, (root) => {
    const missing = capture(["scan", "does-not-exist", "--json"], root);
    assert.equal(missing.code, 2);
    assert.equal(JSON.parse(missing.out).error.code, "MISSING_TARGET");

    const file = capture(["scan", "package.json"], root);
    assert.equal(file.code, 2);
    assert.match(file.err, /Not a directory/);
  });
});

test("malformed package.json is reported without terminating the scan", () => {
  withTempProject({ ...BASE, "package.json": "{ not json" }, (root) => {
    const { code, out } = capture(["scan", "--json"], root);
    assert.equal(code, 1);
    const report = JSON.parse(out);
    assert.equal(report.checks.length, 5);
    assert.equal(report.totals.error, 0);
    assert.ok(report.findingsBySeverity.high.some((f) => f.id === "project/package-json-invalid"));
  });
});

test("conflicting lockfiles are reported explicitly", () => {
  withTempProject({ ...BASE, "yarn.lock": "lockfile" }, (root) => {
    const { code, out } = capture(["scan", "--json"], root);
    assert.equal(code, 1);
    const report = JSON.parse(out);
    assert.equal(report.project.packageManager, null);
    assert.deepEqual(report.project.packageManagerEvidence.conflicts, ["npm", "yarn"]);
    assert.ok(report.findingsBySeverity.high.some((f) => f.id === "project/package-manager-conflict"));
  });
});

test("--strict turns warnings into a non-zero exit", () => {
  withTempProject(BASE, (root) => {
    assert.equal(capture(["scan", "--json"], root).code, 0);
    const strict = capture(["scan", "--json", "--strict"], root);
    assert.equal(strict.code, 1);
    const report = JSON.parse(strict.out);
    assert.equal(report.totals.failed, 0);
    assert.ok(report.totals.warning > 0);
  });
});

test("verbose mode is accepted without contaminating JSON output", () => {
  withTempProject(BASE, (root) => {
    const { code, out } = capture(["scan", "--json", "--verbose"], root);
    assert.equal(code, 0);
    assert.doesNotThrow(() => JSON.parse(out));
  });
});
