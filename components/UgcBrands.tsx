"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
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
  const row = useRef<HTMLUListElement>(null);
  const { scrollXProgress } = useScroll({ container: row });

  return (
    <section id="ugc" className="py-12 md:py-16">
      <div className={wrap}>
        {/* Phones: heading, then the blurb with the rate card link on the same line. Tablet and up: the link sits beside the heading. */}
        <Reveal className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 md:items-end">
          <h2 className="col-span-2 text-[clamp(26px,7vw,40px)] font-extrabold leading-[.95] tracking-tighter md:col-span-1 md:col-start-1 md:row-start-1 md:text-[clamp(32px,5vw,72px)]">
            Brands I&apos;ve told<br />stories for
          </h2>
          <p className="max-w-[52ch] text-[15px] leading-normal md:col-span-2 md:text-[17px]">Tap a card to watch.</p>
          <Link
            href="/rate-card"
            className="group col-start-2 row-start-2 inline-flex items-center gap-1 justify-self-end whitespace-nowrap text-[15px] font-semibold underline decoration-2 underline-offset-4 transition hover:text-vivid-pink md:row-start-1 md:pb-1 md:text-lg"
          >
            UGC rate card
            <Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        {/* Phones: one row that scrolls sideways, full-bleed past the page gutter. Tablet and up: a grid. */}
        <ul
          ref={row}
          className="scrollbar-hide -mx-7 mt-10 flex snap-x snap-mandatory scroll-px-7 gap-x-4 overflow-x-auto px-7 pb-8 md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-8 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
        >
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
                  Your brand could be next in line
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

        {/* Phones only: shows how far along the row you've swiped */}
        <div aria-hidden className="mx-auto h-1 w-24 overflow-hidden rounded-full bg-crimson/15 md:hidden">
          <motion.div className="h-full origin-left rounded-full bg-crimson" style={{ scaleX: scrollXProgress }} />
        </div>
      </div>
    </section>
  );
}

type TagProps = { index: number; front: ReactNode; back?: ReactNode };

/** A tag hanging from the rail on the hero's lanyard. Hovering lifts it and, when it has a back, flips it over. */
function Tag({ index, front, back }: TagProps) {
  const [flipped, setFlipped] = useState(false);
  const phone = useIsPhone();
  const drop = DROPS[index % DROPS.length];
  // In the phone row the tags hang level-ish so they read as one neat line
  const tilt = TILTS[index % TILTS.length] * (phone ? 0.35 : 1);

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
      initial={{ y: -40, opacity: 0 }}
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
        animate={{ rotate: [tilt, tilt + 1.5, tilt] }}
        transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ rotate: 0, y: -4, transition: { type: "spring", stiffness: 200, damping: 15 } }}
        onHoverStart={() => setFlipped(true)}
        onHoverEnd={() => setFlipped(false)}
      >
        {/* Same rope length for every tag on phones, staggered lengths from tablet up */}
        <div aria-hidden className="relative h-8 w-2 md:h-[var(--drop)]" style={{ "--drop": `${drop}px` } as CSSProperties}>
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

/** Whether the screen is phone-sized (below Tailwind's md breakpoint). */
function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setPhone(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return phone;
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
