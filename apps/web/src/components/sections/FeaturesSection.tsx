import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/lib/site";

interface Feature {
  index: string;
  title: string;
  body: string;
  status: "Available now" | "Foundational" | "Planned";
}

const FEATURES: readonly Feature[] = [
  {
    index: "01",
    title: "Understand the project",
    body:
      "Detects languages, frameworks, runtime and package manager from dependency and script evidence, then reports conflicting lockfiles instead of guessing.",
    status: "Available now",
  },
  {
    index: "02",
    title: "Check configuration",
    body:
      "Confirms the manifest parses, declares the basics, pins a Node engine, defines scripts and includes a TypeScript config when TypeScript sources are present.",
    status: "Available now",
  },
  {
    index: "03",
    title: "Protect the local setup",
    body:
      "Looks at ignore rules, tracked build output and environment-file status. It checks presence and ignore status without ever reading .env contents.",
    status: "Available now",
  },
  {
    index: "04",
    title: "Surface dependency signals",
    body:
      "Requires a lockfile, flags dependency ranges that pin nothing and catches packages declared in both dependencies and devDependencies.",
    status: "Foundational",
  },
  {
    index: "05",
    title: "Go deeper over time",
    body:
      "Richer dependency analysis, framework-specific checks and more detailed security signals are on the roadmap, not shipped in this milestone.",
    status: "Planned",
  },
  {
    index: "06",
    title: "Fit the workflow",
    body:
      "JSON output and --strict already support automation. HTML reports, scan comparisons and CI recipes are planned for a later release.",
    status: "Planned",
  },
];

export function FeaturesSection() {
  return (
    <Section id={ANCHORS.features} tone="canvas">
      <SectionHeading
        eyebrow="Capabilities"
        title="Everything important, under one inspection."
        description="Six areas of attention, clearly separated into what cDoc does today and what is still being built."
      />

      <ul className="mt-14 grid border-t border-rule md:grid-cols-2 md:gap-x-12">
        {FEATURES.map((feature, index) => (
          <li key={feature.index} className="border-b border-rule">
            <Reveal delay={(index % 2) * 0.06} className="grid gap-4 py-7 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
              <span className="font-mono text-[11px] text-muted tabular">{feature.index}</span>
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-lg leading-7 font-medium tracking-[-0.02em] text-ink">
                    {feature.title}
                  </h3>
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase",
                      feature.status === "Planned" ? "text-muted" : "text-ink",
                    ].join(" ")}
                  >
                    {feature.status === "Planned" ? null : (
                      <span aria-hidden className="size-1.5 bg-lime" />
                    )}
                    {feature.status}
                  </span>
                </div>
                <p className="mt-2.5 max-w-xl text-[14px] leading-6 text-ink/75">{feature.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-2xl font-mono text-[11px] leading-5 text-muted">
        cDoc is deterministic and read-only by default. It is not an AI service, a vulnerability
        scanner or a fix tool in this milestone.
      </p>
    </Section>
  );
}
