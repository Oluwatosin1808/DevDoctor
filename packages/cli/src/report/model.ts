import {
  CHECK_STATUSES,
  SEVERITIES,
  type CheckResult,
  type DiscoverySummary,
  type Finding,
  type OverallStatus,
  type ProjectProfile,
  type ScanReport,
  type Severity,
} from "../types.js";

interface BuildReportInput {
  scanId: string;
  target: string;
  project: ProjectProfile;
  startedAt: Date;
  finishedAt: Date;
  discovery: DiscoverySummary;
  checks: CheckResult[];
}

function groupsBySeverity(findings: readonly Finding[]): Record<Severity, Finding[]> {
  const groups: Record<Severity, Finding[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
    info: [],
  };
  for (const finding of findings) groups[finding.severity]?.push(finding);
  return groups;
}

function groupsByCategory(findings: readonly Finding[]): Record<string, Finding[]> {
  const groups: Record<string, Finding[]> = {};
  for (const finding of findings) {
    const bucket = groups[finding.category] ?? [];
    bucket.push(finding);
    groups[finding.category] = bucket;
  }
  return Object.fromEntries(
    Object.entries(groups).sort(([left], [right]) => left.localeCompare(right)),
  );
}

export function overallStatus(checks: readonly CheckResult[]): OverallStatus {
  if (checks.some((check) => check.status === "error")) return "error";
  if (checks.some((check) => check.status === "failed")) return "failed";
  if (checks.some((check) => check.status === "warning")) return "warning";
  return "passed";
}

/** Counts are derived from check results, never from a score or heuristic. */
export function buildReport(input: BuildReportInput): ScanReport {
  const findings = input.checks.flatMap((check) => check.findings);
  const countStatus = (status: (typeof CHECK_STATUSES)[number]): number =>
    input.checks.filter((check) => check.status === status).length;

  return {
    tool: "cdoc",
    schemaVersion: 1,
    scanId: input.scanId,
    target: input.target,
    project: input.project,
    startedAt: input.startedAt.toISOString(),
    finishedAt: input.finishedAt.toISOString(),
    durationMs: Math.max(0, input.finishedAt.getTime() - input.startedAt.getTime()),
    status: overallStatus(input.checks),
    discovery: input.discovery,
    totals: {
      checks: input.checks.length,
      passed: countStatus("passed"),
      warning: countStatus("warning"),
      failed: countStatus("failed"),
      skipped: countStatus("skipped"),
      error: countStatus("error"),
      findings: findings.length,
    },
    checks: input.checks,
    findingsBySeverity: groupsBySeverity(findings),
    findingsByCategory: groupsByCategory(findings),
  };
}
