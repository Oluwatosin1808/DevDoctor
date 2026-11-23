/**
 * Central site configuration.
 *
 * Copy, navigation targets and external destinations live here so every
 * component tells the same story. When a destination is not confirmed, it is
 * `null` and the UI says so instead of linking somewhere invented.
 */

export const SITE = {
  name: "cDoc",
  wordmark: "cDoc",
  tagline: "Understand your codebase. Discover its problems. Know what to fix next.",
  shortDescription:
    "A local-first, open-source diagnostics CLI for JavaScript and TypeScript projects.",
  description:
    "cDoc reads your project, surfaces configuration, dependency, environment and security signals, and shows what needs attention — without uploading your source code.",
  /** Production origin — feeds canonical, Open Graph, and sitemap URLs. */
  url: "https://web-five-sigma-66.vercel.app",
  locale: "en_US",
  year: 2026,
} as const;

/** Exact hero copy, kept together so it stays exact. */
export const HERO = {
  eyebrow: "OPEN-SOURCE DEVELOPER DIAGNOSTICS",
  headline: "Your codebase has a story. Know what it's telling you.",
  supporting:
    "Understand your project. Catch hidden problems. Know exactly what needs attention.",
  primaryCta: "Explore cDoc",
  secondaryCta: "View on GitHub",
  labels: ["Local-first", "Open source", "Developer-first"],
} as const;

/**
 * External destinations.
 *
 * The GitHub URL is the repository's actual origin. The docs route is local to
 * this app. There is deliberately no npm destination: the CLI is run from this
 * checkout and no install claim is made on the site.
 */
export interface ExternalLinks {
  github: string;
  docs: string;
  contributing: string;
  security: string;
  license: string;
}

const GITHUB_REPO = "https://github.com/Oluwatosin1808/DevDoctor";

export const LINKS: ExternalLinks = {
  github: GITHUB_REPO,
  docs: "/docs",
  contributing: `${GITHUB_REPO}/blob/main/CONTRIBUTING.md`,
  security: `${GITHUB_REPO}/blob/main/SECURITY.md`,
  license: `${GITHUB_REPO}/blob/main/LICENSE`,
};

/** In-page navigation targets. Keep in sync with the section ids in `page.tsx`. */
export const ANCHORS = {
  demo: "demo",
  problem: "problem",
  solution: "solution",
  features: "features",
  howItWorks: "how-it-works",
  findings: "findings",
  privacy: "privacy",
  openSource: "open-source",
  faq: "faq",
  getStarted: "get-started",
} as const;

/** Real commands that work from a local checkout of this repository. */
export const COMMANDS = {
  clone: `git clone ${GITHUB_REPO}.git`,
  setup: "cd DevDoctor && npm install",
  build: "npm run build",
  startFromSource: `git clone ${GITHUB_REPO}.git && cd DevDoctor && npm install && npm run build`,
  scan: "node packages/cli/bin/cdoc.js scan",
  scanRepo: "npm run scan",
} as const;

/** Fallback copy for any destination that is ever unset. */
export const COMING_SOON_MESSAGES = {
  github: "The repository link isn’t configured yet.",
  docs: "The documentation link isn’t configured yet.",
  contributing: "The contribution guide isn’t configured yet.",
  security: "The security policy isn’t configured yet.",
  license: "The license link isn’t configured yet.",
} as const;
