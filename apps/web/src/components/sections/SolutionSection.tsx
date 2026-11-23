import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/lib/site";

export function SolutionSection() {
  return (
    <Section id={ANCHORS.solution} tone="charcoal">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-end lg:gap-20">
        <SectionHeading
          eyebrow="The shift"
          tone="dark"
          size="large"
          title="One diagnostic pass. A clearer picture of your project."
        />

        <div>
          <Reveal delay={0.06}>
            <p className="max-w-xl text-[16px] leading-8 text-dark-muted">
              cDoc reads the files that describe how your project is configured, then returns a
              structured set of findings with severity, location and a recommended next step.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-dark-muted">
              No score to chase. No dashboard to maintain. Just a read-only diagnosis you can act
              on, in the terminal you already use.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ButtonLink
              href={`#${ANCHORS.howItWorks}`}
              size="lg"
              className="mt-8 w-full sm:w-auto"
            >
              See how it works
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
