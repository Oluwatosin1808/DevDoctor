import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  size?: "default" | "large";
  className?: string;
}

/**
 * The eyebrow → headline → supporting copy block repeated across sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  size = "default",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <div
      className={[
        centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? (
        <p
          className={[
            "font-mono text-[11px] font-medium tracking-[0.18em] uppercase",
            dark ? "text-lime" : "text-muted",
          ].join(" ")}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={[
          "font-medium text-balance tracking-[-0.035em]",
          size === "large"
            ? "mt-5 text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.03]"
            : "mt-4 text-[clamp(1.875rem,3.4vw,2.75rem)] leading-[1.08]",
          dark ? "text-dark-ink" : "text-ink",
        ].join(" ")}
      >
        {title}
      </h2>

      {description ? (
        <div
          className={[
            "mt-6 max-w-2xl text-[15px] leading-7 sm:text-base",
            centered ? "mx-auto" : "",
            dark ? "text-dark-muted" : "text-ink/80",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}
