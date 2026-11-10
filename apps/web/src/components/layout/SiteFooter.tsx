import { ExternalAction } from "@/components/ui/ExternalAction";
import { Logo } from "@/components/ui/Logo";
import { ANCHORS, LINKS, SITE } from "@/lib/site";

interface FooterColumn {
  heading: string;
  links: Array<
    | { label: string; href: string; internal: true }
    | { label: string; linkKey: keyof typeof LINKS; internal: false }
  >;
}

const COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: `#${ANCHORS.features}`, internal: true },
      { label: "How it works", href: `#${ANCHORS.howItWorks}`, internal: true },
      { label: "Diagnostics", href: `#${ANCHORS.diagnostics}`, internal: true },
      { label: "FAQ", href: `#${ANCHORS.faq}`, internal: true },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", linkKey: "docs", internal: false },
      { label: "GitHub", linkKey: "github", internal: false },
      { label: "npm", linkKey: "npm", internal: false },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "Contributing", linkKey: "contributing", internal: false },
      { label: "Security", linkKey: "security", internal: false },
      { label: "License", linkKey: "license", internal: false },
    ],
  },
];

const LINK_CLASS =
  "text-sm text-muted transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          {/* Brand */}
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm font-medium text-foreground">
              Your project&apos;s health, one scan at a time.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-dim">
              A developer-first diagnostic CLI helping you identify issues,
              improve configurations and build healthier software.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="font-mono text-[11px] font-medium tracking-[0.16em] text-dim uppercase">
                {column.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.internal ? (
                      <a href={link.href} className={LINK_CLASS}>
                        {link.label}
                      </a>
                    ) : (
                      <ExternalAction
                        linkKey={link.linkKey}
                        href={LINKS[link.linkKey]}
                        className={LINK_CLASS}
                      >
                        {link.label}
                      </ExternalAction>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-[0.06em] text-dim">
            Copyright © {SITE.year} {SITE.name}. Released under the MIT License.
          </p>
          <p className="font-mono text-[11px] tracking-[0.14em] text-dim uppercase">
            MIT licensed · Community driven · Open source
          </p>
        </div>
      </div>
    </footer>
  );
}
