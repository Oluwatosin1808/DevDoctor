import { makeFinding } from "../findings.js";
import type { DiagnosticCheck, Finding } from "../types.js";

const CHECK_ID = "project-configuration";

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function formatReason(reason: string | null, message: string | undefined): string {
  if (reason === "invalid-json") return `invalid JSON (${message ?? "parse error"})`;
  if (reason === "too-large") return "the file exceeds the size limit";
  if (reason === "unreadable") return "the file could not be read";
  return message ?? "unknown error";
}

export const projectCheck: DiagnosticCheck = {
  id: CHECK_ID,
  name: "Project configuration",
  description: "Checks essential JavaScript/TypeScript project metadata and configuration.",
  category: "project",
  defaultSeverity: "medium",

  applies(context) {
    return context.profile.languages.length > 0 || context.has("package.json");
  },

  execute(context): Finding[] {
    const findings: Finding[] = [];
    const pkg = context.readJson<Record<string, unknown>>("package.json");
    const languages = context.profile.languages;

    if (!pkg.ok || !isObject(pkg.value)) {
      if (pkg.reason !== "missing" || languages.length > 0) {
        findings.push(
          makeFinding({
            id: "project/package-json-invalid",
            title: "package.json is missing or unreadable",
            description:
              pkg.reason === "missing"
                ? "No package.json was found in a project with JavaScript or TypeScript files."
                : `package.json could not be parsed: ${formatReason(pkg.reason, pkg.message)}.`,
            severity: "high",
            category: "project",
            checkId: CHECK_ID,
            file: "package.json",
            recommendation: "Create or repair package.json so tooling can identify the project.",
            confidence: "high",
          }),
        );
      }
      return findings;
    }

    findings.push(
      makeFinding({
        id: "project/package-json-present",
        title: "package.json is present and parses",
        description: "Essential project metadata is readable.",
        severity: "info",
        category: "project",
        checkId: CHECK_ID,
        file: "package.json",
        confidence: "high",
        metadata: { fields: Object.keys(pkg.value).length },
      }),
    );

    const scripts = isObject(pkg.value.scripts) ? pkg.value.scripts : {};
    if (languages.length > 0 && Object.keys(scripts).length === 0) {
      findings.push(
        makeFinding({
          id: "project/no-scripts",
          title: "No npm scripts are defined",
          description: "package.json declares no scripts, so common tasks are undocumented.",
          severity: "low",
          category: "project",
          checkId: CHECK_ID,
          file: "package.json",
          recommendation: "Add at least a test or build script that collaborators and CI can run.",
          confidence: "medium",
        }),
      );
    }

    if (context.profile.hasTypeScript) {
      const hasTsconfig = context.files.some((file) => {
        const name = file.split("/").pop() ?? file;
        return name === "tsconfig.json" || name.startsWith("tsconfig.");
      });
      if (!hasTsconfig) {
        findings.push(
          makeFinding({
            id: "project/typescript-without-tsconfig",
            title: "TypeScript sources without a tsconfig.json",
            description: "TypeScript files were found but no TypeScript configuration was discovered.",
            severity: "medium",
            category: "project",
            checkId: CHECK_ID,
            recommendation: "Add a tsconfig.json so compiler options are explicit.",
            confidence: "medium",
          }),
        );
      }
    }

    const tsconfig = context.readJson<Record<string, unknown>>("tsconfig.json");
    if (!tsconfig.ok && tsconfig.reason === "invalid-json") {
      findings.push(
        makeFinding({
          id: "project/tsconfig-invalid",
          title: "tsconfig.json is not valid JSON",
          description: `TypeScript configuration could not be parsed: ${formatReason(tsconfig.reason, tsconfig.message)}.`,
          severity: "medium",
          category: "project",
          checkId: CHECK_ID,
          file: "tsconfig.json",
          recommendation: "Correct the JSON syntax in tsconfig.json.",
          confidence: "high",
        }),
      );
    }

    if (context.profile.runtime === "node" && !isObject(pkg.value.engines)) {
      findings.push(
        makeFinding({
          id: "project/node-version-unspecified",
          title: "Supported Node.js version is not declared",
          description: "The project uses Node.js but does not constrain engines.node.",
          severity: "low",
          category: "project",
          checkId: CHECK_ID,
          file: "package.json",
          recommendation: "Declare engines.node to document the supported runtime.",
          confidence: "medium",
        }),
      );
    }

    const conflicts = context.profile.packageManagerEvidence.conflicts;
    if (conflicts.length > 1) {
      findings.push(
        makeFinding({
          id: "project/package-manager-conflict",
          title: "Multiple package manager lockfiles detected",
          description:
            "Lockfiles for different package managers exist, so the active manager cannot be inferred safely.",
          severity: "high",
          category: "project",
          checkId: CHECK_ID,
          file: context.profile.packageManagerEvidence.lockfiles[0],
          recommendation: "Remove unused lockfiles and keep one reproducible install source.",
          confidence: "high",
          metadata: { packageManagers: conflicts.join(", ") },
        }),
      );
    }

    return findings;
  },
};
