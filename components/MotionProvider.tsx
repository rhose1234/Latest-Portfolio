"use client";
import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/** Respects the visitor's reduce-motion setting across the site: movement is skipped and things just fade.
    Components don't need their own reduce-motion branches, so the page renders the same on the server and in the browser. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
