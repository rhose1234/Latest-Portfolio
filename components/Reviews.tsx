"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { GOOGLE_REVIEWS, REVIEWS, type Review } from "@/lib/data";
import { wrap } from "@/lib/styles";

/** Same paper colours as the brand tags, so each client gets their own avatar tone. */
const TONES = ["bg-white", "bg-[#ffc8d4]", "bg-[#e6ddff]"];

/** Seconds a quote stays up before the next one: long enough to read it, never under 6s. */
const holdFor = (review: Review) => Math.max(6, review.quote.split(/\s+/).length * 0.25);

const rated = REVIEWS.filter((review) => review.rating);
const average = rated.length ? (rated.reduce((sum, review) => sum + (review.rating ?? 0), 0) / rated.length).toFixed(1) : null;

export default function Reviews() {
  const reduce = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const inView = useInView(card, { margin: "-120px" });
  const [active, setActive] = useState(0);
  // Stops for good once a visitor picks a review themselves
  const [auto, setAuto] = useState(true);
  const [hovered, setHovered] = useState(false);
  const playing = auto && inView && !hovered && !reduce && REVIEWS.length > 1;

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % REVIEWS.length), holdFor(REVIEWS[active]) * 1000);
    return () => clearTimeout(timer);
  }, [active, playing]);

  const pick = (i: number) => {
    setActive(i);
    setAuto(false);
  };

  return (
    <section id="reviews" className="py-12 md:py-16">
      <div className={wrap}>
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[clamp(26px,7vw,40px)] font-extrabold leading-[.95] tracking-tighter md:text-[clamp(32px,5vw,72px)]">Feedbacks</h2>
            <a
              href={GOOGLE_REVIEWS}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-1 pb-1 text-[15px] font-semibold underline decoration-2 underline-offset-4 transition hover:text-vivid-pink md:text-lg"
            >
              {average ? (
                <>
                  <span aria-hidden className="text-vivid-pink">★</span>
                  {average} on Google
                </>
              ) : (
                "More on Google"
              )}
              <svg aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-normal md:text-[17px]">
            Don&apos;t just take my word for it. Here are honest
            <br className="hidden md:inline" /> reviews from my previous clients.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div
            ref={card}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative grid overflow-hidden rounded-[28px] bg-crimson text-light-red shadow-[0_18px_40px_rgba(30,1,7,.18)] md:grid-cols-[1.6fr_1fr]"
          >
            {/* Fills up while a quote is on screen, then the next one comes in */}
            {playing && (
              <motion.span
                key={active}
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 origin-left bg-vivid-pink"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: holdFor(REVIEWS[active]), ease: "linear" }}
              />
            )}

            <div className="p-6 md:p-10 lg:p-12">
              <span aria-hidden className="block h-14 text-[104px] font-extrabold leading-none text-vivid-pink md:h-20 md:text-[150px]">
                &ldquo;
              </span>
              {/* Every quote sits in the same cell, so the card is always as tall as the longest one and never jumps */}
              <div className="grid">
                {REVIEWS.map((review, i) => (
                  <Quote key={review.name + review.quote.slice(0, 20)} review={review} shown={i === active} />
                ))}
              </div>
            </div>

            <div className="border-t border-light-red/10 p-4 md:border-l md:border-t-0 md:p-6">
              <ul className="scrollbar-hide flex gap-2.5 overflow-x-auto p-1 md:flex-col md:gap-1 md:overflow-visible md:p-0">
                {REVIEWS.map((review, i) => (
                  <li key={review.name + review.quote.slice(0, 20)} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-pressed={i === active}
                      aria-label={`Review from ${review.name}`}
                      className={`flex w-full items-center gap-3 rounded-2xl text-left transition md:px-3 md:py-2.5 ${
                        i === active ? "md:bg-light-red/10" : "opacity-55 hover:opacity-100"
                      }`}
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-crimson ring-2 ring-offset-2 ring-offset-crimson transition md:size-11 ${
                          TONES[i % TONES.length]
                        } ${i === active ? "ring-vivid-pink" : "ring-transparent"}`}
                      >
                        {initials(review.name)}
                      </span>
                      <span className="hidden min-w-0 md:block">
                        <span className="block truncate font-semibold text-white">{review.name}</span>
                        <span className="block truncate text-sm text-light-red/60">{review.service}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** One client's review: the quote in big type, then who said it. Fades in when it's this quote's turn. */
function Quote({ review, shown }: { review: Review; shown: boolean }) {
  const paragraphs = review.quote.split("\n\n");
  const about = [review.company, review.service, review.source && `via ${review.source}`].filter(Boolean).join(" · ");

  return (
    <motion.figure
      aria-hidden={!shown}
      className={`col-start-1 row-start-1 flex flex-col ${shown ? "" : "pointer-events-none"}`}
      initial={false}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <blockquote className="space-y-4 text-[clamp(19px,2.2vw,28px)] font-medium leading-snug tracking-tight text-white">
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </blockquote>
      <figcaption className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-8">
        <span className="font-bold text-white">{review.name}</span>
        {about && <span className="text-sm text-light-red/60">{about}</span>}
        {review.rating && (
          <span role="img" aria-label={`${review.rating} out of 5 stars`} className="tracking-widest text-vivid-pink">
            {"★".repeat(review.rating)}
            <span className="text-light-red/20">{"★".repeat(5 - review.rating)}</span>
          </span>
        )}
      </figcaption>
    </motion.figure>
  );
}

/** "Adaobi Iloduba" -> "AI" */
function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
