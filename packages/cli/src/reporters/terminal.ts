import { SEVERITIES, type CheckResult, type Finding, type ScanReport } from "../types.js";
import type { Paint } from "../utils/colors.js";

const CHECK_MARK: Record<CheckResult["status"], string> = {
  passed: "✓",
  warning: "!",
  failed: "✗",
  skipped: "–",
  error: "E",
};

function list(values: readonly string[]): string {
  return values.length > 0 ? values.join(", ") : "not detected";
}

function severityLine(paint: Paint, severity: string): string {
  switch (severity) {
    case "critical":
    case "high":
      return paint("red", `[${severity}]`);
    case "medium":
      return paint("yellow", `[${severity}]`);
    case "low":
      return paint("dim", `[${severity}]`);
    default:
      return paint("cyan", "[info]");
  }
}

function nextSteps(report: ScanReport): string[] {
  const steps: string[] = [];
  const seen = new Set<string>();
  for (const severity of SEVERITIES) {
    for (const finding of report.findingsBySeverity[severity]) {
      const recommendation = finding.recommendation;
      if (recommendation === undefined || seen.has(recommendation)) continue;
      seen.add(recommendation);
      steps.push(recommendation);
      if (steps.length === 5) return steps;
    }
  }
  return steps;
}

function renderFinding(paint: Paint, finding: Finding): string[] {
  const lines: string[] = [];
  const location =
    finding.file !== undefined
      ? `  ${paint("dim", `${finding.checkId} · ${finding.file}${finding.line !== undefined ? `:${finding.line}` : ""}`)}`
      : `  ${paint("dim", finding.checkId)}`;
  lines.push(`  ${severityLine(paint, finding.severity)} ${finding.title}`);
  lines.push(location);
  return lines;
}

/** Human-readable report built exclusively from values in the scan report. */
export function formatTerminal(report: ScanReport, paint: Paint, heading = "cDoc scan"): string {
  const lines: string[] = [];
  const totals = report.totals;

  lines.push(paint("bold", `${heading} — local-first project diagnostics`));
  lines.push("");
  lines.push(paint("bold", "Project"));
  lines.push(`  Name        ${report.project.projectName}`);
  lines.push(`  Target      ${report.target}`);
  lines.push(`  Frameworks  ${list(report.project.frameworks)}`);
  lines.push(`  Languages   ${list(report.project.languages)}`);
  lines.push(`  Runtime     ${report.project.runtime}`);
  lines.push(
    `  Package mgr ${report.project.packageManager ?? (report.project.packageManagerEvidence.conflicts.length > 0 ? "conflicting lockfiles" : "not detected")}`,
  );

  lines.push("");
  lines.push(paint("bold", "Progress"));
  lines.push(`  ✓ Target validated`);
  lines.push(
    `  ✓ ${report.discovery.files} file(s) discovered, ${report.discovery.ignored} skipped${report.discovery.truncated ? " (limit reached)" : ""}`,
  );
  lines.push(`  ✓ Profile detected at ${report.project.detectedAt}`);
  lines.push(`  ✓ ${totals.checks} check(s) executed in ${report.durationMs} ms`);

  lines.push("");
  lines.push(paint("bold", "Checks"));
  for (const check of report.checks) {
    const mark = paint(
      check.status === "failed" || check.status === "error"
        ? "red"
        : check.status === "warning"
          ? "yellow"
          : "dim",
      CHECK_MARK[check.status],
    );
    lines.push(`  ${mark} ${check.name} — ${check.status} (${check.findings.length} finding(s))`);
  }

  const actionable = SEVERITIES.flatMap((severity) => report.findingsBySeverity[severity]);
  lines.push("");
  lines.push(paint("bold", "Findings by severity"));
  if (actionable.length === 0) {
    lines.push("  No findings were reported.");
  } else {
    for (const severity of SEVERITIES) {
      const findings = report.findingsBySeverity[severity];
      if (findings.length === 0) continue;
      lines.push(`  ${severity.toUpperCase()} (${findings.length})`);
      for (const finding of findings) lines.push(...renderFinding(paint, finding));
    }
  }

  lines.push("");
  lines.push(paint("bold", "Recommended next steps"));
  const steps = nextSteps(report);
  if (steps.length === 0) {
    lines.push("  No actionable findings were reported.");
  } else {
    steps.forEach((step, index) => lines.push(`  ${index + 1}. ${step}`));
  }

  lines.push("");
  lines.push(paint("bold", "Summary"));
  lines.push(
    `  ${totals.checks} checks · ${totals.passed} passed · ${totals.warning} warning · ${totals.failed} failed · ${totals.skipped} skipped · ${totals.error} error`,
  );
  lines.push(`  Status: ${paint(report.status === "passed" ? "green" : "yellow", report.status)}`);
  lines.push(paint("dim", `  Scan ${report.scanId}`));

  return lines.join("\n");
}
