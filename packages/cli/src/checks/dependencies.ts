import { makeFinding } from "../findings.js";
import type { DiagnosticCheck, Finding } from "../types.js";

const CHECK_ID = "dependencies";
const DEPENDENCY_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
] as const;
const UNPINNED = new Set(["*", "latest", "x", "X", ""]);

function asObject(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export const dependenciesCheck: DiagnosticCheck = {
  id: CHECK_ID,
  name: "Dependencies",
  description: "Checks reproducible installs and explicit dependency ranges.",
  category: "dependencies",
  defaultSeverity: "low",

  applies(context) {
    // Conflicting lockfiles are reported by the project check; do not guess here.
    return (
      (context.profile.languages.length > 0 || context.has("package.json")) &&
      context.profile.packageManagerEvidence.conflicts.length === 0
    );
  },

  execute(context): Finding[] {
    const findings: Finding[] = [];
    const lockfiles = context.profile.packageManagerEvidence.lockfiles;

    if (lockfiles.length > 0) {
      findings.push(
        makeFinding({
          id: "dependencies/lockfile-present",
          title: "A lockfile is present",
          description: `Found ${lockfiles.join(", ")}.`,
          severity: "info",
          category: "dependencies",
          checkId: CHECK_ID,
          file: lockfiles[0],
          confidence: "high",
        }),
      );
    } else {
      findings.push(
        makeFinding({
          id: "dependencies/no-lockfile",
          title: "No lockfile found",
          description: "Installs cannot be reproduced from a committed lockfile.",
          severity: "low",
          category: "dependencies",
          checkId: CHECK_ID,
          recommendation: "Commit the lockfile produced by the detected package manager.",
          confidence: "medium",
        }),
      );
    }

    const pkg = context.readJson<Record<string, unknown>>("package.json");
    if (!pkg.ok || pkg.value === null) return findings;

    const data = asObject(pkg.value);
    const entries = new Map<string, string>();
    for (const field of DEPENDENCY_FIELDS) {
      for (const [name, range] of Object.entries(asObject(data[field]))) {
        entries.set(name, typeof range === "string" ? range : String(range));
      }
    }

    if (entries.size === 0) {
      findings.push(
        makeFinding({
          id: "dependencies/none-declared",
          title: "No dependencies are declared",
          description: "package.json contains no dependency entries to inspect.",
          severity: "info",
          category: "dependencies",
          checkId: CHECK_ID,
          confidence: "high",
        }),
      );
      return findings;
    }

    const unpinned = [...entries.entries()]
      .filter(([, range]) => UNPINNED.has(range.trim()))
      .map(([name]) => name);
    if (unpinned.length > 0) {
      findings.push(
        makeFinding({
          id: "dependencies/unpinned-ranges",
          title: "Dependency ranges pin no version",
          description: `${unpinned.length} dependency range(s) use a wildcard or "latest".`,
          severity: "low",
          category: "dependencies",
          checkId: CHECK_ID,
          file: "package.json",
          recommendation: "Use explicit version ranges so installs are predictable.",
          confidence: "high",
          metadata: { packages: unpinned.slice(0, 10).join(", ") },
        }),
      );
    }

    const dependencies = asObject(data.dependencies);
    const devDependencies = asObject(data.devDependencies);
    const duplicated = Object.keys(dependencies).filter((name) => name in devDependencies);
    if (duplicated.length > 0) {
      findings.push(
        makeFinding({
          id: "dependencies/duplicated",
          title: "Dependencies are declared twice",
          description: `${duplicated.length} package(s) appear in both dependencies and devDependencies.`,
          severity: "low",
          category: "dependencies",
          checkId: CHECK_ID,
          file: "package.json",
          recommendation: "Keep each dependency in a single section.",
          confidence: "high",
          metadata: { packages: duplicated.slice(0, 10).join(", ") },
        }),
      );
    }

    return findings;
  },
};
