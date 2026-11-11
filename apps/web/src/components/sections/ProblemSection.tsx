import { Search, Settings, Shield } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/lib/site";

const PROBLEMS = [
  {
    icon: Search,
    title: "Hidden problems",
    body: "Issues quietly sitting in your codebase, waiting for the worst possible moment to show up.",
  },
  {
    icon: Settings,
    title: "Configuration headaches",
    body: "Missing environment variables, incomplete scripts and configurations that don’t quite add up.",
  },
  {
    icon: Shield,
    title: "Security blind spots",
    body: "Sensitive credentials and files that shouldn’t be exposed or committed.",
  },
] as const;

export function ProblemSection() {
  return (
    <Section id={ANCHORS.problem}>
      <SectionHeading
        title="Everything looks fine. Until it doesn’t."
        description={
          <>
            <p>
              A missing environment variable, an exposed API key or an outdated
              dependency can turn an otherwise good project into a frustrating
              debugging session.
            </p>
            <p className="mt-4">
              The problem isn’t always that developers don’t care. Sometimes,
              they simply don’t know what they’re missing.
            </p>
          </>
        }
      />

      <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((problem, index) => {
          const Icon = problem.icon;
          return (
            <li key={problem.title} className="bg-surface">
              <Reveal
                delay={index * 0.08}
                className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-panel sm:p-8"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-raised text-muted transition-colors duration-300 group-hover:border-accent/40 group-hover:text-accent">
                  <Icon aria-hidden className="size-5" />
                </span>

                <h3 className="mt-6 text-base font-medium tracking-tight text-foreground">
                  {problem.title}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {problem.body}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
