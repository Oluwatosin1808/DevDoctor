import { ArrowDown } from "lucide-react";
import { TerminalDemo } from "@/components/sections/TerminalDemo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ExternalAction } from "@/components/ui/ExternalAction";
import { Reveal } from "@/components/ui/Reveal";
import { HERO, LINKS } from "@/lib/site";

export function Hero() {
  return (
    <>
      <section id="top" className="bg-canvas pt-[72px] pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-end lg:gap-16">
            <div>
              <Reveal>
                <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
                  <span aria-hidden className="size-1.5 shrink-0 bg-lime" />
                  {HERO.eyebrow}
                </p>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="mt-7 max-w-[18ch] text-[clamp(2.6rem,6vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.045em] text-balance text-ink">
                  {HERO.headline}
                </h1>
              </Reveal>
            </div>

            <div className="lg:pb-2">
              <Reveal delay={0.12}>
                <p className="max-w-xl text-[17px] leading-8 text-ink/80 sm:text-lg">
                  {HERO.supporting}
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href={`#demo`} size="lg" className="w-full sm:w-auto">
                    {HERO.primaryCta}
                    <ArrowDown aria-hidden className="size-4" />
                  </ButtonLink>

                  <ExternalAction
                    linkKey="github"
                    href={LINKS.github}
                    showSoonChip={false}
                    className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg border border-rule bg-paper px-5 text-[15px] font-medium text-ink transition-colors duration-150 hover:border-ink/40 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none sm:w-auto"
                  >
                    {HERO.secondaryCta}
                  </ExternalAction>
                </div>
              </Reveal>

              <Reveal delay={0.24}>
                <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                  {HERO.labels.join(" · ")}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <TerminalDemo />
    </>
  );
}
