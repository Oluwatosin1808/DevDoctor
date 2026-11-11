import { CommandBlock } from "@/components/ui/CommandBlock";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS, COMMANDS } from "@/lib/site";

const STEPS = [
  {
    number: "01",
    title: "Install DevDoctor",
    body: "Add DevDoctor to your development workflow using npm.",
    command: COMMANDS.installGlobal,
    caption: "Installs the CLI globally.",
  },
  {
    number: "02",
    title: "Run your checkup",
    body: "Navigate to your project and let DevDoctor examine its configuration.",
    command: COMMANDS.scan,
    caption: "Scans the project in your current directory.",
  },
  {
    number: "03",
    title: "Review. Fix. Ship.",
    body: "Understand your findings, follow the recommendations and get back to building.",
    command: null,
    caption: null,
  },
] as const;

export function HowItWorksSection() {
  return (
    <Section id={ANCHORS.howItWorks} tone="panel">
      <SectionHeading
        eyebrow="Simple by design"
        title="Three steps to a healthier codebase."
      />

      <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, index) => (
          <li key={step.number} className="relative">
            <Reveal delay={index * 0.09} className="flex h-full flex-col">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[13px] font-medium tracking-[0.16em] text-accent">
                  {step.number}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent"
                />
              </div>

              <h3 className="mt-5 text-lg font-medium tracking-tight text-foreground">
                {step.title}
              </h3>

              {/* `mb-6` keeps the original spacing when the row is too short
                  for `mt-auto` to have any free space to distribute. */}
              <p className="mt-2.5 mb-6 text-sm leading-relaxed text-muted">
                {step.body}
              </p>

              {/* Pinned to the bottom of the column so the command blocks line
                  up across all three steps despite differing copy lengths. */}
              <div className="mt-auto">
                {step.command ? (
                  <CommandBlock
                    command={step.command}
                    caption={step.caption}
                    copyLabel={`Copy step ${step.number} command`}
                  />
                ) : (
                  <p className="font-mono text-[12px] text-dim">
                    No configuration required.
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
