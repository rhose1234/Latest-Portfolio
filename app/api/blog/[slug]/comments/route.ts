import { NextResponse } from "next/server";
import { getPost } from "@/lib/blog";
import { cleanText, db, hashIp, type Comment } from "@/lib/supabase";

/* A post's comments. Readers post with just a name; my replies are added from /admin. */

export const dynamic = "force-dynamic";

/** At most this many comments per visitor in this many minutes. */
const LIMIT = { count: 5, minutes: 10 };

type Params = { params: { slug: string } };
type PublicComment = Pick<Comment, "id" | "name" | "body" | "is_author" | "created_at"> & { replies: PublicComment[] };

export async function GET(_: Request, { params }: Params) {
  const supabase = db();
  if (!supabase) return NextResponse.json({ ready: false, comments: [] });
  if (!getPost(params.slug)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("comments")
    .select("id, parent_id, name, body, is_author, created_at")
    .eq("slug", params.slug)
    .eq("hidden", false)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: "Couldn't load comments" }, { status: 500 });

  // Readers' comments at the top level, newest first, each with my replies under it, oldest first
  const rows = data as (Comment & { parent_id: number | null })[];
  const shape = (row: Comment): PublicComment => ({ id: row.id, name: row.name, body: row.body, is_author: row.is_author, created_at: row.created_at, replies: [] });
  const top = rows.filter((row) => !row.parent_id).map(shape);
  const byId = new Map(top.map((comment) => [comment.id, comment]));
  for (const row of rows) if (row.parent_id) byId.get(row.parent_id)?.replies.push(shape(row));
  return NextResponse.json({ ready: true, comments: top.reverse() });
}

export async function POST(request: Request, { params }: Params) {
  const supabase = db();
  if (!supabase) return NextResponse.json({ error: "Comments aren't set up yet" }, { status: 503 });
  if (!getPost(params.slug)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const input = await request.json().catch(() => ({}));
  // Bots fill in the hidden field; pretend it worked and save nothing
  if (input.website) return NextResponse.json({ ok: true });

  const name = cleanText(input.name, 60);
  const body = cleanText(input.body, 2000, true);
  if (name.length < 2) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  if (body.length < 2) return NextResponse.json({ error: "Please write a comment." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const ipHash = hashIp(ip);
  const since = new Date(Date.now() - LIMIT.minutes * 60_000).toISOString();
  const { count } = await supabase.from("comments").select("*", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if ((count ?? 0) >= LIMIT.count) return NextResponse.json({ error: "You're commenting very fast. Please try again in a few minutes." }, { status: 429 });

  const { data, error } = await supabase
    .from("comments")
    .insert({ slug: params.slug, name, body, ip_hash: ipHash })
    .select("id, name, body, is_author, created_at")
    .single();
  if (error) return NextResponse.json({ error: "Couldn't post your comment. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true, comment: { ...data, replies: [] } });
}
