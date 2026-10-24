"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import CodeLink from "@/components/ui/CodeLink";
import Reveal from "@/components/ui/Reveal";
import { UGC_BRANDS, type UgcBrand } from "@/lib/data";
import { wrap } from "@/lib/styles";

/** Each tag gets its own rope length, tilt and paper colour, cycling through these. */
const DROPS = [28, 56, 36, 64];
const TILTS = [-3, 2.5, -1.5, 3];
const TONES = ["bg-white", "bg-[#ffc8d4]", "bg-[#e6ddff]"];

/** Paper look for brand tags: soft shadow and a stitched edge. */
const PAPER = "border border-crimson/15 shadow-[0_18px_40px_rgba(30,1,7,.12)] outline-1 outline-dashed outline-crimson/20 outline-offset-[-8px]";
const FACE = "relative col-start-1 row-start-1 min-h-[180px] rounded-[22px] p-5 pt-10 [backface-visibility:hidden] lg:min-h-[210px]";

export default function UgcBrands() {
  return (
    <section id="ugc" className="py-12 md:py-16">
      <div className={wrap}>
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[clamp(26px,7vw,40px)] font-extrabold leading-[.95] tracking-tighter md:text-[clamp(32px,5vw,72px)]">
              Brands I&apos;ve told<br />stories for
            </h2>
            <Link
              href="/rate-card"
              className="group inline-flex shrink-0 items-center gap-1 pb-1 text-[15px] font-semibold underline decoration-2 underline-offset-4 transition hover:text-vivid-pink md:text-lg"
            >
              Rate card
              <Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-normal md:text-[17px]">Short-form videos made for real brands. Tap a card to watch them.</p>
        </Reveal>

        {/* Phones: one row that scrolls sideways, full-bleed past the page gutter. Tablet and up: a grid. */}
        <ul className="scrollbar-hide -mx-7 mt-14 flex snap-x snap-mandatory scroll-px-7 gap-x-4 overflow-x-auto px-7 pb-10 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-8 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
          {UGC_BRANDS.map((brand, i) => {
            const tone = `${TONES[i % TONES.length]} ${PAPER}`;
            const page = `/ugc/${brand.slug}`;
            return (
              <Tag
                key={brand.slug}
                index={i}
                front={
                  <div className={`${FACE} ${tone}`}>
                    <Link href={page} aria-label={`See ${brand.name} stories`} className="absolute inset-0 rounded-[22px]" />
                    <h3 className="text-[clamp(22px,2.4vw,30px)] font-extrabold leading-none tracking-tighter">{brand.name}</h3>
                    {brand.description && <p className="mt-3 text-sm leading-relaxed text-crimson/75">{brand.description}</p>}
                  </div>
                }
                back={
                  <div
                    className={`${FACE} ${PAPER} flex flex-col items-center justify-center gap-4 [transform:rotateY(180deg)]`}
                    style={{ backgroundColor: brand.logoBg }}
                  >
                    <Link href={page} tabIndex={-1} aria-hidden className="absolute inset-0 rounded-[22px]" />
                    <BrandLogo brand={brand} />
                    {brand.code && (
                      <p className={`text-sm ${isDark(brand.logoBg) ? "text-white/80" : "text-crimson/75"}`}>
                        Sign up with code <CodeLink code={brand.code} href={brand.codeLink} />
                      </p>
                    )}
                  </div>
                }
              />
            );
          })}

          <Tag
            index={UGC_BRANDS.length}
            front={
              <div className={`${FACE} border-2 border-dashed border-crimson/40`}>
                <h3 className="text-[clamp(20px,2vw,26px)] font-extrabold leading-tight tracking-tighter">
                  Your brand could be next on the line
                </h3>
                <a
                  href="#contact"
                  className="group mt-5 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-crimson px-4 py-2 text-sm font-semibold text-light-red transition hover:bg-vivid-pink hover:text-white"
                >
                  Let&apos;s work
                  <Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            }
          />
        </ul>
      </div>
    </section>
  );
}

type TagProps = { index: number; front: ReactNode; back?: ReactNode };

/** A tag hanging from the rail on the hero's lanyard. Hovering lifts it and, when it has a back, flips it over. */
function Tag({ index, front, back }: TagProps) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const drop = DROPS[index % DROPS.length];
  const tilt = TILTS[index % TILTS.length];

  const card = (
    <div className="relative w-full" style={{ perspective: 1000 }}>
      {/* Slot the clip hooks into, as on the hero ID card */}
      <div aria-hidden className="absolute -top-3 left-1/2 z-10 h-5 w-8 -translate-x-1/2 rounded-t-xl border border-crimson/15 bg-white/70">
        <div className="absolute left-1/2 top-1.5 h-2.5 w-4 -translate-x-1/2 rounded-full bg-crimson/20" />
      </div>
      <motion.div
        className="grid"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: back && flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {front}
        {back}
      </motion.div>
    </div>
  );

  return (
    <motion.li
      className="relative w-[min(240px,66vw)] shrink-0 snap-start md:w-auto"
      initial={reduce ? false : { y: -40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      // Only the vertical margin, so a tag peeking in from the side of the mobile row still shows
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ type: "spring", stiffness: 90, damping: 12, delay: index * 0.12 }}
    >
      {/* This tag's stretch of the rail; neighbouring stretches meet across the gap */}
      <span aria-hidden className="absolute -inset-x-2 top-0 h-0.5 bg-crimson md:-inset-x-3" />

      {/* Swings like a pendulum from where the rope meets the rail */}
      <motion.div
        className="flex flex-col items-center"
        style={{ transformOrigin: "50% 0" }}
        initial={{ rotate: tilt }}
        animate={reduce ? { rotate: tilt } : { rotate: [tilt, tilt + 1.5, tilt] }}
        transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ rotate: 0, y: -4, transition: { type: "spring", stiffness: 200, damping: 15 } }}
        onHoverStart={() => setFlipped(true)}
        onHoverEnd={() => setFlipped(false)}
      >
        <div aria-hidden className="relative w-2" style={{ height: drop }}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 shadow-sm" />
          <div className="absolute inset-y-0 left-0 w-px bg-pink-400 opacity-30" />
          <div className="absolute inset-y-0 right-0 w-px bg-pink-100 opacity-40" />
        </div>
        <div aria-hidden className="relative z-20 -mt-1 h-4 w-10 rounded-md border border-gray-500/30 bg-gradient-to-b from-gray-300 to-gray-400 shadow-lg">
          <div className="absolute left-1/2 top-1/2 h-2 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500 shadow-inner" />
        </div>

        <div className="mt-2 w-full">{card}</div>
      </motion.div>
    </motion.li>
  );
}

/** The brand's logo, or its name until a logo file is added. */
function BrandLogo({ brand }: { brand: UgcBrand }) {
  const [missing, setMissing] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  // A missing file can fail before React hydrates and misses onError, so check once mounted too.
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth === 0) setMissing(true);
  }, []);

  if (missing) return <span className="text-center text-2xl font-extrabold tracking-tighter">{brand.name}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={img} src={brand.logo} alt={`${brand.name} logo`} className="max-h-24 max-w-[80%] object-contain" onError={() => setMissing(true)} />
  );
}

/** Whether a #rrggbb background needs light text on it. */
function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) < 128;
}

function Arrow({ className }: { className: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
