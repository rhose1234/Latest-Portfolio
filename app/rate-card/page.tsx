import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import { ME, RATES, RATE_NOTES, UGC_BRANDS } from "@/lib/data";
import { btnPink, wrap } from "@/lib/styles";

export const metadata: Metadata = { title: `Rate card | UGC by ${ME.name}` };

export default function RateCardPage() {
  return (
    <main>
      <header className="relative overflow-hidden bg-crimson-loading pb-20 pt-10 text-light-red">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(234,4,93,.35),transparent_40%)]" />
        <div className={`${wrap} relative`}>
          <Link href="/#ugc" className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-vivid-pink">
            <svg aria-hidden className="size-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Back to brands
          </Link>
          <p className="mt-16 text-sm font-semibold uppercase tracking-widest text-vivid-pink">UGC &amp; content creation</p>
          <h1 className="mt-2 text-[clamp(48px,9vw,128px)] font-extrabold uppercase leading-[.9] tracking-tighter">Rate card</h1>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-light-red/80 md:text-[17px]">
            Packages for brands that want relatable short-form videos their audience actually watches.
          </p>
        </div>
      </header>

      <section className="py-20">
        <div className={wrap}>
          {RATES.length ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {RATES.map((pkg) => (
                <li
                  key={pkg.name}
                  className={`relative flex flex-col rounded-[28px] p-8 ${pkg.featured ? "bg-crimson text-light-red shadow-[0_24px_50px_rgba(30,1,7,.3)]" : "border-2 border-crimson"}`}
                >
                  {pkg.featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-vivid-pink px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      Most popular
                    </span>
                  )}
                  <h2 className="text-xl font-bold tracking-tight">{pkg.name}</h2>
                  <p className="mt-2 text-[clamp(32px,4vw,44px)] font-extrabold leading-none tracking-tighter">{pkg.price}</p>
                  {pkg.description && <p className="mt-3 leading-relaxed opacity-75">{pkg.description}</p>}
                  <ul className="mt-6 space-y-3">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <svg aria-hidden className="mt-0.5 size-5 shrink-0 text-vivid-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`mt-8 self-start rounded-full px-6 py-3 font-semibold transition md:mt-auto ${pkg.featured ? "bg-vivid-pink text-white hover:bg-light-red hover:text-crimson" : "bg-crimson text-light-red hover:bg-vivid-pink hover:text-white"}`}
                  >
                    Book this package
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[28px] border-2 border-dashed border-crimson/30 px-6 py-16 text-center">
              <p className="mx-auto max-w-[40ch] text-base leading-relaxed">
                My rates are being updated. Tell me about your brand and I&apos;ll send you a quote.
              </p>
              <a href="#contact" className={`${btnPink} mt-8`}>Get a quote</a>
            </div>
          )}

          {RATE_NOTES.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-extrabold tracking-tighter">Good to know</h2>
              <ul className="mt-4 max-w-[60ch] list-disc space-y-2 pl-5 leading-relaxed">
                {RATE_NOTES.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </div>
          )}

          <nav aria-label="Brands I've worked with" className="mt-16 flex flex-wrap items-center gap-3">
            <span className="mr-2 font-semibold">Brands I&apos;ve worked with:</span>
            {UGC_BRANDS.map((b) => (
              <Link
                key={b.slug}
                href={`/ugc/${b.slug}`}
                className="rounded-full border-2 border-crimson px-5 py-2 text-sm font-semibold transition hover:bg-crimson hover:text-light-red"
              >
                {b.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <Cta />
      <Footer />
    </main>
  );
}
