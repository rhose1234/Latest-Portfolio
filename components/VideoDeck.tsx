"use client";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from "framer-motion";
import VideoCard from "@/components/VideoCard";
import type { UgcVideo } from "@/lib/data";

/** How many cards fan out on each side of the top one. */
const DEPTH = 3;
/** How far (px) or how fast (px/s) a swipe has to go to change cards. */
const SWIPE_DISTANCE = 90;
const SWIPE_SPEED = 500;

/** Where a card sits in the fan. 0 is on top; videos still to come fan out to the right (1, 2, …) and ones already seen to the left (-1, -2, …). */
function fanned(offset: number) {
  const depth = Math.abs(offset);
  const side = Math.sign(offset);
  if (depth > DEPTH) return { x: side * DEPTH * 24, y: 0, rotate: side * DEPTH * 4, scale: 1 - DEPTH * 0.06, opacity: 0 };
  return { x: offset * 24, y: depth * 6, rotate: offset * 4, scale: 1 - depth * 0.06, opacity: 1 - depth * 0.12 };
}

/** How far card i is from the top card, going the short way round, so the deck shelves evenly on both sides. */
function offsetFrom(active: number, i: number, count: number) {
  const ahead = (i - active + count) % count;
  return ahead > count / 2 ? ahead - count : ahead;
}

/** Colours for the controls under the deck, on a light or a dark background. */
const TONES = {
  light: { text: "text-crimson", faint: "text-crimson/40", button: "border-crimson hover:bg-crimson hover:text-light-red" },
  dark: { text: "text-light-red", faint: "text-light-red/40", button: "border-light-red/60 hover:border-light-red hover:bg-light-red hover:text-crimson" },
};

/** A brand's videos as a fanned deck of cards, shelved on both sides: swipe the top one left for the next, right to go back. */
export default function VideoDeck({ videos, brand, tone = "light" }: { videos: UgcVideo[]; brand: string; tone?: keyof typeof TONES }) {
  const colors = TONES[tone];
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const count = videos.length;

  // The top card follows the finger while it's dragged, and tilts the way it's heading
  const dragX = useMotionValue(0);
  const tilt = useTransform(dragX, [-240, 240], [-14, 14]);
  // A drag that ends on the play button shouldn't also start the video
  const dragged = useRef(false);

  const go = useCallback((step: 1 | -1) => setActive((i) => (i + step + count) % count), [count]);

  // The top card slides onto the pile on the side it was swiped towards as the next one comes up
  const settle = () => animate(dragX, 0, reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 });
  const next = () => {
    go(1);
    settle();
  };
  const previous = () => {
    go(-1);
    settle();
  };

  const release = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_SPEED) next();
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_SPEED) previous();
    else settle();
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") previous();
  };

  if (count === 1) {
    return (
      <div className="mx-auto w-[min(260px,62vw)] -rotate-2">
        <VideoCard video={videos[0]} brand={brand} index={0} />
      </div>
    );
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={`${brand} videos`} tabIndex={0} onKeyDown={onKey} className="flex flex-col items-center outline-none">
      <div className="relative aspect-[9/16.4] w-[min(260px,62vw)]">
        {videos.map((video, i) => {
          const offset = offsetFrom(active, i, count);
          const top = offset === 0;
          return (
            <motion.div
              key={video.src}
              aria-hidden={!top}
              className={`absolute inset-0 ${top ? "" : "pointer-events-none"}`}
              style={{ zIndex: count - Math.abs(offset), transformOrigin: "50% 100%" }}
              initial={false}
              animate={fanned(offset)}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
            >
              <motion.div
                className={`h-full ${top && !playing ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""}`}
                style={top ? { x: dragX, rotate: tilt } : undefined}
                drag={top && !playing ? "x" : false}
                dragMomentum={false}
                onDragStart={() => (dragged.current = true)}
                onDragEnd={release}
                onClickCapture={(event) => {
                  if (dragged.current) {
                    event.stopPropagation();
                    event.preventDefault();
                  }
                  dragged.current = false;
                }}
              >
                <VideoCard video={video} brand={brand} index={i} active={top} onPlayingChange={top ? setPlaying : undefined} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-5">
        <DeckButton label="Previous video" onClick={previous} flip className={colors.button} />
        <p aria-live="polite" className={`min-w-[4.5rem] text-center font-mono text-sm font-bold ${colors.text}`}>
          {String(active + 1).padStart(2, "0")} <span className={colors.faint}>/ {String(count).padStart(2, "0")}</span>
        </p>
        <DeckButton label="Next video" onClick={next} className={colors.button} />
      </div>
    </div>
  );
}

function DeckButton({ label, onClick, flip = false, className }: { label: string; onClick: () => void; flip?: boolean; className: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-12 items-center justify-center rounded-full border-2 transition active:scale-90 ${className}`}
    >
      <svg aria-hidden className={`size-5 ${flip ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  );
}
