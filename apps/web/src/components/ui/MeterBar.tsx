"use client";

import { motion, useReducedMotion } from "framer-motion";

interface MeterBarProps {
  value: number;
  className?: string;
  label: string;
}

/** Horizontal meter that fills once it scrolls into view. */
export function MeterBar({ value, className = "", label }: MeterBarProps) {
  const reduceMotion = useReducedMotion();
  const width = `${Math.min(100, Math.max(0, value))}%`;

  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-line ${className}`}
    >
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-accent/60 via-accent to-accent-strong"
        initial={{ width: reduceMotion ? width : "0%" }}
        whileInView={{ width }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
