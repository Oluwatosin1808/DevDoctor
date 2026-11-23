import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/lib/site";

const POINTS = [
  {
    index: "01",
    title: "Local by default",
    body: "Diagnostics run on your machine against files you choose. No account, dashboard or AI key is needed for a local scan.",
  },
  {
    index: "02",
    title: "Read-only by design",
    body: "cDoc reports findings and recommended next steps. It does not rewrite your source files or apply fixes for you.",
  },
  {
    index: "03",
    title: "No source-code uploads",
    body: "Source code, file paths and findings are not uploaded. Credential-shaped text is redacted before it reaches a report.",
  },
  {
    index: "04",
    title: "Opt-in connections only",
    body: "Optional, network-dependent checks may query public package or vulnerability data. They will be explicit and opt-in; none are required for a local scan.",
  },
] as const;

export function PrivacySection() {
  return (
    <Section id={ANCHORS.privacy} tone="forest">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <SectionHeading
          eyebrow="Privacy and control"
          tone="dark"
          size="large"
          title="Your code stays yours."
          description="Local-first is not a slogan here. The default path keeps the scan, the findings and the decisions on your machine."
        />

        <ul className="border-t border-rule-dark">
          {POINTS.map((point, index) => (
            <li key={point.index} className="border-b border-rule-dark">
              <Reveal delay={index * 0.05} className="grid gap-3 py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
                <span className="font-mono text-[11px] text-lime tabular">{point.index}</span>
                <div>
                  <h3 className="text-[17px] leading-7 font-medium tracking-[-0.02em] text-dark-ink">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-[14px] leading-6 text-dark-muted">{point.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 max-w-3xl font-mono text-[11px] leading-5 text-dark-muted">
        Anonymous usage counters exist but are strictly opt-in and require an endpoint you control.
        No collector is shipped with cDoc.
      </p>
    </Section>
  );
}
