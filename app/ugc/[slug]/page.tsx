import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import CodeLink from "@/components/ui/CodeLink";
import { ME, UGC_BRANDS } from "@/lib/data";
import { wrap } from "@/lib/styles";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return UGC_BRANDS.map((brand) => ({ slug: brand.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const brand = UGC_BRANDS.find((b) => b.slug === params.slug);
  return { title: brand ? `${brand.name} | UGC by ${ME.name}` : `UGC | ${ME.name}` };
}

export default function UgcBrandPage({ params }: Props) {
  const brand = UGC_BRANDS.find((b) => b.slug === params.slug);
  if (!brand) notFound();
  const others = UGC_BRANDS.filter((b) => b.slug !== brand.slug);

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
          <p className="mt-16 text-sm font-semibold uppercase tracking-widest text-vivid-pink">Stories for</p>
          <h1 className="mt-2 text-[clamp(48px,9vw,128px)] font-extrabold uppercase leading-[.9] tracking-tighter">{brand.name}</h1>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-light-red/80 md:text-[17px]">
            {brand.description}
            {brand.code && (
              <>
                {" "}Sign up with code <CodeLink code={brand.code} href={brand.codeLink} />.
              </>
            )}
          </p>
        </div>
      </header>

      <section className="py-20">
        <div className={wrap}>
          {brand.videos.length ? (
            <ul className="mx-auto grid max-w-[360px] grid-cols-1 gap-10 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
              {brand.videos.map((video) => (
                <li key={video.src}>
                  <video
                    src={video.src}
                    poster={video.cover}
                    controls
                    playsInline
                    preload="none"
                    className="aspect-[9/16] w-full rounded-[28px] bg-crimson object-cover shadow-[0_24px_50px_rgba(30,1,7,.25)]"
                  />
                  {video.title && <p className="mt-4 text-lg font-semibold tracking-tight">{video.title}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-[28px] border-2 border-dashed border-crimson/30 px-6 py-20 text-center text-base">
              Videos for {brand.name} are coming soon.
            </p>
          )}

          {others.length > 0 && (
            <nav aria-label="More brands" className="mt-20 flex flex-wrap items-center gap-3">
              <span className="mr-2 font-semibold">More stories:</span>
              {others.map((b) => (
                <Link
                  key={b.slug}
                  href={`/ugc/${b.slug}`}
                  className="rounded-full border-2 border-crimson px-5 py-2 text-sm font-semibold transition hover:bg-crimson hover:text-light-red"
                >
                  {b.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      <Cta />
      <Footer />
    </main>
  );
}
