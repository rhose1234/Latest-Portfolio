import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import CodeLink from "@/components/ui/CodeLink";
import VideoDeck from "@/components/VideoDeck";
import { ME, UGC_BRANDS } from "@/lib/data";
import { OPEN_GRAPH } from "@/lib/site";
import { wrap } from "@/lib/styles";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return UGC_BRANDS.map((brand) => ({ slug: brand.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const brand = UGC_BRANDS.find((b) => b.slug === params.slug);
  if (!brand) return { title: "UGC" };
  // The site name is added after the title by the layout's title template
  const title = `${brand.name} UGC videos`;
  const description = `Short-form UGC videos I made for ${brand.name}. ${brand.description}`;
  return {
    title,
    description,
    alternates: { canonical: `/ugc/${brand.slug}` },
    // Brand pages have no preview image of their own, so they use the home page's
    openGraph: { ...OPEN_GRAPH, url: `/ugc/${brand.slug}`, title: `${title} | ${ME.name}`, description, images: "/opengraph-image" },
    twitter: { card: "summary_large_image", title: `${title} | ${ME.name}`, description, images: "/opengraph-image" },
  };
}

export default function UgcBrandPage({ params }: Props) {
  const brand = UGC_BRANDS.find((b) => b.slug === params.slug);
  if (!brand) notFound();
  const others = UGC_BRANDS.filter((b) => b.slug !== brand.slug);

  return (
    <main>
      {/* The heading, blurb and links to the other brands, with the video deck beside them and the pair centred; stacked on phones */}
      <header className="relative overflow-hidden pb-20 pt-10 md:pt-20">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(234,4,93,.12),transparent_40%)]" />
        <div className={`${wrap} relative`}>
          {/* Only as wide as the text and deck together, and centred, so the back link starts where the text does */}
          <div className="mx-auto lg:w-fit">
            <Link href="/ugc#ugc" className="mb-10 inline-flex md:mb-12 items-center gap-2 text-sm font-semibold transition hover:text-vivid-pink">
              <svg aria-hidden className="size-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Back to brands
            </Link>
          <div className="grid items-center gap-14 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16 lg:grid-cols-[auto_auto] lg:gap-24 xl:gap-28">
            <div>
              <h1 className="text-[clamp(44px,6.5vw,100px)] font-extrabold uppercase leading-[.9] tracking-tighter">{brand.name}</h1>
              <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-crimson/75 md:text-[17px]">
                {brand.description}
                {brand.code && (
                  <>
                    {" "}Sign up with code <CodeLink code={brand.code} href={brand.codeLink} />.
                  </>
                )}
              </p>

              {others.length > 0 && (
                <nav aria-label="More brands" className="mt-8 flex flex-wrap items-center gap-3">
                  <span className="mr-1 text-sm font-semibold text-crimson/70">More stories:</span>
                  {others.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/ugc/${b.slug}`}
                      className="rounded-full border-2 border-crimson px-4 py-1.5 text-sm font-semibold transition hover:bg-crimson hover:text-light-red"
                    >
                      {b.name}
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            <div className="justify-self-center md:justify-self-start">
              {brand.videos.length ? (
                <VideoDeck videos={brand.videos} brand={brand.name} />
              ) : (
                <p className="rounded-[28px] border-2 border-dashed border-crimson/30 px-6 py-20 text-center text-base md:w-[320px]">
                  Videos for {brand.name} are coming soon.
                </p>
              )}
            </div>
          </div>
          </div>
        </div>
      </header>

      <Cta />
      <Footer />
    </main>
  );
}
