"use client";
import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

/** Counts up from 0 to `to` when scrolled into view. */
export default function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return (
    <b ref={ref} className="block text-[clamp(48px,7vw,96px)] font-bold leading-none tracking-tighter">
      0{suffix}
    </b>
  );
}
