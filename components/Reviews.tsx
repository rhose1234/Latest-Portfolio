"use client";
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { GOOGLE_REVIEWS, REVIEWS, type Review } from "@/lib/data";
import { btn, wrap } from "@/lib/styles";

/** Each receipt settles at its own slight angle once it has printed. */
const TILTS = [-2, 1.5, -1, 2.5];
const PRINT_SECONDS = 1.6;

/** Rubber-stamp ink: green for happy clients, pink for the spot that's still open. */
const STAMP_INK = {
  Satisfied: "border-emerald-600 text-emerald-600",
  Reserved: "border-vivid-pink text-vivid-pink",
};

/** Receipts slide down out of the printer slot one after another, then drop into their tilt. */
const printed: Variants = {
  waiting: { y: "-100%", rotate: 0 },
  printed: (i: number) => ({
    y: 0,
    rotate: TILTS[i % TILTS.length],
    transition: {
      y: { duration: PRINT_SECONDS, ease: "linear", delay: i * 0.6 },
      rotate: { type: "spring", stiffness: 120, damping: 10, delay: i * 0.6 + PRINT_SECONDS },
    },
  }),
};

export default function Reviews() {
  const reduce = useReducedMotion();
  const row = useRef<HTMLDivElement>(null);
  // One receipt (300px) plus the gap between receipts
  const slide = (direction: 1 | -1) => row.current?.scrollBy({ left: direction * 332, behavior: "smooth" });

  return (
    <section id="reviews" className="pb-24 pt-16">
      <div className={wrap}>
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[clamp(26px,7vw,40px)] font-extrabold leading-[.95] tracking-tighter md:text-[clamp(32px,5vw,72px)]">The receipts</h2>
            <div className="flex shrink-0 gap-2">
              {([-1, 1] as const).map((direction) => (
                <button
                  key={direction}
                  type="button"
                  onClick={() => slide(direction)}
                  aria-label={direction < 0 ? "Previous receipts" : "More receipts"}
                  className="flex size-11 items-center justify-center rounded-full border-2 border-crimson transition hover:bg-crimson hover:text-light-red"
                >
                  <svg aria-hidden className={`size-5 ${direction < 0 ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-normal md:text-[17px]">
            Don&apos;t just take my word for it. Here are honest
            <br className="hidden md:inline" /> reviews from my previous clients.
          </p>
        </Reveal>

        {/* The printer slot the receipts come out of */}
        <div aria-hidden className="relative z-10 mt-12 h-5 rounded-full bg-crimson shadow-[0_8px_20px_rgba(30,1,7,.25)]">
          <div className="absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-black shadow-[0_0_12px_rgba(234,4,93,.8)]" />
        </div>
      </div>

      {/* Scrolls sideways once there are more receipts than fit; its top edge hides receipts until they print */}
      <div ref={row} className="scrollbar-hide -mt-2.5 snap-x snap-mandatory overflow-x-auto">
        {/* Side padding lines the first receipt up with the heading on wide screens */}
        <motion.ul
          className="mx-auto flex w-max gap-8 px-[max(28px,calc((100vw-1200px)/2+28px))] pb-12"
          initial={reduce ? false : "waiting"}
          whileInView="printed"
          animate={reduce ? "printed" : undefined}
          viewport={{ once: true, margin: "-120px" }}
        >
          {REVIEWS.map((review, i) => (
            <Receipt key={review.name + review.quote.slice(0, 20)} index={i} stamp="Satisfied">
              <ReviewBody review={review} />
            </Receipt>
          ))}
          <Receipt index={REVIEWS.length} stamp="Reserved">
            <Rows rows={[["Client", "You?"], ["Service", "Website · UGC"]]} />
            <Dashes />
            <p className="font-sans text-[15px] leading-relaxed">This receipt is waiting for your story.</p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-crimson px-4 py-2 font-sans text-sm font-semibold text-light-red transition hover:bg-vivid-pink hover:text-white"
            >
              Let&apos;s work
              <svg aria-hidden className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </Receipt>
        </motion.ul>
      </div>

      <div className={`${wrap} text-center`}>
        <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer" className={`${btn} group`}>
          <span className="flex items-center gap-2">
            Read more reviews on Google
            <svg aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}

/** A till receipt: the given body, then a barcode with a rubber stamp beside it. */
function Receipt({ index, stamp, children }: { index: number; stamp: keyof typeof STAMP_INK; children: ReactNode }) {
  return (
    <motion.li
      custom={index}
      variants={printed}
      whileHover={{ rotate: 0, y: -6, transition: { type: "spring", stiffness: 200, damping: 15 } }}
      className="shrink-0 snap-center drop-shadow-[0_18px_22px_rgba(30,1,7,.16)]"
      style={{ transformOrigin: "50% 0" }}
    >
      <article className="receipt-edge w-[min(300px,78vw)] bg-[#fffdf7] px-6 pb-9 pt-8 font-mono text-[13px] text-crimson">
        {children}
        <Dashes />
        <div className="flex items-center justify-between gap-3">
          <div aria-hidden className="flex h-10 w-[45%] items-stretch justify-between">
            {Array.from({ length: 18 }).map((_, i) => (
              <i key={i} className={`bg-crimson ${i % 5 === 0 ? "w-[3px]" : i % 3 === 0 ? "w-0.5" : "w-px"}`} />
            ))}
          </div>
          <span className={`-rotate-12 rounded-md border-[3px] px-2 py-0.5 text-sm font-bold uppercase tracking-widest opacity-80 ${STAMP_INK[stamp]}`}>
            {stamp}
          </span>
        </div>
      </article>
    </motion.li>
  );
}

function ReviewBody({ review }: { review: Review }) {
  const rows: [string, string][] = [["Client", review.name]];
  if (review.company) rows.push(["Company", review.company]);
  rows.push(["Service", review.service]);
  if (review.date) rows.push(["Date", review.date]);

  const footer: [string, string][] = [];
  if (review.rating) footer.push(["Rating", `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`]);
  if (review.source) footer.push(["Via", review.source]);

  const paragraphs = review.quote.split("\n\n");

  return (
    <>
      <Rows rows={rows} />
      <Dashes />
      <blockquote className="space-y-3 font-sans text-[15px] leading-relaxed">
        {paragraphs.map((text, i) => (
          <p key={i}>
            {i === 0 && "“"}
            {text}
            {i === paragraphs.length - 1 && "”"}
          </p>
        ))}
      </blockquote>
      {footer.length > 0 && (
        <>
          <Dashes />
          <Rows rows={footer} />
        </>
      )}
    </>
  );
}

/** Label .......... value lines, like items on a till receipt. */
function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="space-y-1">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline">
          <dt className="uppercase opacity-60">{label}</dt>
          <span aria-hidden className="mx-2 flex-1 border-b border-dotted border-crimson/40" />
          <dd className="text-right font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Dashes() {
  return <hr className="my-4 border-0 border-t-2 border-dashed border-crimson/30" />;
}
