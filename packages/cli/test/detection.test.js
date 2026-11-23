import assert from "node:assert/strict";
import { test } from "node:test";
import { detectProject } from "../dist/detection/project.js";
import { discoverFiles } from "../dist/files/discovery.js";
import { withTempProject } from "./support.js";

function profileFor(files) {
  return withTempProject(files, (root) => detectProject(root, discoverFiles(root).files));
}

function packageJson(overrides = {}) {
  return JSON.stringify({ name: "fixture", version: "1.0.0", ...overrides }, null, 2);
}

test("detects TypeScript and JavaScript from real files and config", () => {
  const profile = profileFor({
    "package.json": packageJson(),
    "tsconfig.json": "{}",
    "src/index.ts": "export {};",
    "src/legacy.js": "module.exports = {};",
  });
  assert.deepEqual(profile.languages, ["javascript", "typescript"]);
  assert.equal(profile.hasTypeScript, true);
  assert.equal(profile.projectName, "fixture");
});

test("detects several frameworks from dependencies", () => {
  const profile = profileFor({
    "package.json": packageJson({
      dependencies: { next: "^15.0.0", react: "^19.0.0", express: "^4.0.0" },
      devDependencies: { vite: "^6.0.0", typescript: "^5.0.0" },
      engines: { node: ">=20" },
    }),
    "next.config.ts": "export default {};",
    "src/app/page.tsx": "export default function Page() { return null; }",
  });
  assert.deepEqual(profile.frameworks, ["nextjs", "react", "vite", "express", "nodejs"]);
  assert.equal(profile.runtime, "node");
});

test("does not infer a framework from configuration alone", () => {
  const profile = profileFor({
    "package.json": packageJson(),
    "next.config.js": "module.exports = {};",
    "vite.config.ts": "export default {};",
  });
  assert.equal(profile.frameworks.includes("nextjs"), false);
  assert.equal(profile.frameworks.includes("vite"), false);
});

test("detects Vue and Angular from package dependencies", () => {
  const profile = profileFor({
    "package.json": packageJson({
      dependencies: { vue: "^3.0.0" },
      devDependencies: { "@angular/core": "^18.0.0" },
    }),
  });
  assert.ok(profile.frameworks.includes("vue"));
  assert.ok(profile.frameworks.includes("angular"));
});

test("detects npm, pnpm, yarn and bun from lockfiles", () => {
  const cases = [
    ["package-lock.json", "npm"],
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lockb", "bun"],
    ["bun.lock", "bun"],
  ];
  for (const [lockfile, expected] of cases) {
    const profile = profileFor({ "package.json": packageJson(), [lockfile]: "" });
    assert.equal(profile.packageManager, expected, lockfile);
    assert.deepEqual(profile.packageManagerEvidence.lockfiles, [lockfile]);
  }
});

test("uses packageManager metadata when no lockfile exists", () => {
  const profile = profileFor({
    "package.json": packageJson({ packageManager: "pnpm@9.1.0" }),
  });
  assert.equal(profile.packageManager, "pnpm");
  assert.equal(profile.packageManagerEvidence.declared, "pnpm");
});

test("conflicting lockfiles are explicit and never guessed", () => {
  const profile = profileFor({
    "package.json": packageJson({ packageManager: "npm@10.0.0" }),
    "package-lock.json": "{}",
    "pnpm-lock.yaml": "",
  });
  assert.equal(profile.packageManager, null);
  assert.deepEqual(profile.packageManagerEvidence.conflicts, ["npm", "pnpm"]);
  assert.equal(profile.packageManagerEvidence.declared, "npm");
});

test("detects configuration files and git state", () => {
  const profile = profileFor({
    "package.json": packageJson(),
    "tsconfig.json": "{}",
    ".gitignore": "node_modules/\n",
    ".env": "SECRET=placeholder\n",
    ".env.example": "SECRET=\n",
    "vite.config.ts": "export default {};",
    "vitest.config.ts": "export default {};",
    ".git/HEAD": "ref: refs/heads/main\n",
  });
  for (const file of [
    "package.json",
    "tsconfig.json",
    ".gitignore",
    ".env",
    ".env.example",
    "vite.config.ts",
    "vitest.config.ts",
  ]) {
    assert.ok(profile.configurationFiles.includes(file), file);
  }
  assert.equal(profile.hasGit, true);
});

test("an unsupported structure produces an empty profile rather than a guess", () => {
  const profile = profileFor({ "notes.txt": "hello" });
  assert.deepEqual(profile.languages, []);
  assert.deepEqual(profile.frameworks, []);
  assert.equal(profile.packageManager, null);
  assert.equal(profile.runtime, "unknown");
});
