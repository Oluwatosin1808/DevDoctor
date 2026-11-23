import { CommandBlock } from "@/components/ui/CommandBlock";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS, COMMANDS } from "@/lib/site";

const STEPS = [
  {
    number: "01",
    title: "Start from the checkout",
    body:
      "Clone the repository, install workspace dependencies and build the CLI. There is no npm install claim or account to create.",
    command: COMMANDS.startFromSource,
    caption: "Run once from a directory of your choice.",
  },
  {
    number: "02",
    title: "Point it at a project",
    body:
      "Run the binary against any JavaScript or TypeScript project. Add a path to scan a different directory.",
    command: COMMANDS.scan,
    caption: "Read-only by default. No source code is uploaded.",
  },
  {
    number: "03",
    title: "Read the ledger",
    body:
      "Review checks, findings and recommended next steps. Decide what deserves attention; cDoc never rewrites your files.",
    command: null,
    caption: null,
  },
] as const;

export function HowItWorksSection() {
  return (
    <Section id={ANCHORS.howItWorks} tone="forest">
      <SectionHeading
        eyebrow="How it works"
        tone="dark"
        title="From unfamiliar codebase to informed decisions."
        description="Three steps, one local command, and a report you can read without a dashboard."
      />

      <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, index) => (
          <li key={step.number} className="min-w-0 border-t border-rule-dark pt-6">
            <Reveal delay={index * 0.06} className="flex h-full flex-col">
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-lime tabular">
                {step.number}
              </p>
              <h3 className="mt-5 text-lg leading-7 font-medium tracking-[-0.02em] text-dark-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 mb-6 text-[14px] leading-6 text-dark-muted">{step.body}</p>

              <div className="mt-auto min-w-0">
                {step.command ? (
                  <CommandBlock
                    command={step.command}
                    caption={step.caption ?? undefined}
                    copyLabel={`Copy step ${step.number} command`}
                    tone="dark"
                  />
                ) : (
                  <p className="font-mono text-[11px] tracking-[0.06em] text-dark-muted uppercase">
                    Findings, not prescriptions.
                  </p>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
