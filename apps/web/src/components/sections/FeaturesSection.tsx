import { Boxes, FileCog, ListChecks, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/lib/site";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Security checks",
    body: "Find potential exposed credentials, suspicious hardcoded secrets and risky file configurations before they become bigger problems.",
    tagline: "Know what’s exposed. Know what needs attention.",
  },
  {
    icon: Boxes,
    title: "Dependency health",
    body: "Examine your project’s dependencies, identify inconsistencies and discover packages that may need attention.",
    tagline: "Keep your dependencies in check.",
  },
  {
    icon: FileCog,
    title: "Environment validation",
    body: "Check environment configuration and spot missing variables or incomplete example files.",
    tagline: "No more guessing what your project needs.",
  },
  {
    icon: ListChecks,
    title: "Project health reports",
    body: "Get an organised overview of your findings, severity levels and recommended next steps.",
    tagline: "Turn scattered problems into a clear action plan.",
  },
] as const;

export function FeaturesSection() {
  return (
    <Section id={ANCHORS.features}>
      <SectionHeading
        eyebrow="What’s under the hood?"
        title="Everything you need to spot the warning signs."
        description="One command. Multiple checks. A clearer picture of your project’s health."
      />

      <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <li key={feature.title} className="bg-surface">
              <Reveal
                delay={(index % 2) * 0.07}
                className="group relative flex h-full flex-col p-7 transition-colors duration-300 hover:bg-panel sm:p-9"
              >
                <span
                  aria-hidden
                  className="absolute top-6 right-6 font-mono text-[11px] tracking-[0.14em] text-dim transition-colors duration-300 group-hover:text-accent/70 sm:top-8 sm:right-9"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-raised text-muted transition-all duration-300 group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent">
                  <Icon aria-hidden className="size-5" />
                </span>

                <h3 className="mt-6 text-lg font-medium tracking-tight text-foreground">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {feature.body}
                </p>

                <p className="mt-6 border-t border-line pt-5 font-mono text-[12px] leading-relaxed text-accent/85">
                  {feature.tagline}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
