import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import PostEngagement from "@/components/PostEngagement";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { ME } from "@/lib/data";
import { OPEN_GRAPH } from "@/lib/site";
import { wrap } from "@/lib/styles";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getPosts()
    .filter((post) => !post.link && !post.soon)
    .map((post) => ({ slug: post.slug }));
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

/** One blog post: title, date and reading time, the cover if there is one, then the post itself. */
export default function PostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <main>
      <article className="pb-20 pt-10 md:pb-24 md:pt-20">
        <div className={`${wrap} max-w-[780px]`}>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-vivid-pink">
            <svg aria-hidden className="size-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            All stories
          </Link>

          <p className="mt-12 text-sm text-crimson/60 md:mt-16">
            {formatDate(post.date)} · {post.minutes} min read · by {ME.name}
          </p>
          <h1 className="mt-3 text-[clamp(34px,5.5vw,64px)] font-extrabold leading-[1] tracking-tighter">{post.title}</h1>
          {post.description && <p className="mt-5 text-lg leading-relaxed text-crimson/75 md:text-xl">{post.description}</p>}

          {post.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt="" className="mt-10 aspect-[16/9] w-full rounded-[24px] object-cover shadow-[0_24px_50px_rgba(30,1,7,.18)]" />
          )}

          {/* The post, written in Markdown in content/blog/ */}
          <div
            className="prose prose-lg mt-10 max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-crimson prose-p:text-crimson/85 prose-a:text-vivid-pink prose-strong:text-crimson prose-li:text-crimson/85 prose-blockquote:border-vivid-pink prose-blockquote:text-crimson prose-code:text-crimson prose-code:before:content-none prose-code:after:content-none prose-img:rounded-[20px]"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <PostEngagement slug={post.slug} />
        </div>
      </article>

      <Cta />
      <Footer />
    </main>
  );
}
