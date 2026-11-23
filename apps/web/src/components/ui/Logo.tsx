interface LogoProps {
  className?: string;
  /** Renders the wordmark next to the mark. */
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * cDoc mark: a charcoal terminal tile with an ECG trace in the exact lime accent.
 */
export function Logo({
  className = "size-7",
  showWordmark = true,
  wordmarkClassName = "",
}: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="6.5" fill="#101510" stroke="#C5F477" strokeOpacity="0.6" strokeWidth="1.5" />
        <path d="M5 12h3l2-4 3 8 2-4h4" stroke="#C5F477" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {showWordmark ? (
        <span className={`text-base leading-none font-semibold tracking-[-0.03em] ${wordmarkClassName}`}>
          cDoc
        </span>
      ) : null}
    </span>
  );
}
