# cDoc

cDoc is a local-first developer diagnostics CLI that helps you understand a
codebase's health, surface potential problems, and decide what to fix. This
repository also contains the cDoc marketing site; both live in one npm-workspaces
monorepo.

**Current milestone: 1 — Core Foundation.** The CLI, project detection, safe
file discovery, diagnostic engine, findings, reports and terminal/JSON output
are implemented. The broader product vision (AI explanations, fixes, comparisons,
CI integrations, HTML reports, and deeper security/dependency analysis) is
planned, not implemented.

## Repository layout

```
cDoc/
├── apps/web/        Marketing site — Next.js App Router, TypeScript, Tailwind CSS
└── packages/cli/    cDoc CLI — strict TypeScript, ESM, zero runtime dependencies
```

The workspace structure and the existing website are preserved. The website does
not depend on the CLI package.

## What is implemented

- `cdoc scan [target]` and `cdoc doctor [target]` (doctor is a scan with a
  doctor-style heading).
- `--help`, `--version`, `--json`, `--verbose`, `--no-color`, `--strict` and the
  legacy `--cwd <path>` option.
- Evidence-based detection of JavaScript/TypeScript, React, Next.js, Vue,
  Angular, Vite, Express and Node.js, plus package managers from lockfiles with
  explicit conflict reporting.
- Safe file discovery that respects root and nested `.gitignore`, excludes
  generated directories, never follows symlinks, stays inside the target root,
  and caps file count and read size.
- A modular registry/runner: checks are registered independently, skipped when
  inapplicable, and isolated from one another when they fail.
- A standard `Finding` model (severity, category, confidence, optional file/line,
  recommendation, metadata) with redaction of credential-shaped text.
- A complete `ScanReport` with profile, scan ID, timestamps, duration, overall
  status, per-status check counts, and findings grouped by severity and category.
  There is deliberately **no health score** in this milestone.
- Terminal reporting with real discovered/check data and JSON reporting with no
  ANSI codes or progress text on stdout.
- Five real foundational checks: project configuration, Git configuration,
  dependencies, environment files, and basic credential-shape detection. They
  prove the engine end-to-end; they are not a complete security/dependency audit.

## Installation status

**cDoc is not published to npm.** There is no install command to copy yet. To
run it from this checkout:

```bash
npm install
npm run build                 # builds the CLI and the site
node packages/cli/bin/cdoc.js --help
npm run scan                  # scans this repository
```

After `npm install`, the workspace bin link also allows `npx --no-install cdoc`
from the repository root. Do not claim availability on npm or quote download,
star, testimonial, or benchmark numbers.

## Requirements

- Node.js >= 20
- npm 7+ (workspaces)

## Development setup

```bash
npm install
npm run typecheck             # strict TS for the CLI, then the web app
npm test                      # node:test suites for the CLI
npm run build                 # CLI (tsc) then the website (next build)
npm run dev                   # Next.js dev server at http://localhost:3000
```

The CLI is written in strict TypeScript under `packages/cli/src/` and compiled
to `packages/cli/dist/`. Tests import the compiled output and use temporary
fixture projects, so they work cross-platform and never depend on this checkout.

## Commands

```
cdoc scan [target] [options]
cdoc doctor [target] [options]

Options
  --json            Complete machine-readable report on stdout
  --verbose         Stack traces for errors
  --no-color        Disable ANSI colour
  --color           Force ANSI colour on
  --strict          Exit non-zero when warnings are reported
  --cwd <path>      Legacy alias for the target directory
  -h, --help        Show help
  -v, --version     Show the version
```

Exit codes: `0` no failures/errors, `1` failed checks, execution errors, or
warnings with `--strict`, `2` invalid usage or target.

Optional environment variables for anonymous usage counters (all unset by
default):

```bash
CDOC_TELEMETRY=1
CDOC_TELEMETRY_ENDPOINT=https://your-endpoint.example/collect
CDOC_TELEMETRY_ID=anon-12345678   # optional stable ID override
```

You must host the endpoint/dashboard yourself; cDoc does not ship a collector.

## Example output

```text
cDoc scan — local-first project diagnostics

Project
  Name        fixture
  Target      /path/to/fixture
  Frameworks  vite, nodejs
  Languages   javascript, typescript
  Runtime     node
  Package mgr npm

Progress
  ✓ Target validated
  ✓ 18 file(s) discovered, 3 skipped
  ✓ Profile detected at 2026-01-01T00:00:00.000Z
  ✓ 5 check(s) executed in 24 ms

Checks
  ✓ Project configuration — passed (1 finding(s))
  ! Git configuration — warning (1 finding(s))
  ✓ Dependencies — passed (2 finding(s))
  ✓ Environment files — passed (0 finding(s))
  ✓ Security basics — passed (1 finding(s))

Findings by severity
  LOW (1)
  [low] Common generated paths are not ignored
  git-configuration · .gitignore
  INFO (4)
  [info] package.json is present and parses
  project-configuration · package.json

Recommended next steps
  1. Add ignore rules for generated directories and local environment files.

Summary
  5 checks · 4 passed · 1 warning · 0 failed · 0 skipped · 0 error
  Status: warning
```

`cdoc scan --json` emits the same data as one JSON object with `schemaVersion: 1`
(no score, colours, or progress text). Progress and errors are kept off stdout
in JSON mode.

## Privacy and local-first principles

- Scans never modify the target project.
- Source code, file paths, findings and scan results are never uploaded. cDoc has
  no AI/API keys and makes **no network calls by default**.
- Anonymous usage telemetry is strictly opt-in: set `CDOC_TELEMETRY=1` and
  `CDOC_TELEMETRY_ENDPOINT=<your HTTPS endpoint>`. Each scan/doctor run then posts
  only an anonymous install ID, cDoc version, command name, outcome and timestamp
  — never project data. `CDOC_TELEMETRY_ID` can override the stored anonymous ID.
  Telemetry failures never change scan output or exit codes.
- Discovery stays inside the target, does not follow symlinks, and reads only
  `.gitignore` files and files a check genuinely needs.
- Findings store file paths and labels, never secret values; free text is
  redacted defensively.
- `.env` contents are never read by the environment check.

## Current limitations

- Framework detection requires dependency/script evidence; configuration files
  alone are intentionally not treated as proof of use.
- The `.gitignore` matcher covers common gitignore semantics but is not a full
  git implementation (for example, exotic escape sequences).
- The four package managers are detected from lockfiles; conflicting lockfiles
  are reported rather than resolved.
- Dependency, environment and security checks are intentionally shallow. They
  are not vulnerability scanners, secret scanners, or fix tools.
- HTML reports, scan comparisons, user-approved fixes, CI recipes and AI
  explanations are not implemented.

## Roadmap (planned, not implemented)

1. Deeper dependency analysis and reproducible-install advice.
2. Environment validation with documented required variables.
3. Structured code-quality and framework-specific checks.
4. HTML and JSON report consumers, scan comparisons, CI/CD integration.
5. User-approved, reviewable fixes.
6. Optional AI explanations, with explicit opt-in and no automatic uploads.

## Website

Site copy and external destinations are centralised in
`apps/web/src/lib/site.ts`. The npm destination remains `null` until the package
is actually published, so its control shows "SOON" instead of a fake link. The
site's external links point to the repository, docs, contributing guide,
security policy and license only.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 · Tailwind CSS 4 ·
Framer Motion · Lucide React · Geist · Node's built-in test runner.
