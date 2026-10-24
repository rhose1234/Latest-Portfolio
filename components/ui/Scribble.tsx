"use client";
import { motion, useReducedMotion } from "framer-motion";

/** A hand-drawn marker underline that draws itself, stroke by stroke, when scrolled into view. */
export default function Scribble({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const stroke = (delay: number) => ({
    initial: reduce ? false : { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut", delay },
  });

  return (
    <svg aria-hidden viewBox="0 0 120 20" fill="none" preserveAspectRatio="none" className={className}>
      <motion.path d="M3 12C30 5 72 4 117 8" stroke="currentColor" strokeWidth={4} strokeLinecap="round" {...stroke(0.5)} />
      <motion.path d="M14 17C46 11 84 12 108 14" stroke="currentColor" strokeWidth={3} strokeLinecap="round" {...stroke(1)} />
    </svg>
  );
}
