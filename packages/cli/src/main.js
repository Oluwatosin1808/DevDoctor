import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { formatHuman, formatJson } from "./report.js";
import { runScan } from "./scan.js";
import { exists, makePaint } from "./util.js";

const PKG = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("../package.json", import.meta.url)),
    "utf8",
  ),
);

export const HELP = `cdoc \u2014 a developer-first diagnostic CLI

Usage
  cdoc [scan] [options]

Commands
  scan              Run a diagnostic scan of the current project (default)

Options
  --cwd <path>      Scan a directory other than the current one
  --json            Emit machine-readable JSON
  --strict          Exit non-zero on warnings as well as errors
  --color           Force ANSI colour on
  --no-color        Force ANSI colour off
  -h, --help        Show this help
  -v, --version     Show the version

Exit codes
  0                 Scan completed with no errors
  1                 Errors found, or warnings when --strict is set
  2                 Invalid usage
`;

function parseArgs(argv) {
  const opts = {
    help: false,
    version: false,
    json: false,
    strict: false,
    colour: null,
    cwd: null,
    error: null,
  };
  const positionals = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "-h" || arg === "--help") {
      opts.help = true;
    } else if (arg === "-v" || arg === "--version") {
      opts.version = true;
    } else if (arg === "--json") {
      opts.json = true;
    } else if (arg === "--strict") {
      opts.strict = true;
    } else if (arg === "--color") {
      opts.colour = true;
    } else if (arg === "--no-color") {
      opts.colour = false;
    } else if (arg === "--cwd") {
      const value = argv[i + 1];
      if (!value || value.startsWith("-")) {
        opts.error = "--cwd requires a path";
        return opts;
      }
      opts.cwd = value;
      i += 1;
    } else if (arg.startsWith("-")) {
      opts.error = `Unknown option: ${arg}`;
      return opts;
    } else {
      positionals.push(arg);
    }
  }

  if (!opts.help && !opts.version) {
    const [command, ...rest] = positionals;
    if (command !== undefined && command !== "scan") {
      opts.error = `Unknown command: ${command}`;
      return opts;
    }
    if (rest.length > 0) {
      opts.error = `Unexpected argument: ${rest[0]}`;
      return opts;
    }
  }

  return opts;
}

/**
 * Runs the CLI once and returns the process exit code instead of exiting, so
 * the argument handling stays testable.
 *
 * @param {string[]} argv
 * @param {{stdout?: {write(s:string):void}, stderr?: {write(s:string):void}, cwd?: string, isTty?: boolean}} io
 */
export function main(argv, io = {}) {
  const stdout = io.stdout ?? process.stdout;
  const stderr = io.stderr ?? process.stderr;
  const cwd = io.cwd ?? process.cwd();
  const isTty = io.isTty ?? Boolean(process.stdout.isTTY);

  const opts = parseArgs(argv);

  if (opts.error) {
    stderr.write(`${opts.error}\nTry "cdoc --help" for usage.\n`);
    return 2;
  }
  if (opts.help) {
    stdout.write(HELP);
    return 0;
  }
  if (opts.version) {
    stdout.write(`${PKG.version}\n`);
    return 0;
  }

  const root = opts.cwd ? resolve(cwd, opts.cwd) : cwd;
  if (!exists(root)) {
    stderr.write(`No such directory: ${root}\n`);
    return 2;
  }

  const result = runScan(root);

  if (opts.json) {
    stdout.write(`${formatJson(result)}\n`);
  } else {
    const automatic = isTty && !("NO_COLOR" in process.env);
    const colour = opts.colour === null ? automatic : opts.colour;
    stdout.write(`${formatHuman(result, { paint: makePaint(colour) })}\n`);
  }

  if (result.totals.error > 0) return 1;
  if (opts.strict && result.totals.warn > 0) return 1;
  return 0;
}
