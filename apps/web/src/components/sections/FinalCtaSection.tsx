import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ExternalAction } from "@/components/ui/ExternalAction";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ANCHORS, LINKS } from "@/lib/site";

export function FinalCtaSection() {
  return (
    <Section id={ANCHORS.getStarted} tone="charcoal" padding="py-[72px] sm:py-24 lg:py-28">
      <div className="grid gap-10 border-y border-rule-dark py-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-end lg:gap-20 lg:py-16">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-lime uppercase">
              Start with a read
            </p>
            <h2 className="mt-5 max-w-[18ch] text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.04] font-medium tracking-[-0.04em] text-balance text-dark-ink">
              Know your codebase before it surprises you.
            </h2>
          </Reveal>
        </div>

        <div>
          <Reveal delay={0.08}>
            <p className="max-w-md text-[15px] leading-7 text-dark-muted">
              Run a local diagnostic pass. Read what it found. Decide what to fix next.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href={`#${ANCHORS.howItWorks}`} size="lg" className="w-full sm:w-auto lg:w-full">
                Explore cDoc
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>

              <ExternalAction
                linkKey="github"
                href={LINKS.github}
                showSoonChip={false}
                className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg border border-rule-dark px-5 text-[15px] font-medium text-dark-ink transition-colors duration-150 hover:border-lime focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none sm:w-auto lg:w-full"
              >
                View on GitHub
              </ExternalAction>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
