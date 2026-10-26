"use client";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** Fades and lifts its children into view once, on scroll. A delay (seconds) staggers items in a row.
    With reduce motion on, MotionProvider drops the lift and it just fades. */
export default function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
