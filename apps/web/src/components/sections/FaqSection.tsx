"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/lib/site";

const FAQS = [
  {
    question: "What exactly is cDoc?",
    answer:
      "cDoc is a local-first, open-source command-line tool that reads JavaScript and TypeScript projects and reports configuration, dependency, environment, Git and basic security signals.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. A local scan needs no sign-up, no dashboard, no API key and no AI service. You run the CLI from your own machine.",
  },
  {
    question: "Does cDoc modify my code?",
    answer:
      "No. cDoc is read-only by default. It reports findings and recommended next steps; it never rewrites your files or applies fixes for you.",
  },
  {
    question: "Which frameworks does it support?",
    answer:
      "Detection uses dependency and script evidence to recognise React, Next.js, Vue, Angular, Vite, Express and Node.js. Configuration files alone are not treated as proof that a framework is used.",
  },
  {
    question: "Does cDoc send my source code anywhere?",
    answer:
      "No. Source code, file paths and findings are not uploaded. Optional network-dependent checks may query public package or vulnerability data, but they are explicit and opt-in. Anonymous usage counters are also opt-in and require an endpoint you control.",
  },
  {
    question: "Is cDoc free?",
    answer:
      "Yes. cDoc is MIT licensed and open source. The CLI is run from this repository's checkout; there is no npm install claim on this site.",
  },
  {
    question: "Can I use cDoc in CI/CD?",
    answer:
      "The CLI emits JSON with --json, exits non-zero on errors and supports --strict for warnings. Full CI recipes are planned documentation, not shipped in this milestone.",
  },
] as const;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id={ANCHORS.faq} tone="canvas">
      <SectionHeading
        eyebrow="Questions"
        title="Before you run your first diagnostic pass."
        description="The practical answers, without the marketing gloss."
      />

      <div className="mt-12 max-w-3xl">
        <ul className="border-t border-rule">
          {FAQS.map((item, index) => {
            const open = openIndex === index;
            const buttonId = `faq-button-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <li key={item.question} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="group flex w-full items-start gap-4 py-5 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none sm:gap-6"
                  >
                    <span className="hidden pt-1 font-mono text-[11px] text-muted tabular sm:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] leading-6 font-medium tracking-[-0.01em] text-ink sm:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={`mt-0.5 size-4 shrink-0 text-muted transition-transform duration-200 group-hover:text-ink ${
                        open ? "rotate-180 text-ink" : ""
                      }`}
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!open}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl border-l-2 border-lime py-1 pl-4 pb-6 text-[14px] leading-6 text-ink/75 sm:ml-10">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
