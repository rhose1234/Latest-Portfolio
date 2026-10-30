import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { ME } from "@/lib/data";

/* Blog posts are Markdown files in content/blog/. The file name is the post's address: my-first-year.md -> /blog/my-first-year.
   Each starts with a few lines between --- marks:
     ---
     title: My first year in tech
     date: 2026-11-02
     description: One or two lines shown on the blog page and in link previews.
     cover: /images/blog/first-year.jpg   (optional, put the image in public/images/blog/)
     coverTop: true                       (optional, crops the cover from its top, e.g. for a screenshot)
     draft: true                          (optional, hides the post completely)
     soon: true                           (optional, shows it on the blog page as Coming soon, without its own page yet)
     order: 3                             (optional, its place on the timeline: lower numbers come first, coming soon or not)
     section: twist                       (which chapter it goes in: tech, twist or technical; tech if left out)
     link: https://medium.com/…           (optional, for a post published elsewhere: the card opens it there)
     ---
   Then the post itself in Markdown. Files starting with _ (like _example.md) are never published. */

const FOLDER = join(process.cwd(), "content/blog");

export type Section = "tech" | "twist" | "technical";

/** The blog's chapters, in the order they appear. Each post picks one with "section:" in its file.
    A chapter with "more" ends with a link to where the rest of its posts live. */
export const CHAPTERS: { id: Section; name: string; tone: string; more?: { label: string; href: string } }[] = [
  { id: "tech", name: "Tech Life", tone: "bg-white" },
  { id: "twist", name: "The Twist", tone: "bg-[#ffc8d4]" },
  {
    id: "technical",
    name: "Technical write-ups",
    tone: "bg-[#e6ddff]",
    more: { label: "Read more on Medium", href: ME.medium },
  },
];

export type Post = { slug: string; section: Section; title: string; date: string; description: string; cover?: string; coverTop: boolean; link?: string; soon: boolean; order: number; minutes: number; excerpt: string; html: string };

/** The opening of a post as plain text, for the short preview on its card. Empty for posts with no text here yet. */
function excerpt(markdown: string) {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, "") // notes left in coming-soon posts
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // photos
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links keep their words
    .replace(/^#+\s.*$/gm, "") // headings
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

function read(file: string): Post & { draft: boolean } {
  const { data, content } = matter(readFileSync(join(FOLDER, file), "utf-8"));
  return {
    slug: file.replace(/\.md$/, ""),
    section: (["tech", "twist", "technical"].includes(data.section) ? data.section : "tech") as Section,
    title: String(data.title ?? "Untitled"),
    // YAML turns 2026-11-02 into a Date, so normalise it back to the plain date
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
    description: String(data.description ?? ""),
    cover: data.cover ? String(data.cover) : undefined,
    coverTop: Boolean(data.coverTop),
    link: data.link ? String(data.link) : undefined,
    draft: Boolean(data.draft),
    soon: Boolean(data.soon),
    order: Number(data.order ?? 99),
    minutes: Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200)),
    excerpt: excerpt(content),
    // With async off, marked returns the HTML straight away; its type just doesn't know that
    // Photos inside a story only load as the reader nears them
    html: (marked.parse(content, { async: false }) as string).replaceAll("<img ", '<img loading="lazy" decoding="async" '),
  };
}

/** Every post that's out or coming soon, in story order so the timeline reads in sequence. Posts without an order go last, newest first. */
export function getPosts(): Post[] {
  let files: string[] = [];
  try {
    files = readdirSync(FOLDER).filter((file) => file.endsWith(".md") && !file.startsWith("_"));
  } catch {
    return [];
  }
  return files
    .map(read)
    .filter((post) => !post.draft)
    .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
}

/** A post that has its own page here, so not one that only links elsewhere or is still coming soon. */
export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug && !post.link && !post.soon);
}

/** "2026-11-02" -> "2 November 2026" */
export function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
