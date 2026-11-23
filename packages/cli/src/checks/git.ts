import { makeFinding } from "../findings.js";
import type { DiagnosticCheck, Finding } from "../types.js";
import { globToRegExp, parseGitignore, type IgnoreRule } from "../utils/gitignore.js";

const CHECK_ID = "git-configuration";
const GENERATED_PATHS = ["node_modules", ".env", "dist", "build", ".next", "coverage"];

/**
 * Coverage question, not exact-path matching: a nested rule such as
 * `apps/web/.next/` still demonstrates that a directory name is ignored.
 */
function hasIgnoreCoverage(name: string, rules: readonly IgnoreRule[]): boolean {
  const directoryRule = name !== ".env";
  let covered = false;
  for (const rule of rules) {
    if (rule.directoryOnly !== directoryRule) continue;
    const segments = rule.pattern.split("/");
    const last = segments[segments.length - 1] ?? "";
    if (last !== "" && globToRegExp(last).test(name)) covered = !rule.negated;
  }
  return covered;
}

export const gitCheck: DiagnosticCheck = {
  id: CHECK_ID,
  name: "Git configuration",
  description: "Checks repository presence and whether common generated paths are ignored.",
  category: "git",
  defaultSeverity: "medium",

  execute(context): Finding[] {
    const findings: Finding[] = [];

    if (!context.profile.hasGit) {
      findings.push(
        makeFinding({
          id: "git/no-repository",
          title: "No Git repository detected",
          description: "No .git entry was found at the project root.",
          severity: "medium",
          category: "git",
          checkId: CHECK_ID,
          recommendation: "Initialise Git if this project is intended to be version controlled.",
          confidence: "high",
        }),
      );
    }

    const ignoreFile = context.readText(".gitignore");
    if (!ignoreFile.ok || ignoreFile.value === null) {
      findings.push(
        makeFinding({
          id: "git/no-gitignore",
          title: ".gitignore is missing or unreadable",
          description:
            ignoreFile.reason === "missing"
              ? "No .gitignore file was found at the project root."
              : `.gitignore could not be read (${ignoreFile.reason ?? "unknown error"}).`,
          severity: "medium",
          category: "git",
          checkId: CHECK_ID,
          file: ".gitignore",
          recommendation: "Add a .gitignore that excludes dependencies, secrets and build output.",
          confidence: "high",
        }),
      );
      return findings;
    }

    const rules = parseGitignore(ignoreFile.value);
    const missing = GENERATED_PATHS.filter((entry) => !hasIgnoreCoverage(entry, rules));

    if (missing.length > 0) {
      findings.push(
        makeFinding({
          id: "git/missing-ignore-rules",
          title: "Common generated paths are not ignored",
          description: `.gitignore does not cover: ${missing.join(", ")}.`,
          severity: missing.includes(".env") ? "medium" : "low",
          category: "git",
          checkId: CHECK_ID,
          file: ".gitignore",
          recommendation: "Add ignore rules for generated directories and local environment files.",
          confidence: "high",
          metadata: { paths: missing.join(", ") },
        }),
      );
    }

    const tracked = context.trackedFiles();
    if (tracked !== null) {
      const leaked = tracked
        .filter((path) => GENERATED_PATHS.some((entry) => path.split("/").includes(entry)))
        .slice(0, 5);
      if (leaked.length > 0) {
        findings.push(
          makeFinding({
            id: "git/generated-files-tracked",
            title: "Generated files are tracked by Git",
            description: `Git reports tracked paths inside generated directories: ${leaked.join(", ")}.`,
            severity: "medium",
            category: "git",
            checkId: CHECK_ID,
            recommendation: "Remove these paths from the index and add matching .gitignore rules.",
            confidence: "high",
            metadata: { count: leaked.length, paths: leaked.join(", ") },
          }),
        );
      }
    }

    return findings;
  },
};
