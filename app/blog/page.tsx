import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Scribble from "@/components/ui/Scribble";
import ScrollTimeline from "@/components/ui/ScrollTimeline";
import { CHAPTERS, formatDate, getPosts, type Post } from "@/lib/blog";
import { ME } from "@/lib/data";
import { OPEN_GRAPH } from "@/lib/site";
import { wrap } from "@/lib/styles";

/** The column the hero and the timeline share, so they line up. */
const COLUMN = "mx-auto max-w-[1000px]";

const TITLE = "Tech Life & The Twist";
const DESCRIPTION = "From my first lines of code to my first time on camera: the wins, the struggles, and the twist that made a developer a storyteller.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { ...OPEN_GRAPH, url: "/blog", title: `${TITLE} | ${ME.name}`, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: `${TITLE} | ${ME.name}`, description: DESCRIPTION },
};

/** The blog: a hero, then each chapter with its posts. Posts come from the Markdown files in content/blog/. */
export default function BlogPage() {
  const posts = getPosts();
  const chapters = CHAPTERS.map((chapter) => ({ ...chapter, posts: posts.filter((post) => post.section === chapter.id) })).filter(
    (chapter) => chapter.posts.length > 0,
  );

  return (
    <main>
      {/* Fills the screen: Back home at the top, the heading and photo centred in the space below it */}
      <header className="relative flex min-h-svh flex-col overflow-hidden pb-16 pt-10 md:pb-20 md:pt-20">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(234,4,93,.12),transparent_40%)]" />
        <div className={`${wrap} relative flex flex-1 flex-col`}>
          {/* The same centred column as the timeline below, so everything starts from one left edge */}
          <div className={`${COLUMN} flex w-full flex-1 flex-col`}>
          <Link href="/" className="inline-flex items-center gap-2 self-start text-sm font-semibold transition hover:text-vivid-pink">
            <Arrow className="size-4 rotate-180" />
            Back home
          </Link>

          <div className="my-auto grid items-center gap-12 pt-12 md:pt-16 md:grid-cols-[minmax(0,1fr)_auto] lg:justify-between lg:gap-16">
            {/* Centred on phones, where the photo sits under it; beside the photo from tablets up */}
            <Reveal className="text-center md:text-left">
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
              <p className="mx-auto mt-8 max-w-[46ch] text-base leading-relaxed text-crimson/75 md:mx-0 md:text-[19px]">{DESCRIPTION}</p>
            </Reveal>

            {/* A snapshot, taped on like a photo in a journal */}
            <Reveal delay={0.15} className="relative mx-auto w-[220px] sm:w-[240px] md:w-[260px] lg:w-[300px]">
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
        </div>
      </header>

      <div className={`${wrap} pb-20 md:pb-24`}>
        {chapters.length ? (
          // One line down the page: each chapter is a big marker on it, each story a dot with its card beside it
          <ScrollTimeline className={COLUMN}>
            {chapters.map((chapter) => (
              <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-title`} className="scroll-mt-8 pb-16 last:pb-0 md:pb-20">
                {/* On wide screens the marker sits on the middle line, with the heading centred under it */}
                <Reveal className="relative pl-16 md:pl-20 lg:pl-0 lg:pt-16 lg:text-center">
                  <span aria-hidden className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full bg-vivid-pink shadow-[0_0_0_6px_rgba(234,4,93,.15)] md:size-12 lg:left-1/2 lg:-translate-x-1/2">
                    <span className="size-3 rounded-full bg-white" />
                  </span>
                  {/* The page colour behind the text hides the line where it runs through the heading */}
                  <div className="lg:relative lg:mx-auto lg:w-fit lg:max-w-[600px] lg:bg-light-red lg:px-6 lg:py-2">
                    <h2 id={`${chapter.id}-title`} className="text-[clamp(30px,4.5vw,52px)] font-extrabold leading-none tracking-tighter">
                      {chapter.name}
                    </h2>
                  </div>
                </Reveal>

                {/* One column beside the line on phones; on wide screens stories alternate either side of it,
                    the right-hand ones dropped a little so the two sides interleave */}
                <ol className={`mt-10 space-y-6 md:space-y-8 lg:grid lg:grid-cols-2 lg:gap-x-24 lg:gap-y-10 lg:space-y-0 ${chapter.posts.length % 2 === 0 ? "lg:pb-16" : ""}`}>
                  {chapter.posts.map((post, i) => (
                    <li key={post.slug} className={`relative pl-16 md:pl-20 lg:pl-0 ${i % 2 ? "lg:translate-y-16" : ""}`}>
                      {/* This story's dot on the line */}
                      <span
                        aria-hidden
                        className={`absolute left-3 top-8 size-4 rounded-full border-[3px] border-vivid-pink bg-light-red md:left-4 lg:top-8 ${i % 2 ? "lg:-left-14" : "lg:-right-14 lg:left-auto"}`}
                      />
                      <Reveal>
                        <StoryCard post={post} tone={chapter.tone} />
                      </Reveal>
                    </li>
                  ))}
                </ol>

                {chapter.more && (
                  <Reveal className="mt-12 pl-16 md:pl-20 lg:mt-20 lg:pl-0 lg:text-center">
                    <a
                      href={chapter.more.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border-2 border-crimson bg-light-red px-5 py-2.5 font-semibold transition hover:bg-crimson hover:text-light-red"
                    >
                      {chapter.more.label}
                      <Arrow className="size-4 -rotate-45 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </Reveal>
                )}
              </section>
            ))}
          </ScrollTimeline>
        ) : (
          <p className="rounded-[28px] border-2 border-dashed border-crimson/30 px-6 py-16 text-center text-base">My first stories are on the way. Check back soon.</p>
        )}
      </div>

      <Cta />
      <Footer />
    </main>
  );
}

/** A story on the timeline: the date, title and the first two lines of the story. Its photo is saved for the story's own page.
    Published stories link to their page, or to Medium; coming-soon ones aren't clickable yet. */
function StoryCard({ post, tone }: { post: Post; tone: string }) {
  const external = Boolean(post.link);
  const card = `group block rounded-[20px] border border-crimson/10 shadow-[0_10px_24px_rgba(30,1,7,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(30,1,7,.14)] ${tone}`;

  const body = (
    <>
      <div className="flex flex-col justify-center p-5 md:p-6">
        {post.soon ? (
          <span className="self-start rounded-full bg-crimson px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-light-red">Coming soon</span>
        ) : (
          <p className="text-sm text-crimson/60">
            {/* A Medium post's text isn't here to time, so just say where it is */}
            {formatDate(post.date)} · {external ? "On Medium" : `${post.minutes} min read`}
          </p>
        )}
        <h3 className="mt-2 text-[clamp(18px,1.8vw,22px)] font-extrabold leading-tight tracking-tighter">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-crimson/70">{post.excerpt}</p>}
        {!post.soon && (
          <span className="mt-4 inline-flex items-center gap-1 self-start font-semibold underline decoration-2 underline-offset-4 transition group-hover:text-vivid-pink">
            {external ? "Read on Medium" : "Read story"}
            <Arrow className={`size-4 transition-transform group-hover:translate-x-0.5 ${external ? "-rotate-45" : ""}`} />
          </span>
        )}
      </div>
    </>
  );

  if (post.soon) return <div className={card}>{body}</div>;
  return (
    <Link href={post.link ?? `/blog/${post.slug}`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={card}>
      {body}
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
