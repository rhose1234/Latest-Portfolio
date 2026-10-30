import type { CSSProperties } from "react";

/* Shared Tailwind class strings */
export const wrap = "mx-auto w-full max-w-[1200px] px-7";

export const btn =
  "inline-block rounded-full bg-crimson px-7 py-4 font-semibold text-light-red transition hover:-translate-y-0.5 hover:bg-vivid-pink hover:text-white";

export const btnGhost =
  "inline-block rounded-full border-2 border-crimson px-7 py-4 font-semibold text-crimson transition hover:-translate-y-0.5 hover:bg-crimson hover:text-light-red";

export const btnPink =
  "inline-block rounded-full bg-vivid-pink px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-light-red hover:text-crimson";

export const btnPinkSm =
  "inline-block rounded-full bg-vivid-pink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-light-red hover:text-crimson";

export const btnGhostLight =
  "inline-block rounded-full border-2 border-light-red px-7 py-4 font-semibold text-light-red transition hover:-translate-y-0.5 hover:bg-light-red hover:text-crimson";

/** Inline style for a .rise-in element: how long it waits (seconds) and how far (px) it moves from. */
export const riseIn = (delay = 0, x = 0, y = 36) => ({ "--delay": `${delay}s`, "--from-x": `${x}px`, "--from-y": `${y}px` }) as CSSProperties;
