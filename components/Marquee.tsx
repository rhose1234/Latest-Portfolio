'use client';

import { TOOLS, UGC_SKILLS } from "@/lib/data";

type BandProps = { label: string; items: string[]; className: string; dot: string; duration: number; reverse?: boolean };

/** One scrolling ribbon. Items repeat until half the strip is wider than any screen, so the -50% loop never shows a gap. */
function Band({ label, items, className, dot, duration, reverse = false }: BandProps) {
  const copies = Math.ceil(24 / items.length) * 2;
  const loop = Array.from({ length: copies }, () => items).flat();

  return (
    <div aria-label={label} className={`col-start-1 row-start-1 -mx-[5%] self-center overflow-hidden py-6 ${className}`}>
      <div className="whitespace-nowrap">
        <div
          className="inline-flex gap-14 pr-14"
          style={{ animation: `marquee ${duration}s linear infinite${reverse ? " reverse" : ""}` }}
        >
          {loop.map((item, i) => (
            <span key={i} className={`inline-flex items-center gap-14 text-xl font-semibold after:size-2 after:rounded-full after:content-[''] ${dot}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    // Both ribbons share one grid cell so they cross; the padding leaves room for the tilt.
    <div className="grid grid-cols-1 overflow-hidden py-20">
      <Band
        label="Content creation"
        items={UGC_SKILLS}
        // On narrow screens the crossing is too shallow to see, so this band drops lower to peek out underneath.
        className="translate-y-12 rotate-[2.5deg] bg-vivid-pink text-white md:translate-y-0"
        dot="after:bg-crimson"
        duration={40}
        reverse
      />
      <Band
        label="Tools I use"
        items={TOOLS}
        className="-rotate-[3.5deg] bg-crimson text-light-red shadow-[0_12px_30px_rgba(30,1,7,.25)]"
        dot="after:bg-vivid-pink"
        duration={30}
      />
    </div>
  );
}
