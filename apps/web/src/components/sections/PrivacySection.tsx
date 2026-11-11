import { Ban, FileX, HardDrive } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const POINTS = [
  {
    icon: Ban,
    title: "No account required.",
    body: "No sign-up, no dashboard, no API key to manage.",
  },
  {
    icon: HardDrive,
    title: "Local-first diagnostics.",
    body: "Scans run on your machine, against your files.",
  },
  {
    icon: FileX,
    title: "No automatic file modifications.",
    body: "DevDoctor reports. You decide what changes.",
  },
] as const;

export function PrivacySection() {
  return (
    <Section id="privacy">
      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:p-12">
          <SectionHeading
            title="Your codebase isn’t ours to collect."
            description={
              <>
                <p>
                  DevDoctor is designed to run locally. Your project files stay
                  on your machine, and the initial diagnostic experience
                  doesn’t require an account or send your source code to an AI
                  service.
                </p>
                <p className="mt-4">
                  You stay in control of what gets scanned, what gets reported
                  and what gets changed.
                </p>
              </>
            }
          />

          <ul className="flex flex-col gap-3 lg:justify-center">
            {POINTS.map((point, index) => {
              const Icon = point.icon;
              return (
                <li key={point.title}>
                  <Reveal
                    delay={index * 0.07}
                    className="flex items-start gap-3.5 rounded-xl border border-line bg-surface px-4 py-4"
                  >
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {point.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">
                        {point.body}
                      </span>
                    </span>
                  </Reveal>
                </li>
              );
            })}

            <li className="pt-1 pl-1">
              <p className="font-mono text-[11px] leading-relaxed text-dim">
                Network-dependent checks will be explicitly opt-in.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
