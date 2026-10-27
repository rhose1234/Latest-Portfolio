"use client";
import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ME } from "@/lib/data";

/* Under each blog post: a like button and the comments. My replies come from /admin. */

type Reply = { id: number; name: string; body: string; is_author: boolean; created_at: string };
type Comment = Reply & { replies: Reply[] };
type Status = { kind: "idle" | "sending" } | { kind: "success" | "error"; text: string };

const SUCCESS_SECONDS = 5;

export default function PostEngagement({ slug }: { slug: string }) {
  const [ready, setReady] = useState<boolean | null>(null);
  const [likes, setLikes] = useState({ count: 0, liked: false });
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    Promise.all([fetch(`/api/blog/${slug}/likes`).then((r) => r.json()), fetch(`/api/blog/${slug}/comments`).then((r) => r.json())])
      .then(([likeData, commentData]) => {
        setReady(Boolean(likeData.ready && commentData.ready));
        setLikes({ count: likeData.count ?? 0, liked: Boolean(likeData.liked) });
        setComments(commentData.comments ?? []);
      })
      .catch(() => setReady(false));
  }, [slug]);

  useEffect(() => {
    if (status.kind !== "success") return;
    const timer = setTimeout(() => setStatus({ kind: "idle" }), SUCCESS_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [status]);

  const toggleLike = async () => {
    // Show the change straight away, then settle on what the server says
    setLikes((current) => ({ count: current.count + (current.liked ? -1 : 1), liked: !current.liked }));
    try {
      const data = await (await fetch(`/api/blog/${slug}/likes`, { method: "POST" })).json();
      if (typeof data.count === "number") setLikes({ count: data.count, liked: Boolean(data.liked) });
    } catch {
      setLikes((current) => ({ count: current.count + (current.liked ? -1 : 1), liked: !current.liked }));
    }
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    const website = new FormData(event.currentTarget).get("website");
    setStatus({ kind: "sending" });
    try {
      const response = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, body, website }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (data.comment) setComments((current) => [data.comment, ...current]);
      setBody("");
      setStatus({ kind: "success", text: "Thanks! Your comment is up." });
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error && error.message ? error.message : "Couldn't post your comment. Please try again." });
    }
  }

  // Nothing shows until Supabase is set up, so the post never has a broken comments box
  if (!ready) return null;

  const total = comments.reduce((sum, comment) => sum + 1 + comment.replies.length, 0);

  return (
    <section aria-labelledby="comments-title" className="mt-16 border-t-2 border-crimson pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="comments-title" className="text-[clamp(26px,3.5vw,36px)] font-extrabold tracking-tighter">
          {total ? `${total} ${total === 1 ? "comment" : "comments"}` : "Comments"}
        </h2>
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={likes.liked}
          aria-label={likes.liked ? "Unlike this post" : "Like this post"}
          className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 font-semibold transition active:scale-95 ${
            likes.liked ? "border-vivid-pink bg-vivid-pink text-white" : "border-crimson hover:border-vivid-pink hover:text-vivid-pink"
          }`}
        >
          <motion.svg
            key={String(likes.liked)}
            aria-hidden
            className="size-5"
            viewBox="0 0 24 24"
            fill={likes.liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            initial={{ scale: likes.liked ? 0.4 : 1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 12 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </motion.svg>
          {likes.count} {likes.count === 1 ? "like" : "likes"}
        </button>
      </div>

      <form onSubmit={submit} className="mt-8 rounded-[24px] border border-crimson/10 bg-white p-5 shadow-[0_12px_30px_rgba(30,1,7,.06)] md:p-6">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <label htmlFor="comment-name" className="text-sm font-semibold">Your name</label>
        <input
          id="comment-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          required
          autoComplete="name"
          className="mt-1.5 w-full rounded-xl border border-crimson/20 bg-light-red/30 px-4 py-3 outline-none transition focus:border-vivid-pink"
        />
        <label htmlFor="comment-body" className="mt-4 block text-sm font-semibold">Your comment</label>
        <textarea
          id="comment-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={2000}
          required
          rows={4}
          placeholder="What did you think?"
          className="mt-1.5 w-full resize-y rounded-xl border border-crimson/20 bg-light-red/30 px-4 py-3 outline-none transition placeholder:text-crimson/40 focus:border-vivid-pink"
        />
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status.kind === "sending"}
            className="rounded-full bg-crimson px-6 py-3 font-semibold text-light-red transition hover:bg-vivid-pink hover:text-white active:scale-95 disabled:opacity-60"
          >
            {status.kind === "sending" ? "Posting..." : "Post comment"}
          </button>
          <p role="status" aria-live="polite" className={`text-sm font-medium ${status.kind === "success" ? "text-green-600" : "text-red-600"}`}>
            {(status.kind === "success" || status.kind === "error") && status.text}
          </p>
        </div>
      </form>

      <ul className="mt-8 space-y-6">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.li key={comment.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CommentBubble comment={comment} />
              {comment.replies.length > 0 && (
                <ul className="mt-3 space-y-3 border-l-2 border-vivid-pink/30 pl-4 md:ml-6 md:pl-6">
                  {comment.replies.map((reply) => (
                    <li key={reply.id}>
                      <CommentBubble comment={reply} />
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {!comments.length && <p className="mt-6 text-crimson/60">No comments yet. Be the first to share your thoughts.</p>}
    </section>
  );
}

/** One comment: avatar, name, date, then the words. My replies get my photo and an Author badge. */
function CommentBubble({ comment }: { comment: Reply }) {
  const date = new Date(comment.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className={`flex gap-3 rounded-[20px] p-4 md:p-5 ${comment.is_author ? "bg-vivid-pink/10" : "border border-crimson/10 bg-white"}`}>
      {comment.is_author ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/hero.jpg" alt="" className="size-10 shrink-0 rounded-full object-cover object-top" />
      ) : (
        <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6ddff] text-sm font-extrabold">
          {comment.name.trim()[0]?.toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-bold">{comment.is_author ? ME.name : comment.name}</span>
          {comment.is_author && <span className="rounded-full bg-vivid-pink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Author</span>}
          <span className="text-crimson/50">{date}</span>
        </p>
        <p className="mt-1.5 whitespace-pre-line break-words leading-relaxed text-crimson/85">{comment.body}</p>
      </div>
    </div>
  );
}
