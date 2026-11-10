"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  value: string;
  /** Announced to screen readers, e.g. "Copy install command". */
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

async function writeToClipboard(value: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the legacy path (permission denied, insecure context).
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

/** Copies text to the clipboard and reports the outcome in an aria-live region. */
export function CopyButton({
  value,
  label = "Copy",
  className = "",
  size = "md",
}: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleCopy() {
    const ok = await writeToClipboard(value);
    setStatus(ok ? "copied" : "failed");

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2400);
  }

  const copied = status === "copied";
  const box =
    size === "sm"
      ? "size-8 rounded-md"
      : "size-9 rounded-lg border border-line bg-panel";

  return (
    <span className="relative inline-flex shrink-0 items-center">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${label}: ${value}`}
        className={[
          "inline-flex shrink-0 items-center justify-center transition-colors duration-150",
          "text-dim hover:bg-white/5 hover:text-foreground",
          "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none",
          box,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {copied ? (
          <Check aria-hidden className="size-4 text-accent" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied"
          ? "Copied to clipboard"
          : status === "failed"
            ? "Copy failed — select the text and press Ctrl+C"
            : ""}
      </span>

      {status === "failed" ? (
        <span className="pointer-events-none absolute top-full right-0 z-20 mt-2 w-max rounded-md border border-line bg-overlay px-2.5 py-1.5 font-mono text-[11px] text-muted shadow-lg">
          Press Ctrl+C to copy
        </span>
      ) : null}
    </span>
  );
}
