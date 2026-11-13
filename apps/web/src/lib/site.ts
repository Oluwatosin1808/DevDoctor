/**
 * Central site configuration.
 *
 * Everything a template or component needs to know about cDoc lives here so
 * copy stays consistent and URLs only ever have to be updated in one place.
 */

export const SITE = {
  name: "cDoc",
  /** Wordmark used in the navigation and footer. */
  wordmark: "cDoc",
  tagline: "Your code deserves a regular checkup.",
  shortDescription:
    "cDoc is an open-source command-line tool that examines JavaScript and TypeScript projects for security, configuration, dependency and environment issues.",
  description:
    "Catch issues before they become problems. cDoc examines your project, finds potential problems and tells you exactly where to start fixing them — all from your terminal.",
  /** Production origin — feeds canonical, Open Graph, and sitemap URLs. */
  url: "https://web-five-sigma-66.vercel.app",
  locale: "en_US",
  year: 2026,
} as const;

/**
 * External destinations.
 *
 * A `null` value is deliberate: components render an explicit "coming soon"
 * state instead of linking to a URL that would 404. Flipping a key to a real
 * absolute URL switches every control that uses it to a normal link.
 */
export interface ExternalLinks {
  github: string | null;
  npm: string | null;
  docs: string | null;
  contributing: string | null;
  security: string | null;
  license: string | null;
}

export const LINKS: ExternalLinks = {
  github: "https://github.com/Oluwatosin1808/cDoc",
  npm: "https://www.npmjs.com/package/@oluwat0s1n/devdoctor",
  docs: "/docs",
  contributing:
    "https://github.com/Oluwatosin1808/cDoc/blob/main/CONTRIBUTING.md",
  security: "https://github.com/Oluwatosin1808/cDoc/security/policy",
  license: "https://github.com/Oluwatosin1808/cDoc/blob/main/LICENSE",
};

/** In-page navigation targets. Keep in sync with the section ids in `page.tsx`. */
export const ANCHORS = {
  problem: "problem",
  features: "features",
  howItWorks: "how-it-works",
  diagnostics: "diagnostics",
  openSource: "open-source",
  install: "install",
  faq: "faq",
} as const;

/** Installation commands shown in the how-it-works and install sections. */
export const COMMANDS = {
  installGlobal: "npm install -g @oluwat0s1n/devdoctor",
  installNpx: "npx @oluwat0s1n/devdoctor scan",
  scan: "cdoc scan",
} as const;

/** A single neutral message for every "coming soon" affordance. */
export const COMING_SOON_MESSAGES = {
  github: "The GitHub repository isn’t public yet — it’s coming soon.",
  npm: "The npm package hasn’t been published yet — it’s coming soon.",
  docs: "The documentation isn’t live yet — it’s coming soon.",
  contributing:
    "The contribution guide isn’t published yet — it’s coming soon.",
  security: "The security policy isn’t published yet — it’s coming soon.",
  license: "The LICENSE file will be published with the first release.",
} as const;
