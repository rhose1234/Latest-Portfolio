"use client";
import { useRef, type ReactNode } from "react";
import { motion, useScroll } from "framer-motion";

/** A vertical timeline line behind its children. It fills pink as you scroll through them.
    The line's centre sits 20px in from the left (24px on tablets), and in the middle on wide screens; markers line up on that. */
export default function ScrollTimeline({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-0.5 bg-crimson/15 md:left-[23px] lg:left-[calc(50%-1px)]">
        <motion.span className="absolute inset-0 origin-top bg-vivid-pink" style={{ scaleY: scrollYProgress }} />
      </span>
      {children}
    </div>
  );
}
