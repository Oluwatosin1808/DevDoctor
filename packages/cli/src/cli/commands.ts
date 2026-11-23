import { readFileSync } from "node:fs";
import { createDefaultRegistry } from "../checks/index.js";
import {
  buildTelemetryPayload,
  readTelemetrySettings,
  sendTelemetry,
} from "../telemetry.js";
import { HELP, parseArgs, wantsJson, type ParsedArgs } from "./args.js";
import { CdocError, toErrorStack, toErrorMessage } from "../errors.js";
import { scanProject } from "../engine/scanner.js";
import { formatJson, formatJsonError } from "../reporters/json.js";
import { formatTerminal } from "../reporters/terminal.js";
import { makePaint } from "../utils/colors.js";

interface Writer {
  write(text: string): unknown;
}

export interface CommandIo {
  stdout: Writer;
  stderr: Writer;
  cwd: string;
  isTty: boolean;
  env: NodeJS.ProcessEnv;
}

function readVersion(): string {
  try {
    const text = readFileSync(new URL("../../package.json", import.meta.url), "utf8");
    const parsed = JSON.parse(text) as { version?: unknown };
    return typeof parsed.version === "string" ? parsed.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}

const VERSION = readVersion();
const pendingTelemetry: Promise<unknown>[] = [];

/**
 * Wait for any opted-in telemetry before the process exits. Without this, a
 * short-lived CLI can terminate before a fire-and-forget request completes.
 */
export async function flushTelemetry(): Promise<void> {
  while (pendingTelemetry.length > 0) {
    await Promise.allSettled(pendingTelemetry.splice(0));
  }
}

function trackCommand(
  command: "scan" | "doctor",
  outcome: "completed" | "failed",
  env: NodeJS.ProcessEnv,
): void {
  const settings = readTelemetrySettings(env);
  if (!settings.enabled || settings.endpoint === null) return;
  const payload = buildTelemetryPayload(settings, command, outcome, VERSION);
  pendingTelemetry.push(sendTelemetry(payload, settings.endpoint));
}

function isTargetError(error: unknown): boolean {
  return (
    error instanceof CdocError &&
    (error.code === "MISSING_TARGET" || error.code === "INVALID_TARGET")
  );
}

function writeError(error: unknown, io: CommandIo, json: boolean, verbose: boolean): void {
  const code = error instanceof CdocError ? error.code : "SCAN_FAILED";
  const message = toErrorMessage(error);
  const stack = verbose ? toErrorStack(error) : undefined;

  if (json) {
    io.stdout.write(`${formatJsonError(code, message, stack)}\n`);
    return;
  }

  io.stderr.write(`cdoc: ${message}\n`);
  if (code === "INVALID_OPTION") io.stderr.write('Try "cdoc --help" for usage.\n');
  if (stack !== undefined && stack !== message) io.stderr.write(`${stack}\n`);
}

function exitCode(parsed: ParsedArgs, totals: {
  warning: number;
  failed: number;
  error: number;
}): number {
  if (totals.failed > 0 || totals.error > 0) return 1;
  if (parsed.strict && totals.warning > 0) return 1;
  return 0;
}

/** Single entry point used by bin/cdoc.js and by the CLI tests. */
export function runCli(argv: readonly string[], io: CommandIo): number {
  const json = wantsJson(argv);
  let parsed: ParsedArgs;

  try {
    parsed = parseArgs(argv);
  } catch (error) {
    writeError(error, io, json, argv.includes("--verbose"));
    return 2;
  }

  if (parsed.help) {
    io.stdout.write(HELP);
    return 0;
  }
  if (parsed.version) {
    io.stdout.write(`${VERSION}\n`);
    return 0;
  }

  try {
    const report = scanProject(parsed.target, io.cwd, {
      registry: createDefaultRegistry(),
      verbose: parsed.verbose,
    });
    const colour =
      parsed.color ?? (io.isTty && !("NO_COLOR" in io.env));
    const output = parsed.json
      ? formatJson(report)
      : formatTerminal(
          report,
          makePaint(colour),
          parsed.command === "doctor" ? "cDoc doctor" : "cDoc scan",
        );
    io.stdout.write(`${output}\n`);
    trackCommand(parsed.command, "completed", io.env);
    return exitCode(parsed, report.totals);
  } catch (error) {
    writeError(error, io, json, parsed.verbose);
    trackCommand(parsed.command, "failed", io.env);
    return isTargetError(error) ? 2 : 1;
  }
}
