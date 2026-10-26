import type { Metadata } from "next";
import Link from "next/link";
import BookingSteps from "@/components/BookingSteps";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { ME, RATES, RATE_NOTES, UGC_BRANDS, type RatePackage } from "@/lib/data";
import { OPEN_GRAPH, RATE_CARD_DESCRIPTION } from "@/lib/site";
import { SOCIALS } from "@/lib/socials";
import { btnPink, wrap } from "@/lib/styles";

export const metadata: Metadata = {
  title: "UGC rate card",
  description: RATE_CARD_DESCRIPTION,
  alternates: { canonical: "/rate-card" },
  openGraph: { ...OPEN_GRAPH, url: "/rate-card", title: `UGC rate card | ${ME.name}`, description: RATE_CARD_DESCRIPTION },
  twitter: { card: "summary_large_image", title: `UGC rate card | ${ME.name}`, description: RATE_CARD_DESCRIPTION },
};

/** Package cards get richer as the packages grow: white, pink, then dark. */
const TONES = [
  { card: "bg-white border border-crimson/15", button: "bg-crimson text-light-red hover:bg-vivid-pink hover:text-white", tick: "text-vivid-pink" },
  { card: "bg-[#ffc8d4] border border-crimson/15", button: "bg-crimson text-light-red hover:bg-vivid-pink hover:text-white", tick: "text-crimson" },
  { card: "bg-crimson text-light-red", button: "bg-vivid-pink text-white hover:bg-light-red hover:text-crimson", tick: "text-vivid-pink" },
];

/** The socials I post brand content on, linking to my profiles. */
const PLATFORMS = ["X", "Instagram", "Facebook", "TikTok"].flatMap((name) => SOCIALS.filter((social) => social.name === name));

/** Reasons to hire me, shown under the packages. Icons are 24x24 stroke paths. */
const REASONS = [
  {
    title: "Authentic & relatable content",
    text: "Videos that feel like a real recommendation from a friend, not an ad, so your audience trusts what they see.",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    title: "Storytelling-focused videos",
    text: "Every video tells a story with a strong hook, so people watch to the end and remember your brand.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    title: "Natural, engaging on-camera delivery",
    text: "I'm comfortable on camera and talk the way your customers do, which keeps viewers watching.",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  },
  {
    title: "Product-focused videos",
    text: "Your product stays the star. I show what it does and the problem it solves, clearly and simply.",
    icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  },
];

/** A mailto link that opens the visitor's email app with the booking already written out. */
function mailto(subject: string, lines: string[]) {
  return `mailto:${ME.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

const firstName = ME.name.split(" ")[0];

function bookingLink(pkg: RatePackage) {
  return mailto(`UGC booking: ${pkg.name} package (${pkg.price})`, [
    `Hi ${firstName},`,
    "",
    `I'd like to book your ${pkg.name} UGC package (${pkg.price}):`,
    ...pkg.includes.map((item) => `• ${item}`),
    "",
    "Brand name: ",
    "Product or app to feature: ",
    "Website or social handle: ",
    "Preferred start date: ",
    "Best days and times for a clarity call: ",
    "Do you also need the videos for ads? (If yes, for how long): ",
    "",
    "Thanks,",
  ]);
}

const customLink = mailto("UGC enquiry: ad usage or custom package", [
  `Hi ${firstName},`,
  "",
  "I'm interested in (ad usage rights / a custom package): ",
  "",
  "Brand name: ",
  "What we need: ",
  "How long we'd run the videos as ads (if any): ",
  "",
  "Thanks,",
]);

export default function RateCardPage() {
  return (
    <main>
      <header className="relative overflow-hidden bg-crimson-loading pb-20 pt-10 text-light-red md:pb-24">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(234,4,93,.35),transparent_40%)]" />
        <div className={`${wrap} relative`}>
          <Link href="/#ugc" className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-vivid-pink">
            <Arrow className="size-4 rotate-180" />
            Back to brands
          </Link>

          <div className="mt-12 grid items-center gap-14 md:mt-16 md:grid-cols-[1.4fr_1fr]">
            <Reveal className="text-center md:text-left">
              <h1 className="text-[clamp(52px,8vw,112px)] font-extrabold uppercase leading-[.88] tracking-tighter text-white">
                UGC<br />rate card
              </h1>
              <p className="mx-auto mt-6 max-w-[42ch] text-base leading-relaxed text-light-red/80 md:mx-0 md:text-[19px]">
                I create relatable short-form videos that connect your brand with its audience and turn viewers into customers.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                {PLATFORMS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} profile`}
                    className="flex size-11 items-center justify-center rounded-full bg-light-red/10 transition hover:-translate-y-0.5 hover:bg-vivid-pink hover:text-white"
                  >
                    <svg aria-hidden className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15} className="relative mx-auto w-full max-w-[260px] md:max-w-[360px]">
              <Photo src="/images/hero.jpg" alt={`Portrait of ${ME.name}`} className="aspect-[4/5] rotate-2 rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,.35)]" />
              {/* An oval sticker like the one on the printed rate card, bobbing gently */}
              <span className="absolute -left-6 top-6 -rotate-12 animate-float rounded-[50%] border-2 border-vivid-pink bg-white px-6 py-3 text-base font-bold uppercase tracking-wide text-crimson shadow-lg md:-left-10 md:text-lg">
                Open for collabs
              </span>
            </Reveal>
          </div>
        </div>
      </header>

      <section id="packages" className="scroll-mt-6 py-20">
        <div className={wrap}>
          {RATES.length ? (
            <ul className="grid gap-x-6 gap-y-14 pt-6 md:grid-cols-2 lg:grid-cols-3">
              {RATES.map((pkg, i) => {
                const tone = TONES[Math.min(i, TONES.length - 1)];
                return (
                  <li key={pkg.name}>
                    <Reveal delay={i * 0.12} className="h-full">
                      <TiltCard className={`group relative flex h-full flex-col rounded-[28px] p-8 pt-10 shadow-[0_18px_40px_rgba(30,1,7,.12)] transition-shadow duration-300 hover:shadow-[0_30px_60px_rgba(30,1,7,.22)] ${tone.card}`}>
                        {/* Price sticker, like the circles on the printed rate card. It straightens up on hover. */}
                        <span className="absolute -top-8 right-6 flex size-28 rotate-[-10deg] items-center justify-center rounded-full bg-vivid-pink text-center text-lg font-extrabold leading-none tracking-tight text-white shadow-[0_12px_24px_rgba(234,4,93,.35)] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110">
                          {pkg.price}
                        </span>
                        {pkg.featured && (
                          <span className="absolute -top-3 left-8 rounded-full bg-crimson px-3 py-1 text-xs font-bold uppercase tracking-wider text-light-red">
                            Most popular
                          </span>
                        )}
                        <h2 className="text-[clamp(28px,3vw,36px)] font-extrabold uppercase leading-none tracking-tighter">{pkg.name}</h2>
                        {pkg.description && <p className="mt-3 leading-relaxed opacity-75">{pkg.description}</p>}
                        <ul className="mt-6 space-y-3">
                          {pkg.includes.map((item) => (
                            <li key={item} className="flex gap-3">
                              <svg aria-hidden className={`mt-0.5 size-5 shrink-0 ${tone.tick}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                        {/* Sits at the bottom so buttons line up across cards, always with room above it */}
                        <div className="mt-auto pt-8">
                          <a
                            href={bookingLink(pkg)}
                            className={`group/book inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition hover:-translate-y-0.5 active:scale-95 ${tone.button}`}
                          >
                            Book this package
                            <Arrow className="size-4 transition-transform group-hover/book:translate-x-1" />
                          </a>
                        </div>
                      </TiltCard>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-[28px] border-2 border-dashed border-crimson/30 px-6 py-16 text-center">
              <p className="mx-auto max-w-[40ch] text-base leading-relaxed">
                My rates are being updated. Tell me about your brand and I&apos;ll send you a quote.
              </p>
              <a href="#contact" className={`${btnPink} mt-8`}>Get a quote</a>
            </div>
          )}

          <div className="mt-24">
            <Reveal>
              <h2 className="text-[clamp(30px,5vw,56px)] font-extrabold leading-[.95] tracking-tighter">
                Why you should hire me<br /> for your next campaign
              </h2>
            </Reveal>
            {/* Two by two, with the pink cards on the diagonal */}
            <ul className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
              {REASONS.map((reason, i) => (
                <li key={reason.title}>
                  <Reveal delay={(i % 2) * 0.1} className="h-full">
                    <div
                      className={`group h-full rounded-[24px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(30,1,7,.14)] md:p-8 ${
                        i === 0 || i === 3 ? "bg-[#ffc8d4]" : "border border-crimson/10 bg-white"
                      }`}
                    >
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-crimson text-light-red transition duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-vivid-pink group-hover:text-white">
                        <svg aria-hidden className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={reason.icon} />
                        </svg>
                      </span>
                      <h3 className="mt-6 text-xl font-bold tracking-tight md:text-2xl">{reason.title}</h3>
                      <p className="mt-2 max-w-[44ch] leading-relaxed text-crimson/75">{reason.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal>
              <nav aria-label="Brands I've worked with" className="mt-8 flex flex-wrap items-center gap-2">
                <span className="mr-2 font-semibold">Brands I&apos;ve worked with:</span>
                {UGC_BRANDS.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/ugc/${b.slug}`}
                    className="rounded-full border-2 border-crimson px-4 py-1.5 text-sm font-semibold transition hover:bg-crimson hover:text-light-red"
                  >
                    {b.name}
                  </Link>
                ))}
              </nav>
            </Reveal>
          </div>

          {/* Heading on the left (it stays put while the steps scroll past on wide screens), steps joined by a thread on the right */}
          <div className="mt-24 grid gap-10 rounded-[32px] bg-crimson p-7 text-light-red md:p-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-[clamp(30px,4vw,48px)] font-extrabold leading-[.95] tracking-tighter text-white">How booking works</h2>
              <p className="mt-4 max-w-[34ch] leading-relaxed text-light-red/70 md:text-[17px]">From your first email to your videos going live, here&apos;s what to expect.</p>
              <a href="#packages" className={`${btnPink} group mt-8 inline-flex items-center gap-2`}>
                Choose a package
                <Arrow className="size-4 -rotate-90 transition-transform group-hover:-translate-y-0.5" />
              </a>
            </Reveal>

            <BookingSteps />
          </div>

          {RATE_NOTES.length > 0 && (
            <Reveal className="mt-24 rounded-[28px] border border-crimson/15 bg-white/70 p-7 shadow-[0_18px_40px_rgba(30,1,7,.08)] md:p-10">
              <h2 className="text-[clamp(26px,4vw,40px)] font-extrabold leading-none tracking-tighter">Terms</h2>
              <ul className="mt-6 space-y-4">
                {RATE_NOTES.map((note) => (
                  <li key={note.title} className="flex gap-4 leading-relaxed">
                    <span aria-hidden className="mt-2.5 size-2 shrink-0 rounded-full bg-vivid-pink" />
                    <p>
                      <strong className="font-bold">{note.title}.</strong> <span className="text-crimson/75">{note.text}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Ads are priced per brand, so they get their own way in */}
          <Reveal className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-crimson p-8 text-light-red md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="text-[clamp(24px,3vw,34px)] font-extrabold leading-tight tracking-tighter text-white">Need ad rights or a custom package?</h2>
              <p className="mt-2 max-w-[48ch] leading-relaxed text-light-red/75">Tell me how long you&apos;d like to run the videos and I&apos;ll send you a quote.</p>
            </div>
            <a href={customLink} className={`${btnPink} group inline-flex shrink-0 items-center gap-2`}>
              Ask for a quote
              <Arrow className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
      </section>

      <Cta />
      <Footer />
    </main>
  );
}

function Arrow({ className }: { className: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
