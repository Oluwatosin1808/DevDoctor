/**
 * Central site configuration.
 *
 * Everything a template or component needs to know about DevDoctor lives here so
 * copy stays consistent and URLs only ever have to be updated in one place.
 */

export const SITE = {
  name: "DevDoctor",
  /** Lowercase wordmark used in the navigation and footer. */
  wordmark: "devdoctor",
  tagline: "Your code deserves a regular checkup.",
  shortDescription:
    "DevDoctor is an open-source command-line tool that examines JavaScript and TypeScript projects for security, configuration, dependency and environment issues.",
  description:
    "Catch issues before they become problems. DevDoctor examines your project, finds potential problems and tells you exactly where to start fixing them — all from your terminal.",
  /** PLACEHOLDER: replace with the production domain once the site is deployed. */
  url: "https://devdoctor.example.com",
  locale: "en_US",
  year: 2026,
} as const;

/**
 * External destinations.
 *
 * PLACEHOLDER: every value below is `null` on purpose. The GitHub repository and
 * the npm package are not public yet, so components render an explicit
 * "coming soon" state instead of linking to a URL that would 404.
 *
 * To go live, replace the relevant `null` with the real absolute URL, e.g.
 *   github: "https://github.com/<your-org>/devdoctor"
 * and the components will automatically switch to normal external links.
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
  github: null,
  npm: null,
  docs: null,
  contributing: null,
  security: null,
  license: null,
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
  installGlobal: "npm install -g devdoctor",
  installNpx: "npx devdoctor scan",
  scan: "devdoctor scan",
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
