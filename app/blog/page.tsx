import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Scribble from "@/components/ui/Scribble";
import { formatDate, getPosts, type Post, type Section } from "@/lib/blog";
import { ME } from "@/lib/data";
import { OPEN_GRAPH } from "@/lib/site";
import { wrap } from "@/lib/styles";

const TITLE = "Tech Life & The Twist";
const DESCRIPTION = "From my first lines of code to my first time on camera: the wins, the struggles, and the twist that made a developer a storyteller.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { ...OPEN_GRAPH, url: "/blog", title: `${TITLE} | ${ME.name}`, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: `${TITLE} | ${ME.name}`, description: DESCRIPTION },
};

/** The blog's chapters, in the order they appear. Each post picks one with "section:" in its file. */
const CHAPTERS: { id: Section; name: string; blurb: string; tone: string }[] = [
  { id: "tech", name: "Tech Life", blurb: "How I got into tech, what it's really been like, and the moments that shaped me.", tone: "bg-white" },
  { id: "twist", name: "The Twist", blurb: "Then came content creation: how a developer ended up on camera, telling stories for brands.", tone: "bg-[#ffc8d4]" },
  { id: "explainers", name: "Explainers", blurb: "Plain-English guides to tech terms people often mix up.", tone: "bg-[#e6ddff]" },
];

/** The blog: a hero, then each chapter with its posts. Posts come from the Markdown files in content/blog/. */
export default function BlogPage() {
  const posts = getPosts();
  const chapters = CHAPTERS.map((chapter) => ({ ...chapter, posts: posts.filter((post) => post.section === chapter.id) })).filter(
    (chapter) => chapter.posts.length > 0,
  );

  return (
    <main>
      <header className="relative overflow-hidden pb-16 pt-10 md:pb-20 md:pt-20">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(234,4,93,.12),transparent_40%)]" />
        <div className={`${wrap} relative`}>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-vivid-pink">
            <Arrow className="size-4 rotate-180" />
            Back home
          </Link>

          <div className="mt-12 grid items-center gap-12 md:mt-16 md:grid-cols-[1fr_auto] lg:gap-20">
            <Reveal>
              <h1 className="text-[clamp(44px,7vw,100px)] font-extrabold leading-[.92] tracking-tighter">
                Tech Life
                <br />
                <span className="text-vivid-pink">
                  &amp; The{" "}
                  <span className="relative inline-block">
                    Twist
                    <Scribble className="absolute -bottom-3 left-0 h-3 w-full md:-bottom-4 md:h-4" />
                  </span>
                </span>
              </h1>
              <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-crimson/75 md:text-[19px]">{DESCRIPTION}</p>

              {/* Jump to a chapter */}
              {chapters.length > 1 && (
                <nav aria-label="Chapters" className="mt-8 flex flex-wrap gap-2">
                  {chapters.map((chapter) => (
                    <a
                      key={chapter.id}
                      href={`#${chapter.id}`}
                      className="rounded-full border-2 border-crimson px-4 py-2 text-sm font-semibold transition hover:bg-crimson hover:text-light-red"
                    >
                      {chapter.name}
                    </a>
                  ))}
                </nav>
              )}
            </Reveal>

            {/* A snapshot, taped on like a photo in a journal */}
            <Reveal delay={0.15} className="relative mx-auto hidden w-[260px] md:block lg:w-[300px]">
              <div className="rotate-3 rounded-[10px] border border-crimson/10 bg-white p-3 pb-12 shadow-[0_24px_50px_rgba(30,1,7,.18)]">
                <span
                  aria-hidden
                  className="absolute -top-3.5 left-1/2 z-10 h-7 w-28 -translate-x-1/2 -rotate-3 bg-[#ffc8d4]/85 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.45)_0_6px,transparent_6px_12px)] shadow-[0_2px_6px_rgba(30,1,7,.12)]"
                />
                <Photo src="/images/about1.jpeg" alt={`${ME.name} taking a mirror selfie`} className="aspect-[4/5] rounded-[4px]" />
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      <div className={`${wrap} space-y-20 pb-20 md:space-y-24 md:pb-24`}>
        {chapters.length ? (
          chapters.map((chapter) => (
            <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-title`} className="scroll-mt-8">
              <Reveal className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-crimson pb-5">
                <div>
                  <h2 id={`${chapter.id}-title`} className="text-[clamp(30px,4.5vw,56px)] font-extrabold leading-none tracking-tighter">
                    {chapter.name}
                  </h2>
                  <p className="mt-3 max-w-[52ch] leading-relaxed text-crimson/70">{chapter.blurb}</p>
                </div>
                <p className="text-sm font-semibold text-crimson/60">
                  {chapter.posts.length} {chapter.posts.length === 1 ? "story" : "stories"}
                </p>
              </Reveal>

              <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {chapter.posts.map((post, i) => (
                  <li key={post.slug}>
                    <Reveal delay={(i % 3) * 0.08} className="h-full">
                      {post.soon ? <SoonCard post={post} tone={chapter.tone} /> : <PostCard post={post} tone={chapter.tone} />}
                    </Reveal>
                  </li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <p className="rounded-[28px] border-2 border-dashed border-crimson/30 px-6 py-16 text-center text-base">My first stories are on the way. Check back soon.</p>
        )}
      </div>

      <Cta />
      <Footer />
    </main>
  );
}

/** A published post, linking to its page here (or to Medium for posts that live there). */
function PostCard({ post, tone }: { post: Post; tone: string }) {
  return (
    <Link
      href={post.link ?? `/blog/${post.slug}`}
      {...(post.link ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group flex h-full flex-col overflow-hidden rounded-[24px] border border-crimson/10 shadow-[0_12px_30px_rgba(30,1,7,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(30,1,7,.14)] ${tone}`}
    >
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt="" loading="lazy" className={`aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.03] ${post.coverTop ? "object-top" : ""}`} />
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="text-sm text-crimson/60">
          {formatDate(post.date)} · {post.minutes} min read
        </p>
        <h3 className="mt-3 text-[clamp(20px,2vw,26px)] font-extrabold leading-tight tracking-tighter">{post.title}</h3>
        {post.description && <p className="mt-3 leading-relaxed text-crimson/75">{post.description}</p>}
        <span className="mt-6 inline-flex items-center gap-1 self-start pt-2 font-semibold underline decoration-2 underline-offset-4 transition group-hover:text-vivid-pink md:mt-auto">
          {post.link ? "Read on Medium" : "Read story"}
          <Arrow className={`size-4 transition-transform group-hover:translate-x-0.5 ${post.link ? "-rotate-45" : ""}`} />
        </span>
      </div>
    </Link>
  );
}

/** A post that's on the way: its title and teaser in the chapter's colour, not clickable yet. */
function SoonCard({ post, tone }: { post: Post; tone: string }) {
  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-[24px] border border-crimson/10 ${tone}`}>
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt="" loading="lazy" className={`aspect-[16/10] w-full object-cover ${post.coverTop ? "object-top" : ""}`} />
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <span className="self-start rounded-full bg-crimson px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-light-red">Coming soon</span>
        <h3 className="mt-4 text-[clamp(20px,2vw,26px)] font-extrabold leading-tight tracking-tighter">{post.title}</h3>
        {post.description && <p className="mt-3 leading-relaxed text-crimson/70">{post.description}</p>}
      </div>
    </div>
  );
}

function Arrow({ className }: { className: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
