import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { main } from "../src/main.js";

function capture(argv, cwd) {
  let out = "";
  let err = "";
  const code = main(argv, {
    cwd,
    isTty: false,
    stdout: {
      write(chunk) {
        out += chunk;
      },
    },
    stderr: {
      write(chunk) {
        err += chunk;
      },
    },
  });
  return { code, out, err };
}

function withProject(files, run) {
  const root = mkdtempSync(join(tmpdir(), "cdoc-test-"));
  try {
    for (const [name, contents] of Object.entries(files)) {
      const target = join(root, name);
      mkdirSync(join(target, ".."), { recursive: true });
      writeFileSync(target, contents);
    }
    return run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const HEALTHY_PKG = JSON.stringify(
  {
    name: "fixture",
    version: "1.0.0",
    description: "A test fixture",
    license: "MIT",
    engines: { node: ">=20" },
    scripts: { test: "node --test" },
  },
  null,
  2,
);

test("--version prints the package version and exits 0", () => {
  const { code, out } = capture(["--version"], process.cwd());
  assert.equal(code, 0);
  assert.match(out.trim(), /^\d+\.\d+\.\d+/);
});

test("--help prints usage and exits 0", () => {
  const { code, out } = capture(["--help"], process.cwd());
  assert.equal(code, 0);
  assert.match(out, /Usage/);
  assert.match(out, /Exit codes/);
});

test("an unknown option is a usage error", () => {
  const { code, err } = capture(["--nope"], process.cwd());
  assert.equal(code, 2);
  assert.match(err, /Unknown option/);
});

test("an unknown command is a usage error", () => {
  const { code, err } = capture(["diagnose"], process.cwd());
  assert.equal(code, 2);
  assert.match(err, /Unknown command/);
});

test("--cwd rejects a missing path value", () => {
  const { code, err } = capture(["--cwd"], process.cwd());
  assert.equal(code, 2);
  assert.match(err, /--cwd requires a path/);
});

test("a well-formed project reports no errors", () => {
  withProject(
    {
      "package.json": HEALTHY_PKG,
      "package-lock.json": JSON.stringify(
        { name: "fixture", lockfileVersion: 3 },
        null,
        2,
      ),
      ".gitignore": "node_modules/\n.env\n",
    },
    (root) => {
      const { code, out } = capture(["scan", "--json"], root);
      assert.equal(code, 0, out);

      const result = JSON.parse(out);
      assert.equal(result.categories.length, 5);
      assert.equal(result.totals.error, 0);
      assert.ok(result.score >= 90, `score was ${result.score}`);
      assert.ok(result.score <= 100);
      assert.equal(result.status, "attention");
    },
  );
});

test("a missing package.json produces an error and exit code 1", () => {
  withProject({ "README.md": "# nothing here\n" }, (root) => {
    const { code, out } = capture(["scan", "--json"], root);
    assert.equal(code, 1);

    const result = JSON.parse(out);
    assert.ok(result.totals.error > 0);
    assert.ok(result.score < 100);
  });
});

test("--strict turns warnings into a non-zero exit", () => {
  // No description, license or engines: warnings only, no errors.
  const loose = JSON.stringify(
    { name: "fixture", version: "1.0.0", scripts: { test: "node --test" } },
    null,
    2,
  );

  withProject(
    {
      "package.json": loose,
      "package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
      ".gitignore": "node_modules/\n.env\n",
    },
    (root) => {
      const relaxed = capture(["scan", "--json"], root);
      assert.equal(relaxed.code, 0);

      const strict = capture(["scan", "--json", "--strict"], root);
      assert.equal(strict.code, 1);

      const result = JSON.parse(strict.out);
      assert.equal(result.totals.error, 0);
      assert.ok(result.totals.warn > 0);
    },
  );
});

test("--cwd scans another directory", () => {
  withProject({ "keep.txt": "ignored" }, (outer) => {
    const inner = join(outer, "nested");
    mkdirSync(inner, { recursive: true });
    writeFileSync(join(inner, "package.json"), HEALTHY_PKG);
    writeFileSync(join(inner, "package-lock.json"), "{}");
    writeFileSync(join(inner, ".gitignore"), "node_modules/\n.env\n");

    const { code, out } = capture(["scan", "--json", "--cwd", "nested"], outer);
    assert.equal(code, 0, out);

    const result = JSON.parse(out);
    assert.ok(result.root.endsWith("nested"));
    assert.equal(result.totals.error, 0);
  });
});
