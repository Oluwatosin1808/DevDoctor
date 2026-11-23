import type { Confidence, Finding, MetadataValue, Severity } from "./types.js";
import { toPosix } from "./utils/fs.js";
import { redactSensitiveText } from "./utils/redact.js";

export interface FindingInput {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  checkId: string;
  file?: string;
  line?: number;
  recommendation?: string;
  documentationUrl?: string;
  confidence?: Confidence;
  metadata?: Record<string, MetadataValue>;
}

/**
 * The only way checks create findings. It normalises paths, applies a redaction
 * pass to free text, and keeps metadata JSON-safe and small.
 */
export function makeFinding(input: FindingInput): Finding {
  const finding: Finding = {
    id: input.id,
    title: redactSensitiveText(input.title),
    description: redactSensitiveText(input.description),
    severity: input.severity,
    category: input.category,
    checkId: input.checkId,
  };

  if (input.file !== undefined && input.file !== "") {
    finding.file = toPosix(input.file).replace(/^\/+/, "");
  }
  if (input.line !== undefined && Number.isInteger(input.line) && input.line > 0) {
    finding.line = input.line;
  }
  if (input.recommendation !== undefined && input.recommendation !== "") {
    finding.recommendation = redactSensitiveText(input.recommendation);
  }
  if (input.documentationUrl !== undefined && input.documentationUrl !== "") {
    finding.documentationUrl = input.documentationUrl;
  }
  if (input.confidence !== undefined) finding.confidence = input.confidence;

  if (input.metadata !== undefined) {
    const metadata: Record<string, MetadataValue> = {};
    for (const [key, value] of Object.entries(input.metadata)) {
      if (typeof value === "string") {
        metadata[key] = redactSensitiveText(value).slice(0, 500);
      } else if (
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        metadata[key] = value;
      }
    }
    if (Object.keys(metadata).length > 0) finding.metadata = metadata;
  }

  return finding;
}

/** Severity used to decide whether a check passed, warned or failed. */
export function severityRank(severity: Severity): number {
  switch (severity) {
    case "critical":
      return 5;
    case "high":
      return 4;
    case "medium":
      return 3;
    case "low":
      return 2;
    case "info":
      return 1;
  }
}
