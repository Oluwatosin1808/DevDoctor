import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ExternalAction } from "@/components/ui/ExternalAction";
import { Reveal } from "@/components/ui/Reveal";
import { LINKS } from "@/lib/site";

const TRUST_LINE = ["Open source", "Developer-first", "Local-first"];

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-14 pb-14 sm:pt-[88px] sm:pb-20 lg:pt-[120px]"
    >
      {/* Backdrop: faint engineering grid + a single lime bloom. */}
      <div
        aria-hidden
        className="bg-grid mask-radial pointer-events-none absolute inset-0 -z-10 opacity-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-56 left-1/2 -z-10 h-[520px] w-[min(900px,140%)] -translate-x-1/2 rounded-full bg-accent/8 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-surface"
      />

      <div className="mx-auto w-full max-w-4xl px-5 text-center sm:px-6">
        <Reveal delay={0}>
          <h1
            id="hero-heading"
            className="text-[2.5rem] leading-[1.03] font-medium tracking-[-0.035em] text-balance text-foreground sm:text-6xl lg:text-[4.25rem]"
          >
            Your code deserves a{" "}
            <span className="text-accent">regular checkup</span>.
          </h1>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-6 text-lg font-medium tracking-tight text-foreground sm:text-xl">
            Catch issues before they become problems.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            From exposed secrets to broken configurations, cDoc examines
            your project, finds potential problems and tells you exactly where
            to start fixing them. All from your terminal.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink
              href="#install"
              size="lg"
              className="w-full sm:w-auto"
            >
              Explore cDoc
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>

            <ExternalAction
              linkKey="github"
              href={LINKS.github}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-raised px-5 text-[15px] font-medium tracking-tight text-foreground transition-colors duration-200 hover:border-[#39404a] hover:bg-overlay focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none sm:w-auto"
            >
              View on GitHub
            </ExternalAction>
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.12em] text-dim uppercase">
            {TRUST_LINE.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden className="text-line-strong">
                    ·
                  </span>
                ) : null}
                {item}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
