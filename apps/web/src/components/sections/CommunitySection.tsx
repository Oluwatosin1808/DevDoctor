import { ExternalAction } from "@/components/ui/ExternalAction";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS, LINKS } from "@/lib/site";

export function CommunitySection() {
  return (
    <Section id={ANCHORS.openSource} tone="paper">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
        <SectionHeading
          eyebrow="Open source"
          size="large"
          title="Built in the open. Improved together."
          description="Read the implementation, report what feels wrong, or add a diagnostic check with a clear test and a focused change."
        />

        <Reveal delay={0.08}>
          <div className="border-l-2 border-lime pl-6">
            <p className="text-[15px] leading-7 text-ink/80">
              The repository includes the CLI source, its tests and the site you are reading. The
              diagnostic registry is modular, so a new check can be added without changing the
              runner.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ExternalAction
                linkKey="github"
                href={LINKS.github}
                showSoonChip={false}
                className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-lime px-5 text-sm font-medium text-lime-ink transition-colors duration-150 hover:bg-[#d7f9a5] focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none sm:w-auto"
              >
                View on GitHub
              </ExternalAction>

              <ExternalAction
                linkKey="contributing"
                href={LINKS.contributing}
                showSoonChip={false}
                className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-rule bg-canvas px-5 text-sm font-medium text-ink transition-colors duration-150 hover:border-ink/40 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none sm:w-auto"
              >
                Contributing guide
              </ExternalAction>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
              <span>MIT licensed</span>
              <span>Node 20+</span>
              <span>Zero CLI runtime dependencies</span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
