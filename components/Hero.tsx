"use client";
import { useState, useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import Photo from "@/components/ui/Photo";
import { ME, ROLES } from "@/lib/data";
import { btnPink, wrap } from "@/lib/styles";

const word = "font-extrabold uppercase leading-[1.05] tracking-tighter";
const slide = (x: number, delay: number) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.6 },
});

/** Each role title splits around the card, e.g. "Software" | "Engineer". */
const PAIRS = ROLES.map((role) => {
  const [first, ...rest] = role.title.split(" ");
  return [first, rest.join(" ")];
});

/** Rows arrive one after another once the card has dropped in; the button comes last. */
const rowDelay = (row: number) => 0.8 + row * 0.6;

/** Colours alternate like a checkerboard: odd rows start pink, even rows end pink. */
const pink = (row: number, isFirst: boolean) => (row % 2 === 1) === isFirst ? "text-vivid-pink" : "";

/** Per-row nudges on desktop, so the words feel placed rather than ruled. Bigger moves wait for lg, where there's room. */
const NUDGE = [
  { left: "md:-translate-y-10 md:-rotate-3 lg:-translate-x-4", right: "md:translate-x-4 md:-translate-y-6 lg:translate-x-10" },
  { left: "md:-translate-x-10 md:-translate-y-3 lg:-translate-x-28", right: "md:-translate-y-9 md:rotate-2" },
  { left: "md:-translate-x-6 md:-translate-y-6 md:rotate-2 lg:-translate-x-20", right: "md:translate-x-3 md:-translate-y-2 md:-rotate-2 lg:translate-x-14" },
];

/** Hero: the swinging, draggable ID card is the one memorable moment. */
export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden bg-crimson-loading pb-16 pt-24 text-light-red">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[25%] size-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(234,4,93,.35),transparent_30%)]" />

      {/* Mobile: the first role reads across the rope, one word either side of it */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-14 z-20 grid grid-cols-[1fr_auto_1fr] items-center gap-5 px-4 md:hidden">
        <motion.span className={`${word} translate-y-3 justify-self-end text-[clamp(24px,7vw,36px)] ${pink(0, true)}`} {...slide(-40, rowDelay(0))}>{PAIRS[0][0]}</motion.span>
        {/* The gap the rope runs through */}
        <span className="w-3" />
        <motion.span className={`${word} translate-y-8 justify-self-start text-[clamp(24px,7vw,36px)] ${pink(0, false)}`} {...slide(40, rowDelay(0))}>{PAIRS[0][1]}</motion.span>
      </div>

      <div className={`${wrap} relative grid flex-1 grid-cols-1 items-center justify-items-center gap-10 md:grid-cols-[1fr_auto_1fr]`}>
        {/* Desktop: each row reads across the card */}
        <div className="hidden self-stretch justify-self-end pt-[50px] md:flex md:flex-col md:items-end md:justify-between">
          {PAIRS.map(([first], i) => (
            <motion.span key={first} className={`${word} text-[clamp(30px,4.6vw,68px)] ${pink(i, true)} ${NUDGE[i % NUDGE.length].left}`} {...slide(-40, rowDelay(i))}>{first}</motion.span>
          ))}
        </div>

        <IdCard reduce={!!reduce} />

        <div className="hidden self-stretch justify-self-start pt-[50px] md:flex md:flex-col md:items-start md:justify-between">
          {PAIRS.map(([first, rest], i) => (
            <motion.span key={first} className={`${word} text-[clamp(30px,4.6vw,68px)] ${pink(i, false)} ${NUDGE[i % NUDGE.length].right}`} {...slide(40, rowDelay(i))}>{rest}</motion.span>
          ))}
        </div>

        {/* Mobile: the other roles stacked under the card (the first one sits either side of the rope, above) */}
        <ul className="flex flex-col items-center gap-4 md:hidden">
          {PAIRS.slice(1).map(([first, rest], i) => (
            <motion.li key={first} className={`${word} text-[clamp(26px,7.5vw,40px)]`} {...slide(0, rowDelay(i + 1))}>
              <span className={pink(i + 1, true)}>{first}</span> <span className={pink(i + 1, false)}>{rest}</span>
            </motion.li>
          ))}
        </ul>

        {/* Centred under the card on desktop, under the roles on mobile */}
        <motion.a
          href="#contact"
          className={`${btnPink} -mt-8 md:col-start-2 md:mt-0`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rowDelay(PAIRS.length), duration: 0.6 }}
        >
          Work with me
        </motion.a>
      </div>
    </section>
  );
}

/** The top of the rope, 220px above the card: the lanyard swings around this point. */
const PIVOT = "50% -220px";

function IdCard({ reduce }: { reduce: boolean }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAutoFlipped, setHasAutoFlipped] = useState(false);
  const swing = useMotionValue(0);

  // Auto flip once after 2 seconds
  useEffect(() => {
    if (!hasAutoFlipped) {
      const flipTimeout = setTimeout(() => {
        setIsFlipped(true);
        setHasAutoFlipped(true);
        setTimeout(() => {
          setIsFlipped(false);
        }, 3000);
      }, 2000);
      return () => clearTimeout(flipTimeout);
    }
  }, [hasAutoFlipped]);

  return (
    <motion.div
      className="relative z-10"
      initial={{ y: -600, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 15, mass: 1.5, delay: 0.3 }}
    >
      {/* Rope, clip and card swing as one piece around the top of the rope, so the card can't come off it.
          Drag sideways to swing it (it springs back when let go); tap to flip. The photo ignores the pointer so the
          browser doesn't start dragging the image instead. */}
      <motion.div
        className="relative cursor-grab touch-pan-y select-none active:cursor-grabbing [&_img]:pointer-events-none"
        style={{ rotate: swing, transformOrigin: PIVOT }}
        onPan={(_, info) => swing.set(Math.max(-15, Math.min(15, -info.offset.x / 10)))}
        onPanEnd={() => animate(swing, 0, { type: "spring", stiffness: 120, damping: 6 })}
        onTap={(event) => {
          if (!(event.target as Element).closest("a")) setIsFlipped((flipped) => !flipped);
        }}
      >
      <motion.div
        style={{ transformOrigin: PIVOT }}
        animate={reduce ? undefined : { rotate: [0, -2, 2, -1.5, 1.5, -1, 1, 0] }}
        transition={{ rotate: { repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 1, delay: 1.5 } }}
      >
      {/* Pink Lanyard Rope */}
      <div
        aria-hidden
        className="absolute -top-[220px] left-1/2 h-[320px] w-3 -translate-x-1/2"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 rounded-full shadow-sm" />
        <div className="absolute inset-y-0 left-0 w-px bg-pink-400 opacity-30" />
        <div className="absolute inset-y-0 right-0 w-px bg-pink-100 opacity-40" />
      </div>

      {/* Lanyard clip */}
      <div
        aria-hidden
        className="absolute -top-[10px] left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-10 h-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-md shadow-lg relative border border-gray-500/30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-2 bg-gray-500 rounded-full shadow-inner" />
        </div>
      </div>

      <motion.div
        className="relative w-[min(240px,60vw)] pt-[50px]"
        whileHover={{ scale: 1.02 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side */}
          <div
            className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md p-5 shadow-[0_20px_60px_rgba(0,0,0,.65)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-5 bg-white/20 backdrop-blur-sm rounded-t-xl border border-white/30">
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-gray-400/40 rounded-full" />
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-pink-200 to-orange-300 rounded-lg" />
              <Photo src="/images/hero.jpg" alt={`Portrait of ${ME.name}`} className="relative aspect-[4/5] rounded-lg" />
            </div>

            <div className="mt-4 space-y-0.5">
              <h2 className="text-md font-bold tracking-tight text-white uppercase">{ME.name}</h2>
              <p className="text-[10px] text-white/90 font-medium">Software Engineer | UGC Creator</p>
            </div>

            {/* Barcode at bottom */}
            <div className="mt-3">
              <div aria-hidden className="flex h-8 items-stretch gap-0.5">
                {Array.from({ length: 18 }).map((_, i) => (
                  <i key={i} className={`bg-white ${i % 4 === 0 ? "w-px" : i % 3 === 0 ? "w-1" : "w-0.5"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md p-5 shadow-[0_20px_60px_rgba(0,0,0,.65)]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-5 bg-white/20 backdrop-blur-sm rounded-t-xl border border-white/30">
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-gray-400/40 rounded-full" />
            </div>

            <div className="flex h-full flex-col justify-start pt-4 gap-6">

              {/* Title */}
              <h4 className="text-sm font-semibold text-white underline decoration-2 underline-offset-4">What I do</h4>

              {/* Main description */}
              <p className="text-xs leading-relaxed text-white/90">
                I help business owners and founders build websites and web apps that help their businesses function well on the internet, and I create relatable short-form videos for brands
              </p>

              {/* Tag */}
              <div className="inline-flex self-start">
                <a
                  href="#work"
                  onClick={(e) => e.stopPropagation()}
                  className="group inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-[10px] font-semibold text-crimson border border-white/50 transition hover:bg-vivid-pink hover:text-white"
                >
                  View my works
                  <svg aria-hidden className="size-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              <div className="mt-auto">
                {/* <div className="text-sm font-serif italic text-white/70 mb-2" style={{ fontFamily: 'cursive' }}>
                  Always Stay Awesome
                </div> */}

                <div aria-hidden className="flex h-8 items-stretch gap-0.5">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <i key={i} className={`bg-white/70 ${i % 4 === 0 ? "w-px" : i % 3 === 0 ? "w-1" : "w-0.5"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </motion.div>
      </motion.div>
    </motion.div>
  );
}
