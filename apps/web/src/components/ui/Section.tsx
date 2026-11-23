import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Container } from "./Container";

interface SectionProps extends Omit<ComponentPropsWithoutRef<"section">, "className"> {
  /** In-page id — also the smooth-scroll target. */
  id: string;
  children: ReactNode;
  /** Extra vertical padding, e.g. "py-24 sm:py-32". */
  padding?: string;
  /** Surface treatment for the section band. */
  tone?: "canvas" | "paper" | "charcoal" | "forest";
  className?: string;
}

const TONES: Record<NonNullable<SectionProps["tone"]>, string> = {
  canvas: "bg-canvas text-ink",
  paper: "border-y border-rule bg-paper text-ink",
  charcoal: "bg-charcoal text-dark-ink",
  forest: "bg-forest text-dark-ink",
};

export function Section({
  id,
  children,
  padding = "py-[72px] sm:py-24 lg:py-32",
  tone = "canvas",
  className = "",
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      data-theme={tone === "charcoal" || tone === "forest" ? "dark" : undefined}
      className={[TONES[tone], padding, className].filter(Boolean).join(" ")}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}
