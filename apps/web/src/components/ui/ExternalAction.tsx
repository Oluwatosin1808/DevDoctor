"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { COMING_SOON_MESSAGES, type ExternalLinks } from "@/lib/site";

type LinkKey = keyof ExternalLinks;

interface ExternalActionProps {
  linkKey: LinkKey;
  /** `null` renders the coming-soon state instead of a link. */
  href: string | null;
  children: ReactNode;
  className?: string;
  /** Hide the visible "soon" chip (e.g. in dense layouts that use `title`). */
  showSoonChip?: boolean;
  iconClassName?: string;
  /** Hide the fixed toast and rely on the visible chip + live region only. */
  quiet?: boolean;
}

const TOAST_DURATION = 4200;

/**
 * Renders a real external link when the destination exists, and an explicit,
 * keyboard-reachable "coming soon" control when it does not.
 *
 * The repository and npm package are not public yet, so every external URL in
 * `lib/site.ts` is currently `null` — this keeps the site honest instead of
 * shipping links that 404.
 */
export function ExternalAction({
  linkKey,
  href,
  children,
  className = "",
  showSoonChip = true,
  iconClassName = "size-3.5",
  quiet = false,
}: ExternalActionProps) {
  const noteId = useId();
  const [toast, setToast] = useState(false);
  const message = COMING_SOON_MESSAGES[linkKey];

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(false), TOAST_DURATION);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setToast(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [toast]);

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
        aria-describedby={noteId}
      >
        {children}
        <ArrowUpRight aria-hidden className={iconClassName} />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <>
      {/* The wrapper is inline-*block* on purpose: an inline-flex wrapper would
          blockify the button into a flex item and collapse it to min-content,
          wrapping the label, icon and chip onto separate lines. */}
      <span className="relative inline-block align-middle">
        <button
          type="button"
          onClick={() => setToast((current) => !current)}
          aria-describedby={noteId}
          className={`${className} inline-flex items-center gap-1.5 text-left`}
        >
          {children}
          <ArrowUpRight aria-hidden className={iconClassName} />
          {showSoonChip ? (
            <span
              aria-hidden
              className="ml-0.5 rounded-[4px] border border-line-strong bg-overlay px-1 py-px font-mono text-[9px] leading-[1.4] font-medium tracking-[0.1em] text-dim uppercase"
            >
              soon
            </span>
          ) : null}
        </button>
      </span>

      {/* Announced politely whether or not the visual toast is shown. */}
      <span id={noteId} role="status" aria-live="polite" className="sr-only">
        {toast ? message : `${message} Activation disabled.`}
      </span>

      {/* Portalled to <body> so it can never be clipped by an animated ancestor.
          Only reachable after a click, so `document` always exists here. */}
      {toast && !quiet
        ? createPortal(
            <span
              className="fixed bottom-6 left-1/2 z-[100] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-start gap-2.5 rounded-xl border border-line-strong bg-overlay px-4 py-3 text-left shadow-[0_16px_48px_-16px_rgba(0,0,0,0.9)]"
              aria-hidden
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-sm leading-snug text-muted">{message}</span>
            </span>,
            document.body,
          )
        : null}
    </>
  );
}
