import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function FinalCtaSection() {
  return (
    <Section id="get-started" padding="pb-24 sm:pb-32">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-panel px-6 py-16 text-center sm:px-10 sm:py-20">
        <div
          aria-hidden
          className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[min(700px,130%)] -translate-x-1/2 rounded-full bg-accent/12 blur-[120px]"
        />

        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <h2 className="text-3xl leading-[1.08] font-medium tracking-[-0.025em] text-balance text-foreground sm:text-4xl lg:text-[2.75rem]">
              Give your codebase the checkup it deserves.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-5 text-base text-muted sm:text-lg">
              Find the issues. Understand the risks. Build with confidence.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-9 flex justify-center">
              <ButtonLink href="#install" size="lg">
                Run your first checkup
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-dim uppercase">
              Open source. Developer-first. Built for better code.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
