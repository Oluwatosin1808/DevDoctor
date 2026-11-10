import { ExternalAction } from "@/components/ui/ExternalAction";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS, LINKS } from "@/lib/site";

const BADGES = ["MIT licensed", "Community driven", "Open source"];

export function CommunitySection() {
  return (
    <Section id={ANCHORS.openSource} tone="panel">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface px-6 py-14 sm:px-10 sm:py-16 lg:px-16">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[min(640px,120%)] -translate-x-1/2 rounded-full bg-accent/10 blur-[110px]"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Built in the open"
            title="Good tools get better when developers build together."
            description="DevDoctor is open source. Explore the code, report issues, suggest improvements or contribute a diagnostic check of your own."
          />

          <Reveal delay={0.1}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ExternalAction
                linkKey="github"
                href={LINKS.github}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium tracking-tight text-accent-ink shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_8px_24px_-12px_rgba(182,243,106,0.7)] transition-colors duration-200 hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
              >
                Explore GitHub
              </ExternalAction>

              <ExternalAction
                linkKey="contributing"
                href={LINKS.contributing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line-strong bg-raised px-5 text-sm font-medium tracking-tight text-foreground transition-colors duration-200 hover:border-[#39404a] hover:bg-overlay focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
              >
                Read contribution guide
              </ExternalAction>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.12em] text-dim uppercase">
              {BADGES.map((badge, index) => (
                <span key={badge} className="inline-flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden className="text-line-strong">
                      ·
                    </span>
                  ) : null}
                  {badge}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
