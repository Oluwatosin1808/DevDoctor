"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { COMING_SOON_MESSAGES, type ExternalLinks } from "@/lib/site";

type LinkKey = keyof ExternalLinks;

interface ExternalActionProps {
  linkKey: LinkKey;
  /** `null` renders an explicit unavailable state instead of a fake link. */
  href: string | null;
  children: ReactNode;
  className?: string;
  showSoonChip?: boolean;
  iconClassName?: string;
  quiet?: boolean;
  onClick?: () => void;
}

const TOAST_DURATION = 4200;

/**
 * Resolves a destination from `lib/site.ts` into a real control.
 *
 * - Internal paths use `next/link`.
 * - Absolute URLs open in a new tab with an external-link affordance.
 * - A `null` destination is a keyboard-reachable unavailable control.
 */
export function ExternalAction({
  linkKey,
  href,
  children,
  className = "",
  showSoonChip = true,
  iconClassName = "size-3.5",
  quiet = false,
  onClick,
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
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={className} onClick={onClick}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
        onClick={onClick}
      >
        {children}
        <ArrowUpRight aria-hidden className={`inline-block ${iconClassName}`} />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <>
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
            <span aria-hidden className="ml-0.5 rounded-[4px] border border-current px-1 py-px font-mono text-[9px] leading-[1.4] font-medium tracking-[0.1em] uppercase opacity-70">
              soon
            </span>
          ) : null}
        </button>
      </span>

      <span id={noteId} role="status" aria-live="polite" className="sr-only">
        {toast ? message : `${message} Activation disabled.`}
      </span>

      {toast && !quiet
        ? createPortal(
            <span className="fixed bottom-6 left-1/2 z-[100] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-start gap-2.5 rounded-lg border border-lime/40 bg-charcoal px-4 py-3 text-left text-dark-ink">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" />
              <span className="text-sm leading-snug">{message}</span>
            </span>,
            document.body,
          )
        : null}
    </>
  );
}
