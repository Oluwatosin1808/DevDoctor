import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/**
 * The headline → supporting copy block repeated by every section.
 */
export function SectionHeading({
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
      <h2 className="text-3xl leading-[1.08] font-medium tracking-[-0.02em] text-balance text-foreground sm:text-4xl lg:text-[2.75rem]">
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
