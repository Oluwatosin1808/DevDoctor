import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Container } from "./Container";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  /** In-page id — also the smooth-scroll target. */
  id: string;
  children: ReactNode;
  /** Extra vertical padding, e.g. "py-24 sm:py-32". */
  padding?: string;
  /** Use the raised panel background instead of the page background. */
  tone?: "base" | "panel";
}

export function Section({
  id,
  children,
  padding = "py-20 sm:py-28",
  tone = "base",
  className = "",
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={[
        "relative w-full",
        padding,
        tone === "panel" ? "bg-panel" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}
