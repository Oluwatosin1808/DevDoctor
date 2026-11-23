import { makeFinding, severityRank } from "../findings.js";
import { toErrorStack, toErrorMessage } from "../errors.js";
import type {
  CheckContext,
  CheckResult,
  CheckStatus,
  DiagnosticCheck,
  Finding,
} from "../types.js";
import type { CheckRegistry } from "./registry.js";

/** A check with no findings ran successfully. Info-only findings are also non-issues. */
export function statusFromFindings(findings: readonly Finding[]): CheckStatus {
  if (findings.length === 0) return "passed";
  const highest = findings.reduce(
    (rank, finding) => Math.max(rank, severityRank(finding.severity)),
    0,
  );
  if (severityRank("critical") <= highest) return "failed";
  if (severityRank("high") <= highest) return "failed";
  if (severityRank("low") <= highest) return "warning";
  return "passed";
}

function skippedResult(check: DiagnosticCheck, durationMs: number): CheckResult {
  return {
    id: check.id,
    name: check.name,
    status: "skipped",
    durationMs,
    findings: [
      makeFinding({
        id: `${check.id}/skipped`,
        title: "Check skipped",
        description: "This check is not applicable to the detected project.",
        severity: "info",
        category: check.category,
        checkId: check.id,
        confidence: "high",
      }),
    ],
  };
}

/** Execute each registered check in isolation; one failure never stops the scan. */
export function runChecks(context: CheckContext, registry: CheckRegistry): CheckResult[] {
  return registry.all().map((check) => {
    const startedAt = Date.now();
    const durationMs = () => Math.max(0, Date.now() - startedAt);

    if (check.applies !== undefined && !check.applies(context)) {
      return skippedResult(check, durationMs());
    }

    try {
      const findings = check.execute(context);
      return {
        id: check.id,
        name: check.name,
        status: statusFromFindings(findings),
        findings,
        durationMs: durationMs(),
      };
    } catch (error) {
      const message = toErrorMessage(error);
      const stack = toErrorStack(error);
      return {
        id: check.id,
        name: check.name,
        status: "error",
        durationMs: durationMs(),
        findings: [
          makeFinding({
            id: `${check.id}/execution-error`,
            title: "Check could not complete",
            description: message,
            severity: "high",
            category: check.category,
            checkId: check.id,
            recommendation: "Re-run with --verbose for diagnostic details.",
            confidence: "high",
          }),
        ],
        error: {
          message,
          ...(context.verbose && stack !== undefined ? { stack } : {}),
        },
      };
    }
  });
}
