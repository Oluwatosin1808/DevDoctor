import { CdocError } from "../errors.js";

export interface ParsedArgs {
  command: "scan" | "doctor";
  target: string;
  json: boolean;
  verbose: boolean;
  color: boolean | null;
  strict: boolean;
  help: boolean;
  version: boolean;
}

export const HELP = `cDoc — local-first developer diagnostics

Usage
  cdoc scan [target] [options]
  cdoc doctor [target] [options]

Commands
  scan              Run a diagnostic scan (default when no command is given)
  doctor            Run the same diagnostics with a doctor-style heading

Options
  --json            Emit a complete machine-readable report on stdout
  --verbose         Include stack traces for errors
  --no-color        Disable ANSI colour
  --color           Force ANSI colour on
  --strict          Exit non-zero when warnings are reported
  --cwd <path>      Legacy alias for the target directory
  -h, --help        Show this help
  -v, --version     Show the version

Exit codes
  0                 Scan completed with no failures or errors
  1                 Failed checks, execution errors, or warnings with --strict
  2                 Invalid usage or invalid target
`;

function usageError(message: string): CdocError {
  return new CdocError("INVALID_OPTION", message);
}

/** Hand-written parser kept from the zero-dependency CLI, now isolated from diagnostics. */
export function parseArgs(argv: readonly string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    command: "scan",
    target: ".",
    json: false,
    verbose: false,
    color: null,
    strict: false,
    help: false,
    version: false,
  };
  const positionals: string[] = [];
  let cwd: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === undefined) continue;

    if (arg === "-h" || arg === "--help") {
      parsed.help = true;
    } else if (arg === "-v" || arg === "--version") {
      parsed.version = true;
    } else if (arg === "--json") {
      parsed.json = true;
    } else if (arg === "--verbose") {
      parsed.verbose = true;
    } else if (arg === "--strict") {
      parsed.strict = true;
    } else if (arg === "--color") {
      parsed.color = true;
    } else if (arg === "--no-color") {
      parsed.color = false;
    } else if (arg === "--cwd" || arg.startsWith("--cwd=")) {
      const value = arg === "--cwd" ? argv[index + 1] : arg.slice("--cwd=".length);
      if (value === undefined || value === "" || value.startsWith("-")) {
        throw usageError("--cwd requires a path");
      }
      cwd = value;
      if (arg === "--cwd") index += 1;
    } else if (arg.startsWith("-") && arg !== "-") {
      throw usageError(`Unknown option: ${arg}`);
    } else {
      positionals.push(arg);
    }
  }

  if (parsed.help || parsed.version) return parsed;

  const [command, target, ...extra] = positionals;
  if (command !== undefined) {
    if (command !== "scan" && command !== "doctor") {
      throw usageError(`Unknown command: ${command}`);
    }
    parsed.command = command;
  }
  if (target !== undefined) parsed.target = target;
  if (extra.length > 0) throw usageError(`Unexpected argument: ${extra[0]}`);
  if (cwd !== null) {
    if (target !== undefined) throw usageError("Use either a target argument or --cwd, not both");
    parsed.target = cwd;
  }

  return parsed;
}

export function wantsJson(argv: readonly string[]): boolean {
  return argv.includes("--json");
}
