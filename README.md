# DevDoctor

A developer-first diagnostic CLI and its marketing site, in one npm-workspaces monorepo.

```
DevDoctor/
├── apps/web/        # Marketing site — Next.js App Router, TypeScript, Tailwind CSS
└── packages/cli/    # CLI package (placeholder stub — not yet implemented)
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

All scripts run from the repo root and delegate to the `@devdoctor/web` workspace:

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

### Coming-soon links

The GitHub, npm, documentation, contributing, security, and license URLs are not
live yet. They are declared as `null` in `LINKS` inside
`apps/web/src/lib/site.ts`, and any control that points at a `null` link renders a
"SOON" chip instead of navigating. Clicking it shows a short toast explaining that
the destination is not published yet — there are **no broken or invented links**,
and no fabricated stars, downloads, or testimonials anywhere on the page.

To wire up a real destination once it exists, replace the `null` with the URL —
the `ExternalLinks` type already allows `string | null` for every key:

```ts
export const LINKS: ExternalLinks = {
  github: "https://github.com/your-org/devdoctor",
  npm: "https://www.npmjs.com/package/devdoctor",
  docs: null,
  contributing: null,
  security: null,
  license: null,
};
```

The moment a key is a non-empty string, that control becomes a normal link and the
"SOON" chip disappears automatically.

### Site metadata

Title, description, canonical URL, Open Graph, and Twitter card values are set in
`apps/web/src/app/layout.tsx`. `metadataBase` comes from `SITE.url` in
`apps/web/src/lib/site.ts` — **set `SITE.url` to your production origin** before
deploying so canonical and OG URLs resolve correctly.

## SEO files

- `apps/web/src/app/robots.ts` → `/robots.txt`
- `apps/web/src/app/sitemap.ts` → `/sitemap.xml`

## packages/cli

A placeholder workspace so the CLI has a home and the `devdoctor` bin name is
reserved. It is intentionally `private` and has no implementation yet; the web
work does not depend on it.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 · Tailwind CSS 4 ·
Framer Motion · Lucide React · Geist
