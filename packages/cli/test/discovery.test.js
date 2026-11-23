import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { discoverFiles } from "../dist/files/discovery.js";
import { readTextFile, resolveInside, safeRelative } from "../dist/utils/fs.js";
import { withTempProject } from "./support.js";

test("discovery returns sorted project-relative POSIX paths", () => {
  withTempProject(
    {
      "z.txt": "z",
      "src/b.ts": "b",
      "src/a.ts": "a",
    },
    (root) => {
      const result = discoverFiles(root);
      assert.deepEqual(result.files, ["src/a.ts", "src/b.ts", "z.txt"]);
      assert.equal(result.files.some((path) => path.includes("\\")), false);
      assert.equal(result.truncated, false);
    },
  );
});

test("respects root gitignore patterns, negation and anchoring", () => {
  withTempProject(
    {
      ".gitignore": "*.log\n!keep.log\nbuild/\nsecrets/**\n/root-only.txt\n",
      "a.log": "x",
      "keep.log": "x",
      "src/nested.log": "x",
      "build/out.js": "x",
      "secrets/key.txt": "x",
      "root-only.txt": "x",
      "src/root-only.txt": "x",
    },
    (root) => {
      const { files } = discoverFiles(root);
      assert.ok(files.includes("keep.log"));
      assert.ok(files.includes("src/root-only.txt"));
      assert.equal(files.includes("a.log"), false);
      assert.equal(files.includes("src/nested.log"), false);
      assert.equal(files.includes("build/out.js"), false);
      assert.equal(files.includes("secrets/key.txt"), false);
      assert.equal(files.includes("root-only.txt"), false);
    },
  );
});

test("respects nested gitignore files scoped to their directory", () => {
  withTempProject(
    {
      ".gitignore": "# root\n",
      "src/.gitignore": "local.txt\n!keep-local.txt\n",
      "src/local.txt": "x",
      "src/keep-local.txt": "x",
      "local.txt": "x",
    },
    (root) => {
      const { files } = discoverFiles(root);
      assert.ok(files.includes("src/keep-local.txt"));
      assert.ok(files.includes("local.txt"));
      assert.equal(files.includes("src/local.txt"), false);
    },
  );
});

test("excludes generated directories and never follows symlinks", () => {
  const root = mkdtempSync(join(tmpdir(), "cdoc-discovery-"));
  const outside = mkdtempSync(join(tmpdir(), "cdoc-outside-"));
  try {
    writeFileSync(join(root, "index.js"), "export {};");
    mkdirSync(join(root, "node_modules"), { recursive: true });
    writeFileSync(join(root, "node_modules", "pkg.js"), "x");
    mkdirSync(join(root, ".git"), { recursive: true });
    writeFileSync(join(root, ".git", "HEAD"), "ref");
    mkdirSync(join(outside, "secret-dir"), { recursive: true });
    writeFileSync(join(outside, "secret-dir", "secret.txt"), "outside");
    try {
      symlinkSync(
        join(outside, "secret-dir"),
        join(root, "linked"),
        process.platform === "win32" ? "junction" : "dir",
      );
    } catch {
      // Some environments disallow symlinks entirely; the remaining assertions still apply.
    }

    const { files } = discoverFiles(root);
    assert.deepEqual(files, ["index.js"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
});

test("prevents directory traversal in relative-path helpers", () => {
  const root = join(tmpdir(), "cdoc-project");
  assert.equal(safeRelative(root, join(root, "..", "outside.txt")), null);
  assert.equal(resolveInside(root, "../outside.txt"), null);
  assert.equal(resolveInside(root, join("..", "outside.txt")), null);
  assert.ok(resolveInside(root, "src/index.ts")?.startsWith(root));
});

test("supports include and exclude glob patterns", () => {
  withTempProject(
    {
      "src/a.ts": "a",
      "src/b.ts": "b",
      "src/b.generated.ts": "generated",
      "README.md": "readme",
    },
    (root) => {
      const result = discoverFiles(root, {
        include: ["**/*.ts"],
        exclude: ["*.generated.ts"],
      });
      assert.deepEqual(result.files, ["src/a.ts", "src/b.ts"]);
    },
  );
});

test("caps file count predictably", () => {
  withTempProject({ "a.txt": "a", "b.txt": "b", "c.txt": "c" }, (root) => {
    const result = discoverFiles(root, { maxFiles: 2 });
    assert.equal(result.files.length, 2);
    assert.equal(result.truncated, true);
  });
});

test("discovery does not read large files, and reads are capped", () => {
  withTempProject({ "large.txt": "x".repeat(600 * 1024) }, (root) => {
    const result = discoverFiles(root);
    assert.deepEqual(result.files, ["large.txt"]);
    const read = readTextFile(join(root, "large.txt"));
    assert.equal(read.ok, false);
    assert.equal(read.reason, "too-large");
  });
});
