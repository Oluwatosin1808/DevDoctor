import { CircleCheck, TriangleExclamationPoint } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MeterBar } from "@/components/ui/MeterBar";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/lib/site";

const CHECKS = [
  { label: "Project configuration", status: "pass" },
  { label: "Dependencies", status: "pass" },
  { label: "Environment variables", status: "warn" },
  { label: "Git configuration", status: "warn" },
  { label: "Security checks", status: "pass" },
] as const;

const HEALTH_SCORE = 86;

function ReportPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_32px_80px_-48px_rgba(0,0,0,0.95)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-raised px-5 py-3.5">
        <span className="flex items-center gap-2.5 font-mono text-[11px] font-medium tracking-[0.16em] text-accent uppercase">
          <span
            aria-hidden
            className="animate-pulse-dot size-1.5 rounded-full bg-accent"
          />
          Scan complete
        </span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-dim uppercase">
          devdoctor
        </span>
      </div>

      {/* Score */}
      <div className="px-5 pt-6 pb-5 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.14em] text-dim uppercase">
          Project health
        </p>

        <div className="mt-2.5 flex items-end gap-1.5">
          <span className="text-5xl leading-none font-medium tracking-[-0.04em] text-foreground tabular-nums">
            {HEALTH_SCORE}
          </span>
          <span className="pb-1.5 text-lg leading-none text-dim tabular-nums">
            /100
          </span>
        </div>

        <MeterBar
          value={HEALTH_SCORE}
          label={`Project health score: ${HEALTH_SCORE} out of 100`}
          className="mt-5"
        />
      </div>

      {/* Checks */}
      <ul className="divide-y divide-line border-t border-line">
        {CHECKS.map((check) => {
          const passing = check.status === "pass";
          return (
            <li
              key={check.label}
              className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
            >
              {passing ? (
                <CircleCheck
                  aria-hidden
                  className="size-4 shrink-0 text-success"
                />
              ) : (
                <TriangleExclamationPoint
                  aria-hidden
                  className="size-4 shrink-0 text-warning"
                />
              )}
              <span className="min-w-0 flex-1 text-sm text-foreground">
                {check.label}
              </span>
              <span
                className={[
                  "font-mono text-[11px] tracking-[0.1em] uppercase",
                  passing ? "text-dim" : "text-warning",
                ].join(" ")}
              >
                {passing ? "passed" : "attention"}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="border-t border-line bg-raised px-5 py-4 sm:px-6">
        <p className="text-sm font-medium text-foreground">
          2 findings need attention.
        </p>
        <p className="mt-1 text-sm text-muted">Your next steps are ready.</p>
      </div>
    </div>
  );
}

export function DiagnosticShowcase() {
  return (
    <section id={ANCHORS.diagnostics} className="py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              title="No more digging around. Just clear answers."
              description={
                <>
                  <p>
                    DevDoctor doesn’t just flag problems. It helps you
                    understand what went wrong, where to look and what to do
                    next.
                  </p>
                  <p className="mt-4 text-sm text-dim">
                    Illustrative terminal output. Actual results will depend on
                    the project scanned and checks implemented.
                  </p>
                </>
              }
            />
          </div>

          <Reveal delay={0.1}>
            <ReportPanel />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
