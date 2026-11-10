import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/**
 * The eyebrow → headline → supporting copy block repeated by every section.
 * Eyebrows are set in Geist Mono, uppercase, in the electric lime accent.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={[
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
        {centered ? null : (
          <span aria-hidden className="h-px w-6 shrink-0 bg-accent/50" />
        )}
        <span>{eyebrow}</span>
        {centered ? (
          <span aria-hidden className="h-px w-6 shrink-0 bg-accent/50" />
        ) : null}
      </p>

      <h2 className="mt-4 text-3xl leading-[1.08] font-medium tracking-[-0.02em] text-balance text-foreground sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>

      {description ? (
        <div className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </div>
      ) : null}
    </div>
  );
}
