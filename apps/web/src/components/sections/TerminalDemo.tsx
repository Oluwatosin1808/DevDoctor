"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronDown, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import {
  DEMO_CHECKS,
  DEMO_FINDINGS,
  DEMO_PROJECT,
  DEMO_SCRIPT,
  DEMO_SUMMARY,
  REDUCED_MOTION_STATUS,
  type Tone,
} from "@/lib/demo";

type Phase = "idle" | "running" | "complete";

const TONES: Record<Tone, string> = {
  prompt: "text-lime",
  command: "text-dark-ink",
  muted: "text-dark-muted",
  dim: "text-dark-muted/70",
  success: "text-success",
  warning: "text-warning",
  accent: "text-lime",
};

export function TerminalDemo() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [visible, setVisible] = useState(0);
  const [openFinding, setOpenFinding] = useState<string | null>(DEMO_FINDINGS[0].id);

  const total = DEMO_SCRIPT.length;
  const displayPhase: Phase = reduceMotion ? "complete" : phase;
  const shownCount = reduceMotion ? total : visible;
  const progress = Math.round((shownCount / total) * 100);
  const shown = DEMO_SCRIPT.slice(0, shownCount);

  /* Advance one scripted line at a time. No timer runs for reduced motion. */
  useEffect(() => {
    if (phase !== "running" || reduceMotion) return;

    const timer = setTimeout(() => {
      if (visible + 1 >= total) {
        setPhase("complete");
      } else {
        setVisible(visible + 1);
      }
    }, DEMO_SCRIPT[visible].delay);

    return () => clearTimeout(timer);
  }, [phase, visible, reduceMotion, total]);

  function start() {
    setVisible(0);
    setPhase("running");
  }

  function restart() {
    setVisible(0);
    setPhase("running");
  }

  const status =
    displayPhase === "running"
      ? "Illustrative scan running."
      : displayPhase === "complete"
        ? reduceMotion
          ? REDUCED_MOTION_STATUS
          : "Illustrative scan complete. Five checks ran; two findings need attention. No project files were changed."
        : "";

  return (
    <section
      id="demo"
      data-theme="dark"
      aria-labelledby="demo-heading"
      className="bg-charcoal py-[72px] text-dark-ink sm:py-24 lg:py-28"
    >
      <Container>
        <div className="flex flex-col gap-6 border-b border-rule-dark pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-lime uppercase">
              Interactive product preview
            </p>
            <h2 id="demo-heading" className="mt-4 max-w-2xl text-[clamp(1.875rem,3.4vw,2.75rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance">
              A scan that explains itself.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[11px] leading-5 tracking-[0.08em] text-dark-muted uppercase">
            Fictional project: {DEMO_PROJECT.name} · no live scan · no files read
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
          {/* Terminal */}
          <div className="min-w-0 overflow-hidden rounded-xl border border-rule-dark bg-forest">
            <div className="flex h-11 items-center gap-3 border-b border-rule-dark px-4">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2 rounded-full bg-rule-dark" />
                <span className="size-2 rounded-full bg-rule-dark" />
                <span className="size-2 rounded-full bg-rule-dark" />
              </span>
              <span className="scrollbar-slim min-w-0 flex-1 overflow-x-auto font-mono text-[11px] whitespace-nowrap text-dark-muted">
                {DEMO_PROJECT.path}
              </span>
              <span className="rounded-[4px] border border-rule-dark px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-dark-muted uppercase">
                local
              </span>
            </div>

            <div
              role="region"
              aria-label="Illustrative cDoc terminal output"
              className="scrollbar-slim h-[320px] overflow-y-auto px-4 py-5 sm:h-[360px] sm:px-5"
            >
              <div className="font-mono text-[12px] leading-5 sm:text-[13px] sm:leading-6">
                {shown.map((line, index) => (
                  <div
                    key={`${index}-${line.text}`}
                    className={`min-h-5 whitespace-pre-wrap break-words ${TONES[line.tone]}`}
                  >
                    {line.text || "\u00a0"}
                  </div>
                ))}

                {displayPhase === "idle" ? (
                  <div aria-hidden className="flex items-center gap-2 text-dark-muted">
                    <span className="text-lime">›</span>
                    <span className="animate-caret inline-block h-[1.05em] w-[0.55em] bg-lime/80" />
                  </div>
                ) : null}

                {displayPhase === "running" ? (
                  <div aria-hidden className="flex items-center gap-2 text-dark-muted">
                    <span className="text-lime">›</span>
                    <span className="animate-caret inline-block h-[1.05em] w-[0.55em] bg-lime/80" />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-rule-dark px-4 py-3.5 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Illustrative scan progress"
                    className="h-0.5 w-full overflow-hidden bg-rule-dark"
                  >
                    <div className="h-full bg-lime transition-[width] duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p aria-hidden className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-dark-muted tabular">
                    {progress}% · illustrative
                  </p>
                </div>

                {reduceMotion ? (
                  <p className="font-mono text-[10px] tracking-[0.1em] text-dark-muted uppercase">
                    Reduced motion · final report
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={displayPhase === "idle" ? start : restart}
                    disabled={displayPhase === "running"}
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-rule-dark px-3.5 text-[13px] font-medium text-dark-ink transition-colors duration-150 hover:border-lime focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {displayPhase === "running" ? (
                      <>
                        <Play aria-hidden className="size-3.5" />
                        Scanning…
                      </>
                    ) : displayPhase === "complete" ? (
                      <>
                        <RotateCcw aria-hidden className="size-3.5" />
                        Run again
                      </>
                    ) : (
                      <>
                        <Play aria-hidden className="size-3.5" />
                        Start scan
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Report */}
          <div className="min-w-0 rounded-xl border border-rule-dark bg-charcoal">
            <div className="flex items-center justify-between gap-3 border-b border-rule-dark px-5 py-4">
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-lime uppercase">
                Findings / {String(DEMO_FINDINGS.length).padStart(2, "0")}
              </p>
              <p className="font-mono text-[10px] tracking-[0.1em] text-dark-muted uppercase">
                cdoc-{DEMO_PROJECT.name}-0427
              </p>
            </div>

            {displayPhase === "complete" ? (
              <>
                <div className="px-5 py-5">
                  <p className="font-mono text-[12px] text-dark-ink tabular">{DEMO_SUMMARY}</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-dark-muted">
                    Advisory findings. Nothing in the project was changed.
                  </p>
                </div>

                <ul className="border-t border-rule-dark">
                  {DEMO_CHECKS.map((check) => (
                    <li key={check.label} className="flex items-center gap-3 border-b border-rule-dark px-5 py-3">
                      <span aria-hidden className={`w-4 shrink-0 font-mono text-xs ${check.status === "pass" ? "text-dark-muted" : "text-lime"}`}>
                        {check.status === "pass" ? "✓" : "!"}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-dark-ink">{check.label}</span>
                      <span className="font-mono text-[10px] tracking-[0.08em] text-dark-muted uppercase tabular">
                        {check.status === "pass" ? "passed" : "warning"} · {check.count}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="px-5 py-4">
                  <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-dark-muted uppercase">
                    Review a finding
                  </p>
                  <ul className="mt-3 border-t border-rule-dark">
                    {DEMO_FINDINGS.map((finding) => {
                      const open = openFinding === finding.id;
                      return (
                        <li key={finding.id} className="border-b border-rule-dark">
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={`demo-finding-${finding.id}`}
                            onClick={() => setOpenFinding(open ? null : finding.id)}
                            className="flex w-full items-center justify-between gap-3 py-3.5 text-left transition-colors duration-150 hover:text-lime focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none"
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-medium text-dark-ink">
                                {finding.title}
                              </span>
                              <span className="mt-0.5 block truncate font-mono text-[10px] tracking-[0.06em] text-dark-muted">
                                {finding.severity} · {finding.category} · {finding.location}
                              </span>
                            </span>
                            <ChevronDown
                              aria-hidden
                              className={`size-4 shrink-0 text-dark-muted transition-transform duration-200 ${open ? "rotate-180 text-lime" : ""}`}
                            />
                          </button>

                          <div id={`demo-finding-${finding.id}`} hidden={!open} className="pb-5 pr-2">
                            <p className="text-[13px] leading-6 text-dark-muted">{finding.why}</p>
                            <p className="mt-3 text-[13px] leading-6 text-dark-ink">{finding.recommendation}</p>
                            <dl className="mt-4 grid gap-x-4 gap-y-1 border-l-2 border-lime pl-3 font-mono text-[10px] leading-5 text-dark-muted">
                              {finding.evidence.map((item) => (
                                <div key={item} className="flex gap-2">
                                  <dt className="sr-only">Evidence</dt>
                                  <dd className="min-w-0 overflow-x-auto whitespace-nowrap">{item}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex min-h-[320px] flex-col items-start justify-center px-5 py-10">
                <p className="font-mono text-[11px] tracking-[0.14em] text-dark-muted uppercase">
                  {displayPhase === "running" ? "Collecting findings…" : "Report waiting"}
                </p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-dark-muted">
                  {displayPhase === "running"
                    ? "Checks are being illustrated one at a time. The report ledger appears when the preview completes."
                    : "Start the illustrative scan to see how cDoc groups checks, findings and next steps."}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 max-w-3xl font-mono text-[11px] leading-5 text-dark-muted">
          Interactive product preview using fictional data. This is not a live scan of your codebase and does not represent a performance claim.
        </p>

        <p role="status" aria-live="polite" className="sr-only">
          {status}
        </p>
      </Container>
    </section>
  );
}
