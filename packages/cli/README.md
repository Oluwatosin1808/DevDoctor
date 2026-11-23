# cdoc (CLI)

cDoc is a local-first developer diagnostics CLI. This package is the CLI: strict
TypeScript, ESM, Node >= 20, and no runtime dependencies. It is **not published
to npm**; run it from this checkout.

```bash
npm install                       # at the monorepo root
npm run build --workspace @cdoc/cli
node packages/cli/bin/cdoc.js scan --no-color
```

After installation, `npx --no-install cdoc` works from the repository root.

## Commands

```
cdoc scan [target] [options]
cdoc doctor [target] [options]

scan              Run a diagnostic scan (default when no command is given)
doctor            Run the same checks with a doctor-style heading

--json            Emit the complete report as JSON on stdout
--verbose         Include stack traces for errors
--no-color        Disable ANSI colour
--color           Force ANSI colour on
--strict          Exit non-zero when warnings are reported
--cwd <path>      Legacy alias for the target directory
-h, --help        Show help
-v, --version     Show the version
```

Exit codes:

| Code | Meaning |
| --- | --- |
| 0 | Scan completed with no failed checks or execution errors |
| 1 | Failed checks, execution errors, or warnings with `--strict` |
| 2 | Invalid usage, missing path, or target that is not a directory |

In `--json` mode, errors are also emitted as JSON (`{"tool":"cdoc","ok":false,
"error":{...}}`) on stdout so CI tools can parse them. Without `--json`, errors
go to stderr and stack traces appear only with `--verbose`.

## Architecture

- `src/cli/` — argument parsing and command definitions, separated from logic.
- `src/detection/` — project fingerprinting from real files and package metadata.
- `src/files/` — safe, deterministic file discovery with `.gitignore` support.
- `src/engine/` — check registry, isolated runner, and scan orchestration.
- `src/checks/` — the registered diagnostic checks.
- `src/findings.ts` — the single factory for standardised, redacted findings.
- `src/report/` — report aggregation and counts.
- `src/reporters/` — terminal and JSON output.

New checks implement `DiagnosticCheck`, are registered in `src/checks/index.ts`,
and require no changes to the scanner. Check results use `passed`, `warning`,
`failed`, `skipped` (not applicable) or `error` (could not complete). Skipped and
errored checks are never counted as passes.

## Implemented checks

| Check | What it verifies |
| --- | --- |
| Project configuration | `package.json` presence and validity, npm scripts where relevant, `tsconfig.json` for TypeScript sources, Node version declaration, and conflicting lockfiles |
| Git configuration | Repository presence, `.gitignore` coverage of common generated paths, and tracked generated files |
| Dependencies | Lockfile presence, explicit version ranges, and duplicate declarations |
| Environment files | Local `.env` files have examples, are ignored by Git, and are not tracked — contents are never read |
| Security basics | Credential-shaped strings in safe discoverable files and risky npm scripts; values are never printed |

These are foundational checks, not a complete security or dependency audit.
There is no health score in this milestone.

## Report model

`cdoc scan --json` returns one JSON object with `schemaVersion: 1`, containing:
project profile, `scanId`, start/finish times, duration, overall status, check
counts (`checks`, `passed`, `warning`, `failed`, `skipped`, `error`), discovery
summary, per-check results, and findings grouped by severity and category.
Optional finding fields are omitted when they do not apply.

## Privacy

Scans are read-only and entirely local by default: no network calls, telemetry,
uploads, AI APIs or API keys. Symlinks are not followed, path traversal is
rejected, reads are size-capped, and finding text is redacted for
credential-shaped values.

Optional anonymous usage telemetry is off unless `CDOC_TELEMETRY=1` and
`CDOC_TELEMETRY_ENDPOINT=<url>` are set. It posts only an anonymous install ID,
cDoc version, `scan`/`doctor` command, outcome and timestamp. No target path,
file name, finding, source code or scan result is sent. The ID is stored at
`~/.cdoc/telemetry-id` (override with `CDOC_TELEMETRY_ID`), and delivery failures
are ignored. You must provide and host the collector endpoint.

## Development

```bash
npm run build --workspace @cdoc/cli       # tsc -> dist/
npm run typecheck --workspace @cdoc/cli   # strict type check, no emit
npm test --workspace @cdoc/cli            # builds, then node --test
```

Tests live in `test/` and use temporary fixture projects via `node:test`.
