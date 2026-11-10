"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

type Tone = "prompt" | "muted" | "dim" | "success" | "warning" | "accent";

interface ScriptLine {
  text: string;
  tone: Tone;
  /** Milliseconds to wait before this line is revealed. */
  delay: number;
}

const TONES: Record<Tone, string> = {
  prompt: "text-foreground",
  muted: "text-muted",
  dim: "text-dim",
  success: "text-success",
  warning: "text-warning",
  accent: "text-accent",
};

const SCRIPT: ScriptLine[] = [
  { text: "$ devdoctor scan", tone: "prompt", delay: 260 },
  { text: "Scanning ./acme-web", tone: "muted", delay: 520 },
  { text: "▸ Reading project configuration", tone: "dim", delay: 460 },
  { text: "▸ Checking dependencies", tone: "dim", delay: 440 },
  { text: "▸ Validating environment variables", tone: "dim", delay: 480 },
  { text: "▸ Reviewing git configuration", tone: "dim", delay: 440 },
  { text: "▸ Running security checks", tone: "dim", delay: 520 },
  { text: "", tone: "dim", delay: 240 },
  { text: "✓ Project configuration", tone: "success", delay: 320 },
  { text: "✓ Dependencies", tone: "success", delay: 300 },
  { text: "⚠ Environment variables", tone: "warning", delay: 340 },
  { text: "⚠ Git configuration", tone: "warning", delay: 300 },
  { text: "✓ Security checks", tone: "success", delay: 340 },
  { text: "", tone: "dim", delay: 220 },
  { text: "Scan complete — 2 findings need attention.", tone: "accent", delay: 460 },
  { text: "Run `devdoctor report` for the full breakdown.", tone: "muted", delay: 420 },
];

const REDUCED_MOTION_STATUS =
  "Scan complete. Two findings need attention: environment variables and git configuration.";

/**
 * A simulated, self-running CLI scan. It starts when the terminal scrolls into
 * view, can be replayed with the keyboard, and renders instantly for visitors
 * who prefer reduced motion.
 */
export function TerminalDemo() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });

  const [visible, setVisible] = useState(0);

  const total = SCRIPT.length;

  // Everything below is derived, so no effect ever has to setState on mount:
  // reduced motion renders the finished transcript immediately, and the run
  // starts on its own the first time the terminal scrolls into view.
  const shownCount = reduceMotion ? total : visible;
  const running = inView && !reduceMotion && shownCount < total;
  const done = shownCount >= total;

  // Advances the transcript one line at a time. setState happens inside the
  // timeout callback, never synchronously in the effect body.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => setVisible((current) => current + 1),
      SCRIPT[shownCount].delay,
    );
    return () => clearTimeout(timer);
  }, [running, shownCount]);

  function restart() {
    setVisible(0);
  }

  const progress = Math.round((shownCount / total) * 100);
  const shown = SCRIPT.slice(0, shownCount);

  return (
    <section
      aria-labelledby="terminal-heading"
      className="relative pb-4 sm:pb-8"
      ref={containerRef}
    >
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
              Live demo
            </p>
            <h2
              id="terminal-heading"
              className="mt-4 text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl"
            >
              One command. Real output.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_32px_80px_-40px_rgba(0,0,0,0.9)]">
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-line bg-raised px-4 py-3">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#2b3038]" />
                <span className="size-2.5 rounded-full bg-[#2b3038]" />
                <span className="size-2.5 rounded-full bg-[#2b3038]" />
              </span>

              <span className="scrollbar-slim min-w-0 flex-1 overflow-x-auto font-mono text-[11px] whitespace-nowrap text-dim">
                ~/projects/acme-web — devdoctor scan
              </span>

              <span className="hidden rounded-[4px] border border-line-strong bg-overlay px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-dim uppercase sm:inline">
                interactive
              </span>
            </div>

            {/* Output */}
            <div
              role="region"
              aria-label="Simulated DevDoctor terminal output"
              className="scrollbar-slim h-[340px] overflow-y-auto px-4 py-4 sm:h-[366px] sm:px-5"
            >
              <div className="font-mono text-[13px] leading-[1.85] sm:text-sm">
                {shown.map((line, index) => (
                  <motion.div
                    key={`${index}-${line.text}`}
                    initial={reduceMotion ? false : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className={`min-h-[1.85em] whitespace-pre-wrap ${TONES[line.tone]}`}
                  >
                    {line.text || " "}
                  </motion.div>
                ))}

                {running ? (
                  <div className="flex items-center gap-2 text-dim" aria-hidden>
                    <span className="text-accent">›</span>
                    <span className="animate-caret inline-block h-[1.05em] w-[0.55em] bg-accent/70" />
                  </div>
                ) : null}
              </div>
            </div>

            {/* Controls */}
            <div className="border-t border-line bg-raised px-4 py-3.5 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    aria-hidden
                    className="h-1 w-full max-w-40 overflow-hidden rounded-full bg-line"
                  >
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] whitespace-nowrap text-dim tabular-nums">
                    {progress}%
                  </span>
                </div>

                {/* With reduced motion the transcript is already complete, so a
                    replay control would be a dead button — leave it out. */}
                {reduceMotion ? null : (
                  <button
                    type="button"
                    onClick={restart}
                    disabled={running}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-line-strong bg-overlay px-3.5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:border-[#39404a] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
                  >
                    {running ? (
                      <>
                        <Play aria-hidden className="size-3.5" />
                        Scanning…
                      </>
                    ) : shownCount > 0 ? (
                      <>
                        <RotateCcw aria-hidden className="size-3.5" />
                        Run again
                      </>
                    ) : (
                      <>
                        <Play aria-hidden className="size-3.5" />
                        Run scan
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[13px] leading-relaxed text-dim">
            Illustrative terminal output. Actual results will depend on the
            project scanned and checks implemented.
          </p>
        </Reveal>

        <p role="status" aria-live="polite" className="sr-only">
          {reduceMotion
            ? REDUCED_MOTION_STATUS
            : running
              ? "DevDoctor scan running."
              : done
                ? "DevDoctor scan complete. Two findings need attention."
                : ""}
        </p>
      </Container>
    </section>
  );
}
