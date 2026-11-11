import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/lib/site";

export function SolutionSection() {
  return (
    <Section id="solution" tone="panel" padding="py-20 sm:py-28">
      <div className="relative">
        {/* Quiet accent bloom behind the heading. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(720px,120%)] -translate-x-1/2 rounded-full bg-accent/8 blur-[110px]"
        />

        <div className="relative">
          <SectionHeading
            align="center"
            title={
              <>
                Meet DevDoctor. Your project&apos;s{" "}
                <span className="text-accent">first line of diagnosis</span>.
              </>
            }
            description={
              <>
                <p>
                  DevDoctor gives your codebase a structured health check without
                  making you dig through dozens of files manually.
                </p>
                <p className="mt-4">
                  Run a scan, see what needs attention and get practical
                  recommendations to help you fix it.
                </p>
              </>
            }
          />

          <Reveal delay={0.12} className="mt-9 flex justify-center">
            <ButtonLink href={`#${ANCHORS.howItWorks}`} size="lg">
              See how it works
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
