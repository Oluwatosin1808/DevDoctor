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
      { label: "Interactive preview", href: `/#${ANCHORS.demo}`, internal: true },
      { label: "Features", href: `/#${ANCHORS.features}`, internal: true },
      { label: "How it works", href: `/#${ANCHORS.howItWorks}`, internal: true },
      { label: "Findings", href: `/#${ANCHORS.findings}`, internal: true },
      { label: "FAQ", href: `/#${ANCHORS.faq}`, internal: true },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", linkKey: "docs", internal: false },
      { label: "GitHub", linkKey: "github", internal: false },
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
  "text-[13px] text-dark-muted transition-colors duration-150 hover:text-lime focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none";

export function SiteFooter() {
  return (
    <footer data-theme="dark" className="border-t border-rule-dark bg-charcoal text-dark-ink">
      <div className="mx-auto w-full max-w-[1152px] px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          <div className="max-w-sm">
            <Logo wordmarkClassName="text-dark-ink" />
            <p className="mt-5 max-w-xs text-sm leading-6 text-dark-ink">
              {SITE.tagline}
            </p>
            <p className="mt-3 text-[13px] leading-6 text-dark-muted">
              Local-first, open-source diagnostics for JavaScript and TypeScript projects.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="font-mono text-[11px] font-medium tracking-[0.16em] text-lime uppercase">
                {column.heading}
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
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
                        showSoonChip={false}
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

        <div className="mt-14 flex flex-col gap-3 border-t border-rule-dark pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-[0.06em] text-dark-muted">
            © {SITE.year} {SITE.name}. MIT licensed.
          </p>
          <p className="font-mono text-[11px] tracking-[0.14em] text-dark-muted uppercase">
            Local-first · Open source · Developer-first
          </p>
        </div>
      </div>
    </footer>
  );
}
