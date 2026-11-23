import { join } from "node:path";
import { LANGUAGES } from "../types.js";
import type {
  Framework,
  Language,
  PackageManager,
  ProjectProfile,
  Runtime,
} from "../types.js";
import { exists, readJsonFile, toPosix } from "../utils/fs.js";

type PackageJson = Record<string, unknown>;

const LOCKFILE_MANAGERS: Readonly<Record<string, PackageManager>> = {
  "package-lock.json": "npm",
  "npm-shrinkwrap.json": "npm",
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "bun.lockb": "bun",
  "bun.lock": "bun",
};

const BUILD_CONFIG = [
  "vite.config",
  "next.config",
  "webpack.config",
  "rollup.config",
  "esbuild.config",
  "babel.config",
  "vue.config",
  "angular.json",
  ".babelrc",
  ".parcelrc",
];

const TEST_CONFIG = [
  "jest.config",
  "vitest.config",
  "playwright.config",
  "cypress.config",
  "karma.conf",
  ".mocharc",
  "ava.config",
];

const LANGUAGE_EXTENSIONS: Readonly<Record<string, Language>> = {
  ".js": "javascript",
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".mts": "typescript",
  ".cts": "typescript",
};

function extensionOf(path: string): string {
  const base = path.split("/").pop() ?? path;
  const dot = base.lastIndexOf(".");
  return dot <= 0 ? "" : base.slice(dot).toLowerCase();
}

function baseName(path: string): string {
  return path.split("/").pop() ?? path;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function dependencyNames(pkg: PackageJson): Set<string> {
  const names = new Set<string>();
  for (const field of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    const group = asRecord(pkg[field]);
    for (const name of Object.keys(group)) names.add(name);
  }
  return names;
}

function scriptText(pkg: PackageJson): string {
  return Object.values(asRecord(pkg.scripts))
    .filter((value): value is string => typeof value === "string")
    .join("\n");
}

function detectLanguages(files: readonly string[], pkg: PackageJson): Language[] {
  const detected = new Set<Language>();
  for (const file of files) {
    const language = LANGUAGE_EXTENSIONS[extensionOf(file)];
    if (language !== undefined) detected.add(language);
  }
  if (files.includes("tsconfig.json") || "typescript" in dependencyNames(pkg)) {
    detected.add("typescript");
  }
  if (files.includes("package.json")) detected.add("javascript");
  return LANGUAGES.filter((language) => detected.has(language));
}

function detectFrameworks(
  files: readonly string[],
  pkg: PackageJson,
): Framework[] {
  const dependencies = dependencyNames(pkg);
  const scripts = scriptText(pkg);
  const frameworks = new Set<Framework>();

  // Configuration files alone are never enough: require a dependency or a
  // package script that actually invokes the tool.
  if (dependencies.has("next") || /\bnext\s+(?:dev|build|start)\b/.test(scripts)) {
    frameworks.add("nextjs");
  }
  if (dependencies.has("react") || dependencies.has("react-dom")) {
    frameworks.add("react");
  }
  if (
    dependencies.has("vue") ||
    dependencies.has("nuxt") ||
    dependencies.has("@vue/cli-service")
  ) {
    frameworks.add("vue");
  }
  if ([...dependencies].some((name) => name.startsWith("@angular/"))) {
    frameworks.add("angular");
  }
  if (dependencies.has("vite") || /\bvite\b/.test(scripts)) {
    frameworks.add("vite");
  }
  if (dependencies.has("express")) frameworks.add("express");

  const engines = asRecord(pkg.engines);
  if (
    typeof engines.node === "string" ||
    /\bnode\b/.test(scripts) ||
    typeof pkg.main === "string" ||
    pkg.bin !== undefined
  ) {
    frameworks.add("nodejs");
  }

  return [...frameworks];
}

function detectPackageManager(
  rootFiles: readonly string[],
  pkg: PackageJson,
): {
  manager: PackageManager | null;
  evidence: ProjectProfile["packageManagerEvidence"];
} {
  const lockfiles = rootFiles.filter((file) => file in LOCKFILE_MANAGERS);
  const fromLocks = unique(
    lockfiles.map((file) => LOCKFILE_MANAGERS[file]).filter((value): value is PackageManager => value !== undefined),
  );

  const declaredValue = pkg.packageManager;
  const declaredName =
    typeof declaredValue === "string" ? declaredValue.split("@")[0] : undefined;
  const declared = (["npm", "pnpm", "yarn", "bun"] as const).find(
    (candidate) => candidate === declaredName,
  ) ?? null;

  const managers = unique(fromLocks);
  const conflicts = managers.length > 1 ? managers : [];
  const manager = conflicts.length > 0 ? null : (managers[0] ?? declared);

  return {
    manager,
    evidence: {
      lockfiles: [...lockfiles].sort(),
      declared,
      conflicts,
    },
  };
}

function detectRuntime(pkg: PackageJson, frameworks: readonly Framework[]): Runtime {
  const engines = asRecord(pkg.engines);
  if (frameworks.includes("nodejs") || typeof engines.node === "string") return "node";
  if (frameworks.some((framework) => framework !== "nodejs")) return "browser";
  return "unknown";
}

function detectConfigurationFiles(files: readonly string[]): string[] {
  const known = new Set([
    "package.json",
    "tsconfig.json",
    ".gitignore",
    ".gitattributes",
    ".env",
    ".env.example",
    ".env.sample",
  ]);

  for (const file of files) {
    const name = baseName(file);
    const stem = name.replace(/\.(js|cjs|mjs|ts|json|yaml|yml|config\.js)$/i, "");
    if (BUILD_CONFIG.some((prefix) => name.startsWith(prefix))) known.add(file);
    if (TEST_CONFIG.some((prefix) => name.startsWith(prefix))) known.add(file);
    if (stem === "tsconfig") known.add(file);
  }

  return files.filter((file) => known.has(file)).sort();
}

function projectName(root: string, pkg: PackageJson): string {
  if (typeof pkg.name === "string" && pkg.name !== "") return pkg.name;
  const segments = toPosix(root).split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "project";
}

/** Build a structured profile from safe discovery results and root-level config. */
export function detectProject(root: string, files: readonly string[]): ProjectProfile {
  const parsed = readJsonFile<PackageJson>(join(root, "package.json"));
  const pkg = parsed.ok && parsed.value !== null ? asRecord(parsed.value) : {};
  const packageManager = detectPackageManager(files, pkg);
  const frameworks = detectFrameworks(files, pkg);
  const languages = detectLanguages(files, pkg);

  return {
    rootPath: root,
    projectName: projectName(root, pkg),
    languages,
    frameworks,
    packageManager: packageManager.manager,
    packageManagerEvidence: packageManager.evidence,
    runtime: detectRuntime(pkg, frameworks),
    hasTypeScript: languages.includes("typescript"),
    hasGit: exists(join(root, ".git")),
    configurationFiles: detectConfigurationFiles(files),
    detectedAt: new Date().toISOString(),
  };
}
