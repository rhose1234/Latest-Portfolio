"use client";
import type { PointerEvent, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const SPRING = { stiffness: 200, damping: 20 };

/** A card that tips towards the mouse as it moves over it, and settles back flat when it leaves. */
export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  // Pointer position across the card, from -0.5 (left/top) to 0.5 (right/bottom)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), SPRING);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), SPRING);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - box.left) / box.width - 0.5);
    y.set((event.clientY - box.top) / box.height - 0.5);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div onPointerMove={move} onPointerLeave={reset} style={{ rotateX, rotateY, transformPerspective: 900 }} className={className}>
      {children}
    </motion.div>
  );
}
