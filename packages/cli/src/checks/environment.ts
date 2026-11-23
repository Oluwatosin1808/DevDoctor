import { makeFinding } from "../findings.js";
import type { DiagnosticCheck, Finding } from "../types.js";
import { isIgnored, parseGitignore } from "../utils/gitignore.js";

const CHECK_ID = "environment";
const EXAMPLES = new Set([
  ".env.example",
  ".env.sample",
  ".env.template",
  ".env.example.local",
]);

function classify(path: string): "local" | "example" | null {
  const name = path.split("/").pop() ?? path;
  if (EXAMPLES.has(name)) return "example";
  if (name === ".env" || name.startsWith(".env.")) return "local";
  return null;
}

/** Never reads environment file contents — only discovery metadata and git state. */
export const environmentCheck: DiagnosticCheck = {
  id: CHECK_ID,
  name: "Environment files",
  description: "Checks that local environment files stay local and are documented.",
  category: "environment",
  defaultSeverity: "medium",

  execute(context): Finding[] {
    const findings: Finding[] = [];
    const local = context.files.filter((path) => classify(path) === "local");
    const examples = context.files.filter((path) => classify(path) === "example");

    if (local.length === 0) return findings;

    if (examples.length === 0) {
      findings.push(
        makeFinding({
          id: "environment/no-example",
          title: "Local environment files have no example",
          description: `${local.length} local environment file(s) exist but no committable example documents them.`,
          severity: "low",
          category: "environment",
          checkId: CHECK_ID,
          file: local[0],
          recommendation: "Add a .env.example with placeholder keys and no real values.",
          confidence: "medium",
        }),
      );
    }

    const ignoreText = context.readText(".gitignore");
    if (ignoreText.ok && ignoreText.value !== null) {
      const rules = parseGitignore(ignoreText.value);
      const exposed = local.filter((path) => !isIgnored(path, false, rules));
      if (exposed.length > 0) {
        findings.push(
          makeFinding({
            id: "environment/not-ignored",
            title: "Environment files are not ignored by Git",
            description: `${exposed.length} local environment file(s) are not covered by .gitignore.`,
            severity: "medium",
            category: "environment",
            checkId: CHECK_ID,
            file: exposed[0],
            recommendation: "Add a .env rule (or .env*) before committing these files.",
            confidence: "high",
          }),
        );
      }
    }

    const tracked = context.trackedFiles();
    if (tracked !== null) {
      const trackedSet = new Set(tracked);
      const committed = local.filter((path) => trackedSet.has(path));
      if (committed.length > 0) {
        findings.push(
          makeFinding({
            id: "environment/tracked",
            title: "A local environment file is tracked by Git",
            description: `${committed.length} local environment file(s) are tracked. Their contents must be treated as exposed.`,
            severity: "high",
            category: "environment",
            checkId: CHECK_ID,
            file: committed[0],
            recommendation: "Untrack the file, rotate anything it contained, and commit an example instead.",
            confidence: "high",
          }),
        );
      }
    }

    return findings;
  },
};
