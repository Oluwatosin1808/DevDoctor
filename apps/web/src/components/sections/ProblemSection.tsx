import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/lib/site";

const PROBLEMS = [
  {
    index: "01",
    label: "Hidden risks",
    title: "A clean build can hide a committed secret.",
    body:
      "Tests and linters answer useful questions. They do not tell you whether a credential-shaped string slipped into a tracked file.",
  },
  {
    index: "02",
    label: "Configuration gaps",
    title: "The setup works until one variable is missing.",
    body:
      "Environment files, scripts and manifests drift apart. cDoc checks the boring details that are easy to miss in review.",
  },
  {
    index: "03",
    label: "Dependency problems",
    title: "A familiar dependency can still be a weak signal.",
    body:
      "Missing lockfiles, unpinned ranges and duplicated packages are small clues that add up to fragile installs.",
  },
] as const;

export function ProblemSection() {
  return (
    <Section id={ANCHORS.problem} tone="paper">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <SectionHeading
          eyebrow="The problem"
          title="Your project can look healthy and still have problems."
          description={
            <>
              <p>
                A passing test suite tells you the code runs right now. It does not tell you what is
                undocumented, misconfigured or quietly risky.
              </p>
              <p className="mt-4">
                Those issues rarely announce themselves. They surface during setup, in review, or at
                the worst possible moment.
              </p>
            </>
          }
        />

        <ul className="border-t border-rule">
          {PROBLEMS.map((problem, index) => (
            <li key={problem.index} className="border-b border-rule">
              <Reveal delay={index * 0.06} className="grid gap-4 py-7 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
                <span className="font-mono text-[11px] tracking-[0.14em] text-muted tabular">
                  {problem.index}
                </span>
                <div>
                  <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
                    {problem.label}
                  </p>
                  <h3 className="mt-2 text-lg leading-7 font-medium tracking-[-0.02em] text-ink">
                    {problem.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[14px] leading-6 text-ink/75">{problem.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
