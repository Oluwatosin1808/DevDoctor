import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { detectProject } from "../dist/detection/project.js";
import { discoverFiles } from "../dist/files/discovery.js";
import { projectCheck } from "../dist/checks/project.js";
import { gitCheck } from "../dist/checks/git.js";
import { environmentCheck } from "../dist/checks/environment.js";
import { securityCheck } from "../dist/checks/security.js";
import { readJsonFile, readTextFile } from "../dist/utils/fs.js";
import { withTempProject } from "./support.js";

function contextFor(root, trackedFiles = null) {
  const files = discoverFiles(root).files;
  return {
    rootPath: root,
    profile: detectProject(root, files),
    files,
    verbose: false,
    has: (name) => files.includes(name),
    readText: (name) => readTextFile(join(root, name)),
    readJson: (name) => readJsonFile(join(root, name)),
    trackedFiles: () => trackedFiles,
  };
}

test("project check reports missing and malformed package.json", () => {
  withTempProject({ "src/index.ts": "export {};" }, (root) => {
    const missing = projectCheck.execute(contextFor(root));
    assert.ok(missing.some((f) => f.id === "project/package-json-invalid"));
  });
  withTempProject({ "package.json": "{ nope" }, (root) => {
    const malformed = projectCheck.execute(contextFor(root));
    assert.ok(malformed.some((f) => f.id === "project/package-json-invalid"));
    assert.ok(malformed[0].description.includes("invalid JSON"));
  });
});

test("project check skips unsupported structures", () => {
  withTempProject({ "notes.txt": "hello" }, (root) => {
    const context = contextFor(root);
    assert.equal(projectCheck.applies(context), false);
  });
});

test("git check reports repository and ignore coverage from real state", () => {
  withTempProject(
    {
      ".git/HEAD": "ref: refs/heads/main\n",
      ".gitignore": "node_modules/\n.env*\n",
      "package.json": "{}",
    },
    (root) => {
      const findings = gitCheck.execute(contextFor(root));
      assert.equal(findings.some((f) => f.id === "git/no-repository"), false);
      assert.equal(findings.some((f) => f.id === "git/no-gitignore"), false);
      assert.equal(findings.some((f) => f.id === "git/missing-ignore-rules"), true);
    },
  );
});

test("git check flags tracked generated files", () => {
  withTempProject({ ".gitignore": "node_modules/\n", "package.json": "{}" }, (root) => {
    const findings = gitCheck.execute(contextFor(root, ["dist/bundle.js"]));
    assert.ok(findings.some((f) => f.id === "git/generated-files-tracked"));
  });
});

test("environment check never reads env file contents", () => {
  withTempProject(
    {
      ".gitignore": "node_modules/\n",
      ".env": "API_TOKEN=super-secret-value\n",
      "package.json": "{}",
    },
    (root) => {
      const findings = environmentCheck.execute(contextFor(root, [".env"]));
      assert.ok(findings.some((f) => f.id === "environment/tracked"));
      assert.ok(findings.some((f) => f.id === "environment/not-ignored"));
      for (const finding of findings) {
        assert.equal(JSON.stringify(finding).includes("super-secret-value"), false);
      }
    },
  );
});

test("security check reports credential shapes without exposing values", () => {
  const token = "ghp_" + "a".repeat(36);
  withTempProject(
    {
      "package.json": "{}",
      "src/config.js": `const token = "${token}";\n`,
      ".env": `TOKEN=${token}\n`,
      ".gitignore": ".env\n",
    },
    (root) => {
      const findings = securityCheck.execute(contextFor(root));
      const secret = findings.find((f) => f.id.startsWith("security/pattern-github-token"));
      assert.ok(secret, JSON.stringify(findings));
      assert.equal(JSON.stringify(findings).includes(token), false);
      assert.equal(secret.file, "src/config.js");
    },
  );
});
