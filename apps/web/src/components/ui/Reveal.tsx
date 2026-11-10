"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  span: motion.span,
};

type MotionTag = keyof typeof MOTION_TAGS;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating — use for staggered grids. */
  delay?: number;
  /** Vertical offset in px. */
  y?: number;
  duration?: number;
  as?: MotionTag;
}

/**
 * Fades and lifts content into place once it enters the viewport.
 * Animations are skipped entirely when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  duration = 0.6,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = MOTION_TAGS[as];

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
