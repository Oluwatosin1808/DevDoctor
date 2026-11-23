import { makeFinding } from "../findings.js";
import type { DiagnosticCheck, Finding } from "../types.js";
import { isBinaryPath } from "../utils/fs.js";

const CHECK_ID = "security-basics";
const MAX_FILES = 1500;

/** High-signal credential shapes. Only labels and file paths ever reach findings. */
const SECRET_PATTERNS = [
  { label: "private key block", re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/ },
  { label: "AWS access key id", re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { label: "GitHub token", re: /\b(?:gh[pousr]|github_pat)_[A-Za-z0-9_]{20,}\b/ },
  { label: "Slack token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { label: "npm token", re: /\bnpm_[A-Za-z0-9]{36}\b/ },
  { label: "Stripe live key", re: /\bsk_live_[0-9a-zA-Z]{24,}\b/ },
  { label: "Google API key", re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
] as const;

const RISKY_SCRIPT = /(?:curl|wget)\b[^|\n]*\|\s*(?:ba|z|k|da)?sh\b|\beval\s*\(/;

function isEnvironmentFile(path: string): boolean {
  const name = path.split("/").pop() ?? path;
  return name === ".env" || name.startsWith(".env.");
}

export const securityCheck: DiagnosticCheck = {
  id: CHECK_ID,
  name: "Security basics",
  description: "Looks for credential-shaped strings in safe, discoverable files.",
  category: "security",
  defaultSeverity: "high",

  execute(context): Finding[] {
    const findings: Finding[] = [];
    const discovered = new Set(context.files);
    const tracked = context.trackedFiles();
    const candidates = tracked === null
      ? [...context.files]
      : tracked.filter((path) => discovered.has(path));

    const hits = new Map<string, { label: string; files: Set<string> }>();
    let scanned = 0;

    for (const relativePath of candidates) {
      if (scanned >= MAX_FILES) break;
      if (isEnvironmentFile(relativePath) || isBinaryPath(relativePath)) continue;
      const text = context.readText(relativePath);
      if (!text.ok || text.value === null) continue;
      scanned += 1;

      for (const pattern of SECRET_PATTERNS) {
        if (pattern.re.test(text.value)) {
          const entry = hits.get(pattern.label) ?? { label: pattern.label, files: new Set<string>() };
          entry.files.add(relativePath);
          hits.set(pattern.label, entry);
        }
      }
    }

    if (hits.size === 0) {
      findings.push(
        makeFinding({
          id: "security/no-known-patterns",
          title: "No known credential patterns found",
          description: `Scanned ${scanned} safe text file(s).`,
          severity: "info",
          category: "security",
          checkId: CHECK_ID,
          confidence: "medium",
        }),
      );
    } else {
      for (const [label, entry] of hits) {
        const files = [...entry.files].sort().slice(0, 5);
        findings.push(
          makeFinding({
            id: `security/pattern-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
            title: `${label} detected`,
            description: `Credential-shaped content was found in ${entry.files.size} file(s). Values are never recorded.`,
            severity: "high",
            category: "security",
            checkId: CHECK_ID,
            file: files[0],
            recommendation: "Rotate the credential and remove it from the project before committing.",
            confidence: "medium",
            metadata: { matches: entry.files.size, files: files.join(", ") },
          }),
        );
      }
    }

    const pkg = context.readJson<{ scripts?: Record<string, unknown> }>("package.json");
    if (pkg.ok && pkg.value !== null) {
      const scripts = pkg.value.scripts ?? {};
      const risky = Object.entries(scripts).filter(
        ([, command]) => typeof command === "string" && RISKY_SCRIPT.test(command),
      );
      if (risky.length > 0) {
        findings.push(
          makeFinding({
            id: "security/risky-scripts",
            title: "Risky npm scripts",
            description: `${risky.length} script(s) pipe a download into a shell or call eval.`,
            severity: "medium",
            category: "security",
            checkId: CHECK_ID,
            file: "package.json",
            recommendation: "Review these scripts before running them and avoid unverified downloads.",
            confidence: "high",
            metadata: { scripts: risky.map(([name]) => name).slice(0, 10).join(", ") },
          }),
        );
      }
    }

    return findings;
  },
};
