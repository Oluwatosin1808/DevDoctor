import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DEMO_FINDINGS, DEMO_PROJECT } from "@/lib/demo";
import { ANCHORS } from "@/lib/site";

const FINDING = DEMO_FINDINGS[0];

export function DiagnosticShowcase() {
  return (
    <section id={ANCHORS.findings} data-theme="dark" className="bg-charcoal py-[72px] text-dark-ink sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Inside a finding"
              tone="dark"
              title="A finding should feel like a next step, not a riddle."
              description={
                <>
                  <p>
                    Every finding carries a severity, a category, a location and a recommendation.
                    You get the context needed to judge it, not just a red flag.
                  </p>
                  <p className="mt-4 font-mono text-[11px] leading-5 text-dark-muted">
                    Illustrative finding from fictional project {DEMO_PROJECT.name}. Not a live result.
                  </p>
                </>
              }
            />
          </div>

          <Reveal delay={0.08}>
            <article className="rounded-xl border border-rule-dark bg-forest" aria-label="Sample diagnostic finding">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule-dark px-5 py-4">
                <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-lime uppercase">
                  {FINDING.severity} / {FINDING.category}
                </p>
                <p className="font-mono text-[10px] tracking-[0.1em] text-dark-muted uppercase">
                  confidence: {FINDING.confidence}
                </p>
              </header>

              <div className="px-5 py-6 sm:px-6">
                <h3 className="text-xl leading-8 font-medium tracking-[-0.025em] text-dark-ink">
                  {FINDING.title}
                </h3>
                <p className="mt-2 font-mono text-[11px] text-dark-muted">{FINDING.location}</p>

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-dark-muted uppercase">
                      Why it matters
                    </p>
                    <p className="mt-2 text-[14px] leading-6 text-dark-muted">{FINDING.why}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-dark-muted uppercase">
                      Recommended next step
                    </p>
                    <p className="mt-2 text-[14px] leading-6 text-dark-ink">{FINDING.recommendation}</p>
                  </div>
                </div>

                <div className="mt-7 border-t border-rule-dark pt-5">
                  <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-dark-muted uppercase">
                    Evidence collected
                  </p>
                  <dl className="mt-3 grid gap-x-8 gap-y-1 border-l-2 border-lime pl-4 font-mono text-[11px] leading-6 text-dark-muted sm:grid-cols-2">
                    {FINDING.evidence.map((item) => (
                      <div key={item} className="flex gap-2">
                        <dt className="sr-only">Evidence</dt>
                        <dd className="min-w-0 overflow-x-auto whitespace-nowrap">{item}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <p className="mt-6 border-t border-rule-dark pt-4 font-mono text-[11px] leading-5 text-dark-muted">
                  cDoc reports. You decide what changes.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
