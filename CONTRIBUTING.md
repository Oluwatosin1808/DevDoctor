# Contributing to cDoc

Thanks for your interest in improving cDoc. This document explains how to
get a working checkout, what to run before you open a pull request, and the
conventions that keep the codebase consistent.

## Project layout

cDoc is an npm workspaces monorepo:

| Path            | Contents                                                  |
| --------------- | --------------------------------------------------------- |
| `apps/web`      | The marketing site and the in-app `/docs` route (Next.js)  |
| `packages/cli`  | The `cdoc` CLI (Node, ESM, zero runtime dependencies)  |

The website does not depend on the CLI package, and the CLI does not depend on
anything else in the repo. Changes to one never require changes to the other.

## Getting started

```bash
git clone https://github.com/Oluwatosin1808/cDoc.git
cd cDoc
npm install
```

Useful scripts, run from the repo root:

| Command                 | What it does                                    |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Start the site's dev server                     |
| `npm run build`         | Production build of the site                    |
| `npm run lint`          | ESLint across the web app                       |
| `npm run typecheck`     | `next typegen` + `tsc --noEmit`                 |
| `npm test --workspace @oluwat0s1n/devdoctor` | Run the CLI test suite (`node --test`)  |

> `typecheck` runs `next typegen` first because the generated `LayoutProps`
> route types must exist before `tsc` can type-check `app/layout.tsx`.

## Making changes

### Site (`apps/web`)

- **Copy and URLs live in one place:** `src/lib/site.ts` holds the site config,
  nav anchors, install commands, and the `LINKS` map. Update copy there rather
  than hard-coding strings in components.
- **Never invent social proof.** No star counts, download numbers, testimonials
  or stats unless they are real and verifiable. A destination that does not
  exist yet stays `null` in `LINKS` — components render an explicit "coming
  soon" state instead of a link that would 404.
- **Design tokens** (near-black surfaces, electric lime `#B6F36A`, borders, type
  scale) are defined in `src/app/globals.css` as Tailwind v4 `@theme` tokens.
  Prefer those tokens over one-off color values.
- **Accessibility is a hard requirement.** Keep semantic landmarks, keyboard
  reachability, visible focus states, and AA contrast. Run Lighthouse
  (accessibility, best practices, SEO) before submitting — the site currently
  scores 100 in all three.

### CLI (`packages/cli`)

- **Zero runtime dependencies.** Use the Node standard library only.
- **Checks must stay honest.** Every finding should be something the tool
  actually verified — never report a pass for a check that did not run.
- **Never read secret values.** The environment check inspects whether files
  exist, whether git ignores them, and whether git tracks them — it never
  prints their contents.
- **Tests are required** for new checks and for bug fixes. Add cases to
  `test/cli.test.js`; the suite runs with `node --test` and must stay green.

## Code style

- TypeScript in `apps/web`, plain ESM JavaScript with JSDoc in `packages/cli`.
- Two-space indentation, double quotes, semicolons.
- Run `npm run lint` and `npm run typecheck` — CI does, and a green local run
  means a green CI run.

## Pull requests

1. Fork and create a branch from `main`.
2. Make the change, keeping commits focused and described in the imperative
   ("Add dependency range check", not "Added").
3. Verify: `npm run lint`, `npm run typecheck`, `npm run build`, and
   `npm test --workspace @oluwat0s1n/devdoctor`.
4. Open a PR describing **what** changed and **why**. If the change affects
   visible copy or behaviour, include a screenshot or a short recording.

## Reporting bugs

Open an issue with:

- The cDoc version (`cdoc --version`) and your Node version
  (`node --version`)
- What you ran, what you expected, and what happened instead
- A minimal reproduction — a small project or a pasted report output

For anything security-related, **do not open a public issue.** Follow
[SECURITY.md](SECURITY.md) instead.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE).
