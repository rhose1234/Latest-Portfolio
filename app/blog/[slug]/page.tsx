import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ui/ReadingProgress";
import Reveal from "@/components/ui/Reveal";
import { CHAPTERS, formatDate, getPost, getPosts, type Post } from "@/lib/blog";
import { ME } from "@/lib/data";
import { OPEN_GRAPH } from "@/lib/site";
import { wrap } from "@/lib/styles";

type Props = { params: { slug: string } };

/** The one column everything on the page sits in, so it all shares a left edge: narrow enough that lines stay comfortable to read. */
const TEXT = "mx-auto max-w-[760px]";

/** Stories with their own page here, in timeline order. */
function readable() {
  return getPosts().filter((post) => !post.link && !post.soon);
}

export function generateStaticParams() {
  return readable().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Blog" };
  const images = post.cover ?? "/opengraph-image";
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { ...OPEN_GRAPH, type: "article", url: `/blog/${post.slug}`, title: post.title, description: post.description, publishedTime: post.date, images },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images },
  };
}

/** One story: its chapter, title and byline, the cover, then the story itself,
    and the stories either side of it on the timeline. */
export default function PostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const chapter = CHAPTERS.find((c) => c.id === post.section);
  const stories = readable();
  const at = stories.findIndex((story) => story.slug === post.slug);
  const previous = stories[at - 1];
  const next = stories[at + 1];

  return (
    <main>
      <ReadingProgress />

      <article className="relative overflow-hidden pb-20 pt-10 md:pb-24 md:pt-20">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(234,4,93,.12),transparent_40%)]" />

        <header className={`${wrap} relative`}>
          <div className={TEXT}>
          <Link href={`/blog#${post.section}`} className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-vivid-pink">
            <Arrow className="size-4 rotate-180" />
            All stories
          </Link>

          <Reveal className="mt-12 md:mt-16">
            {chapter && (
              <Link
                href={`/blog#${chapter.id}`}
                className={`inline-flex items-center gap-2 rounded-full border border-crimson/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition hover:border-vivid-pink ${chapter.tone}`}
              >
                <span aria-hidden className="size-2 rounded-full bg-vivid-pink" />
                {chapter.name}
              </Link>
            )}
            <h1 className="mt-5 text-[clamp(36px,6vw,68px)] font-extrabold leading-[.98] tracking-tighter">{post.title}</h1>

            {/* Byline */}
            <div className="mt-8 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero.jpg" alt="" className="size-11 shrink-0 rounded-full object-cover object-top ring-2 ring-vivid-pink ring-offset-2 ring-offset-light-red" />
              <div className="text-sm leading-snug">
                <p className="font-semibold">{ME.name}</p>
                <p className="text-crimson/60">
                  {formatDate(post.date)} · {post.minutes} min read
                </p>
              </div>
            </div>
          </Reveal>
          </div>
        </header>

        {/* The cover opens the story */}
        {post.cover && (
          <div className={`${wrap} relative mt-12 md:mt-14`}>
            <Reveal className={TEXT}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover}
                alt=""
                className={`aspect-[16/10] w-full rounded-[28px] object-cover shadow-[0_30px_60px_rgba(30,1,7,.18)] md:aspect-[2/1] ${post.coverTop ? "object-top" : ""}`}
              />
            </Reveal>
          </div>
        )}

        <div className={`${wrap} relative`}>
          <div className={TEXT}>
          {/* The story, written in Markdown in content/blog/. Its opening paragraph reads a little larger, as the way in. */}
          <div
            className="prose prose-lg mt-12 max-w-none md:mt-16 prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-crimson prose-h2:mt-14 prose-h2:border-l-4 prose-h2:border-vivid-pink prose-h2:pl-4 prose-p:text-crimson/85 prose-a:font-semibold prose-a:text-vivid-pink prose-a:decoration-2 prose-a:underline-offset-4 prose-strong:text-crimson prose-li:text-crimson/85 prose-blockquote:rounded-r-[16px] prose-blockquote:border-vivid-pink prose-blockquote:bg-white/60 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-crimson prose-code:text-crimson prose-code:before:content-none prose-code:after:content-none prose-img:rounded-[20px] prose-img:shadow-[0_20px_40px_rgba(30,1,7,.12)] [&>p:first-of-type]:text-[1.2em] [&>p:first-of-type]:font-normal [&>p:first-of-type]:text-crimson"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* The end of the story */}
          <div aria-hidden className="mt-14 flex items-center gap-3 text-vivid-pink">
            <span className="size-1.5 rounded-full bg-current" />
            <span className="size-2.5 rounded-full bg-current" />
            <span className="size-1.5 rounded-full bg-current" />
          </div>

          {/* The stories either side of this one on the timeline */}
          {(previous || next) && (
            <nav aria-label="More stories" className="mt-16 grid gap-4 sm:grid-cols-2">
              {previous && <StoryLink post={previous} label="Previous story" />}
              {next && <StoryLink post={next} label="Next story" />}
            </nav>
          )}
          </div>
        </div>
      </article>

      <Cta />
      <Footer />
    </main>
  );
}

/** A link to the previous or next story: its photo, which way it is, and its title. */
function StoryLink({ post, label }: { post: Post; label: string }) {
  const back = label.startsWith("Previous");
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-center gap-4"
    >
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt="" loading="lazy" className={`size-20 shrink-0 rounded-[14px] object-cover transition duration-300 group-hover:scale-[1.04] ${post.coverTop ? "object-top" : ""}`} />
      )}
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-vivid-pink">
          {back && <Arrow className="size-3.5 rotate-180" />}
          {label}
          {!back && <Arrow className="size-3.5" />}
        </p>
        <p className="mt-1 line-clamp-2 font-extrabold leading-snug tracking-tight transition group-hover:text-vivid-pink">{post.title}</p>
      </div>
    </Link>
  );
}

function Arrow({ className }: { className: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
