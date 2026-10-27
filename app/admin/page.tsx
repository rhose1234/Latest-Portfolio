import type { Metadata } from "next";
import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/admin";
import { getPosts } from "@/lib/blog";
import { db, type Comment } from "@/lib/supabase";
import { wrap } from "@/lib/styles";
import { logout, markAllSeen, remove, reply, setHidden } from "./actions";
import LoginForm from "./LoginForm";

/* My private page for blog comments: read them, reply, hide or delete. Not linked anywhere and kept out of search engines. */

export const metadata: Metadata = { title: "Comments admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured() || !db()) {
    return (
      <Shell>
        <h1 className="text-4xl font-extrabold tracking-tighter">Almost there</h1>
        <p className="mt-4 max-w-[50ch] leading-relaxed text-crimson/75">
          Comments need setting up first: add <code>SUPABASE_URL</code>, <code>SUPABASE_SECRET_KEY</code> and an <code>ADMIN_PASSWORD</code> of at least 8 characters
          to <code>.env.local</code> and to Vercel.
        </p>
      </Shell>
    );
  }

  if (!isAdmin()) {
    return (
      <Shell>
        <h1 className="text-4xl font-extrabold tracking-tighter">Comments admin</h1>
        <p className="mt-3 text-crimson/70">Sign in to read and reply to comments on your blog.</p>
        <LoginForm />
      </Shell>
    );
  }

  const { data } = await db()!.from("comments").select("*").order("created_at", { ascending: false }).limit(500);
  const rows = (data ?? []) as Comment[];
  const titles = new Map(getPosts().map((post) => [post.slug, post.title]));
  const readers = rows.filter((row) => !row.parent_id);
  const repliesTo = (id: number) => rows.filter((row) => row.parent_id === id).reverse();
  const unseen = readers.filter((row) => !row.seen).length;

  return (
    <Shell wide>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter">Comments</h1>
          <p className="mt-2 text-crimson/70">
            {readers.length} {readers.length === 1 ? "comment" : "comments"}
            {unseen > 0 && <span className="ml-2 rounded-full bg-vivid-pink px-2.5 py-0.5 text-xs font-bold text-white">{unseen} new</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {unseen > 0 && (
            <form action={markAllSeen}>
              <button className="rounded-full border-2 border-crimson px-4 py-2 text-sm font-semibold transition hover:bg-crimson hover:text-light-red">Mark all read</button>
            </form>
          )}
          <form action={logout}>
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-crimson/60 transition hover:text-vivid-pink">Sign out</button>
          </form>
        </div>
      </div>

      {readers.length === 0 && <p className="mt-10 rounded-[24px] border-2 border-dashed border-crimson/30 px-6 py-14 text-center">No comments yet.</p>}

      <ul className="mt-8 space-y-5">
        {readers.map((comment) => (
          <li key={comment.id} className={`rounded-[24px] border bg-white p-5 md:p-6 ${comment.seen ? "border-crimson/10" : "border-vivid-pink shadow-[0_0_0_4px_rgba(234,4,93,.1)]"}`}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {!comment.seen && <span className="rounded-full bg-vivid-pink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">New</span>}
              {comment.hidden && <span className="rounded-full bg-crimson/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Hidden</span>}
              <span className="font-bold">{comment.name}</span>
              <span className="text-crimson/50">{new Date(comment.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
              <Link href={`/blog/${comment.slug}`} target="_blank" className="text-crimson/60 underline underline-offset-2 hover:text-vivid-pink">
                on “{titles.get(comment.slug) ?? comment.slug}”
              </Link>
            </div>
            <p className={`mt-2 whitespace-pre-line break-words leading-relaxed ${comment.hidden ? "text-crimson/40 line-through" : ""}`}>{comment.body}</p>

            {repliesTo(comment.id).map((answer) => (
              <div key={answer.id} className="mt-3 flex items-start justify-between gap-3 rounded-2xl bg-vivid-pink/10 p-4">
                <p className="whitespace-pre-line break-words text-sm leading-relaxed">
                  <span className="font-bold">You replied: </span>
                  {answer.body}
                </p>
                <form action={remove}>
                  <input type="hidden" name="id" value={answer.id} />
                  <button className="shrink-0 text-xs font-semibold text-crimson/50 hover:text-red-600">Delete reply</button>
                </form>
              </div>
            ))}

            <form action={reply} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="parent_id" value={comment.id} />
              <textarea
                name="body"
                required
                rows={1}
                maxLength={2000}
                placeholder={`Reply to ${comment.name}…`}
                className="min-h-[46px] flex-1 resize-y rounded-xl border border-crimson/20 bg-light-red/30 px-4 py-2.5 text-sm outline-none transition focus:border-vivid-pink"
              />
              <button className="rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-light-red transition hover:bg-vivid-pink hover:text-white">Reply</button>
            </form>

            <div className="mt-3 flex gap-4 text-sm font-semibold">
              <form action={setHidden}>
                <input type="hidden" name="id" value={comment.id} />
                <input type="hidden" name="hidden" value={String(!comment.hidden)} />
                <button className="text-crimson/60 hover:text-vivid-pink">{comment.hidden ? "Show on the post" : "Hide from the post"}</button>
              </form>
              <form action={remove}>
                <input type="hidden" name="id" value={comment.id} />
                <button className="text-crimson/60 hover:text-red-600">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function Shell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="min-h-svh py-12 md:py-16">
      <div className={`${wrap} ${wide ? "max-w-[900px]" : "max-w-[560px]"}`}>
        <Link href="/" className="text-sm font-semibold transition hover:text-vivid-pink">← Back to the site</Link>
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
