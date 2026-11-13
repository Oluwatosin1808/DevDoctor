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
      "cDoc is an open-source command-line tool that scans JavaScript and TypeScript projects for common security, configuration, dependency and environment issues.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. cDoc runs from your terminal — there is no sign-up, no dashboard to log into and no API key to manage.",
  },
  {
    question: "Does cDoc modify my code?",
    answer:
      "No. cDoc reports what it finds and explains what to look at. It never rewrites files on your behalf, so nothing in your project changes unless you decide to act on a recommendation.",
  },
  {
    question: "Which frameworks does it support?",
    answer:
      "cDoc works at the project level rather than per framework: it reads your package.json, configuration files and environment examples. That keeps it framework-agnostic across JavaScript and TypeScript projects instead of tying it to one stack.",
  },
  {
    question: "Does cDoc send my source code anywhere?",
    answer:
      "No. Diagnostics run locally on your machine. Your source code is not uploaded and is not sent to an AI service. Any check that needs the network will be explicitly opt-in and clearly labelled.",
  },
  {
    question: "Is cDoc free?",
    answer:
      "Yes. cDoc is open source and released under the MIT License. Use it on as many projects as you like.",
  },
  {
    question: "Can I use cDoc in CI/CD?",
    answer:
      "cDoc is built to run non-interactively, which makes it a natural fit for a pipeline. Step-by-step CI/CD recipes will ship with the public documentation, which isn’t live yet.",
  },
] as const;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id={ANCHORS.faq}>
      <SectionHeading
        title="Before you run your first checkup."
      />

      <div className="mt-12 max-w-3xl">
        <ul className="divide-y divide-line border-y border-line">
          {FAQS.map((item, index) => {
            const open = openIndex === index;
            const buttonId = `faq-button-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <li key={item.question}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-surface focus-visible:outline-none"
                  >
                    <span
                      className={[
                        "text-[15px] font-medium tracking-tight transition-colors duration-150 sm:text-base",
                        open ? "text-foreground" : "text-foreground/85",
                      ].join(" ")}
                    >
                      {item.question}
                    </span>

                    <ChevronDown
                      aria-hidden
                      className={[
                        "size-4.5 shrink-0 text-dim transition-transform duration-300 group-hover:text-accent",
                        open ? "rotate-180 text-accent" : "",
                      ].join(" ")}
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!open}
                  className={[
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pr-8 pb-5 text-sm leading-relaxed text-muted">
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
