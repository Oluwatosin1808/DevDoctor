interface LogoProps {
  className?: string;
  /** Renders the wordmark next to the mark. */
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * DevDoctor mark: a terminal-ish rounded tile with an ECG trace through it —
 * the doctor metaphor, kept small enough to sit in a 24px nav slot.
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
        <rect
          x="0.75"
          y="0.75"
          width="22.5"
          height="22.5"
          rx="6.5"
          fill="#0d1107"
          stroke="#B6F36A"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <path
          d="M5 12h3l2-4 3 8 2-4h4"
          stroke="#B6F36A"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showWordmark ? (
        <span
          className={`text-[15px] leading-none font-medium tracking-[-0.03em] text-foreground ${wordmarkClassName}`}
        >
          devdoctor
        </span>
      ) : null}
    </span>
  );
}
