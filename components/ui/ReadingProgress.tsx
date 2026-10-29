"use client";
import { motion, useScroll } from "framer-motion";

/** A thin pink bar across the top of the screen that fills as you read down the page. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-vivid-pink" style={{ scaleX: scrollYProgress }} />;
}
