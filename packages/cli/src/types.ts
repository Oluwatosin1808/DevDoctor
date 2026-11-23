/** Shared, serialisable types used by detection, checks, the engine and reporters. */

export const LANGUAGES = ["javascript", "typescript"] as const;
export type Language = (typeof LANGUAGES)[number];

export const FRAMEWORKS = [
  "react",
  "nextjs",
  "vue",
  "angular",
  "vite",
  "express",
  "nodejs",
] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const RUNTIMES = ["node", "browser", "unknown"] as const;
export type Runtime = (typeof RUNTIMES)[number];

export const SEVERITIES = ["critical", "high", "medium", "low", "info"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const CHECK_STATUSES = [
  "passed",
  "warning",
  "failed",
  "skipped",
  "error",
] as const;
export type CheckStatus = (typeof CHECK_STATUSES)[number];

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

/** Open set: new checks may introduce their own categories without changing core code. */
export type CheckCategory = string;

/** JSON-safe metadata attached to a finding. Never holds file contents or secrets. */
export type MetadataValue = string | number | boolean | null;

export interface Finding {
  /** Stable identifier, unique across all registered checks. */
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: CheckCategory;
  /** ID of the check that produced this finding, for traceability in JSON output. */
  checkId: string;
  /** Project-relative POSIX path, never an absolute host path. */
  file?: string;
  line?: number;
  recommendation?: string;
  documentationUrl?: string;
  /** Certainty of the diagnosis, not seriousness of the issue. */
  confidence?: Confidence;
  metadata?: Record<string, MetadataValue>;
}

export interface CheckResult {
  id: string;
  name: string;
  status: CheckStatus;
  findings: Finding[];
  durationMs: number;
  error?: { message: string; stack?: string };
}

export type ReadReason = "missing" | "unreadable" | "too-large" | "invalid-json" | null;

export interface ReadResult<T> {
  ok: boolean;
  value: T | null;
  reason: ReadReason;
  message?: string;
}

export interface CheckContext {
  rootPath: string;
  profile: ProjectProfile;
  /** Project-relative POSIX paths from safe discovery. */
  files: readonly string[];
  /** Enables stack traces in check error results. */
  verbose: boolean;
  has(relativePath: string): boolean;
  readText(relativePath: string): ReadResult<string>;
  readJson<T = unknown>(relativePath: string): ReadResult<T>;
  /** Git-tracked, repository-relative POSIX paths, or null if git is unavailable. */
  trackedFiles(): string[] | null;
}

export interface DiagnosticCheck {
  id: string;
  name: string;
  description: string;
  category: CheckCategory;
  /** Severity used when this check reports a problem. */
  defaultSeverity: Severity;
  /** Return false when the check does not apply to this project. */
  applies?(context: CheckContext): boolean;
  /** Must return structured findings; throw only when the check cannot complete. */
  execute(context: CheckContext): Finding[];
}

export interface PackageManagerEvidence {
  /** Root-relative lockfile paths discovered in the project. */
  lockfiles: string[];
  /** Value of package.json#packageManager, if present and recognised. */
  declared: PackageManager | null;
  /** More than one manager means no silent guess is made. */
  conflicts: PackageManager[];
}

export interface ProjectProfile {
  rootPath: string;
  projectName: string;
  languages: Language[];
  frameworks: Framework[];
  /** null when evidence is absent or conflicting. */
  packageManager: PackageManager | null;
  packageManagerEvidence: PackageManagerEvidence;
  runtime: Runtime;
  hasTypeScript: boolean;
  hasGit: boolean;
  /** Project-relative POSIX paths of recognised configuration files. */
  configurationFiles: string[];
  detectedAt: string;
}

export interface DiscoverySummary {
  files: number;
  ignored: number;
  truncated: boolean;
}

export type OverallStatus = "passed" | "warning" | "failed" | "error";

export interface ScanReport {
  tool: "cdoc";
  schemaVersion: 1;
  scanId: string;
  target: string;
  project: ProjectProfile;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  status: OverallStatus;
  discovery: DiscoverySummary;
  totals: {
    checks: number;
    passed: number;
    warning: number;
    failed: number;
    skipped: number;
    error: number;
    findings: number;
  };
  checks: CheckResult[];
  findingsBySeverity: Record<Severity, Finding[]>;
  findingsByCategory: Record<CheckCategory, Finding[]>;
}
