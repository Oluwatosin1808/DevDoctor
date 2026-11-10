# devdoctor (CLI)

A developer-first diagnostic CLI for JavaScript and TypeScript projects. It runs
five categories of checks and reduces the findings to a score out of 100.

```
$ devdoctor scan

DevDoctor
Scanning /your/project

Project configuration
    ✓ package.json is present and parses
    ✓ package.json declares name, version, description, license
    ...

────────────────────────────────────────────────────
Score 96/100 — 1 finding(s) need attention
17 passed · 1 warnings · 0 errors
```

## Install

```bash
npm install -g @oluwat0s1n/devdoctor
```

Or run it without installing:

```bash
npx @oluwat0s1n/devdoctor scan
```

To work on it from source, run `npm install` at the monorepo root, then
`node packages/cli/bin/devdoctor.js scan`.

### Publishing

Maintainers only. Publishes go through npm's normal `2FA` check:

```bash
cd packages/cli && npm publish      # npm prompts for a one-time code
```

A granular access token with **Bypass two-factor authentication** also works
(`npm config set //registry.npmjs.org/:_authToken=...`), which is how this
package was first released. Note that npm is restricting bypass-2FA tokens for
direct publishing from **January 2027** — after that, use an OTP code per
publish, or set up [Trusted Publishing](https://docs.npmjs.com/trusted-publishers)
against a CI workflow.

## Usage

```
devdoctor [scan] [options]

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
```

## What it checks

| Category | Looks at |
| --- | --- |
| **Project configuration** | `package.json` parses, declares `name`/`version`/`description`/`license`, pins `engines.node`, defines scripts, and ships a `tsconfig.json` when TypeScript sources exist |
| **Dependencies** | A lockfile is present, every dependency range specifies a version, and nothing is declared in both `dependencies` and `devDependencies` |
| **Environment variables** | `.env` files are git-ignored and untracked, and a committable `.env.example` documents the required variables |
| **Git configuration** | A repository exists, `.gitignore` covers `node_modules` and `.env`, and no build output is tracked |
| **Security checks** | No credential-shaped strings (private keys, AWS/GitHub/Slack/npm/Stripe/Google tokens) in tracked files, and no npm script that pipes a download into a shell |

Environment files are never read — only whether they exist, whether git ignores
them, and whether git is tracking them.

## Scoring

Each finding carries a severity. Errors deduct 12 points, warnings deduct 4, and
the score is floored at 0.

| Score | Meaning |
| --- | --- |
| 90–100 | Healthy |
| 70–89 | Needs attention |
| 0–69 | At risk |

## Design notes

- **Zero runtime dependencies** — Node standard library only.
- **ESM**, Node `>=20`.
- Prefers `git ls-files` for security scanning (that is what actually leaves
  your machine) and falls back to a filesystem walk with excluded directories
  when git is unavailable.
- Colour is disabled automatically on non-TTY output and when `NO_COLOR` is set.

## Development

From the monorepo root:

```bash
npm install
npm run scan --workspace @oluwat0s1n/devdoctor   # run a scan
npm test  --workspace @oluwat0s1n/devdoctor      # node --test
```

The marketing site in `apps/web` does not depend on this package.
