# cDoc

A developer-first diagnostic CLI and its marketing site, in one npm-workspaces monorepo.

```
cDoc/
├── apps/web/        # Marketing site — Next.js App Router, TypeScript, Tailwind CSS
└── packages/cli/    # CLI package — published as @oluwat0s1n/devdoctor
```

## Install

```bash
npm install -g @oluwat0s1n/devdoctor   # then run `cdoc scan`
```

Or without installing:

```bash
npx @oluwat0s1n/devdoctor scan
```

## Requirements

- Node.js >= 20
- npm (workspaces are used, so npm 7+ ships with Node 20)

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts the Next.js dev server at <http://localhost:3000>.

## Scripts

All scripts run from the repo root and delegate to the `@cdoc/web` workspace:

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Serve the production build (`next start`) |
| `npm run lint` | ESLint across the web app |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |

A full green check before shipping is:

```bash
npm run lint
npm run typecheck
npm run build
```

> `typecheck` runs `next typegen` first because the generated `LayoutProps` route
> types must exist before `tsc` can type-check `app/layout.tsx`.

## The site

- **Single source of copy and URLs:** `apps/web/src/lib/site.ts` holds the site
  config, nav anchors, install commands, and the `LINKS` map.
- **Sections** live in `apps/web/src/components/sections/` and are composed by
  `apps/web/src/app/page.tsx`.
- **Design tokens** (near-black surfaces, electric lime accent `#B6F36A`, borders,
  type scale) are defined in `apps/web/src/app/globals.css` as Tailwind v4 `@theme`
  tokens.
- **Fonts:** Geist Sans + Geist Mono, self-hosted via the `geist` npm package.

### External links

The destinations for the site live in the `LINKS` map inside
`apps/web/src/lib/site.ts`. Today the repository, documentation,
contributing guide, security policy, and license are live; the npm package is
still `null` because it has not been published yet, so its control renders a
"SOON" chip instead of navigating. Clicking it shows a short toast explaining
that the destination is not published yet — there are **no broken or invented
links**, and no fabricated stars, downloads, or testimonials anywhere on the
page.

To wire up a real destination once it exists, replace the `null` with the URL —
the `ExternalLinks` type already allows `string | null` for every key:

```ts
export const LINKS: ExternalLinks = {
  github: "https://github.com/Oluwatosin1808/cDoc",
  npm: "https://www.npmjs.com/package/@oluwat0s1n/devdoctor",
  docs: "/docs",
  contributing:
    "https://github.com/Oluwatosin1808/cDoc/blob/main/CONTRIBUTING.md",
  security: "https://github.com/Oluwatosin1808/cDoc/security/policy",
  license: "https://github.com/Oluwatosin1808/cDoc/blob/main/LICENSE",
};
```

The moment a key is a non-empty string, that control becomes a normal link and the
"SOON" chip disappears automatically.

### Site metadata

Title, description, canonical URL, Open Graph, and Twitter card values are set in
`apps/web/src/app/layout.tsx`. `metadataBase` comes from `SITE.url` in
`apps/web/src/lib/site.ts`, which is set to the production origin
(`https://web-five-sigma-66.vercel.app`) so canonical and OG URLs resolve
correctly. If the site moves to a custom domain, update `SITE.url` and nothing
else — `layout.tsx`, `opengraph-image.tsx`, `sitemap.ts`, and `robots.ts` all
read it from there.

## SEO files

- `apps/web/src/app/robots.ts` → `/robots.txt`
- `apps/web/src/app/sitemap.ts` → `/sitemap.xml`

## packages/cli

The `cdoc` CLI: a zero-dependency, ESM Node ≥20 package that scans a
project across five check categories (project, dependencies, environment, git,
security), reduces the findings to a score out of 100, and exits `0`/`1`/`2`
so CI can gate on it. The marketing site does not depend on this package.

```bash
npm test --workspace @oluwat0s1n/devdoctor   # node --test
npm run scan --workspace @oluwat0s1n/devdoctor
```

See [`packages/cli/README.md`](packages/cli/README.md) for the full command
reference, and [`/docs`](https://web-five-sigma-66.vercel.app/docs) for the
published documentation.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 · Tailwind CSS 4 ·
Framer Motion · Lucide React · Geist
