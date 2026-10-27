import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPost } from "@/lib/blog";
import { db } from "@/lib/supabase";

/* A post's likes. Each reader gets a random id in a cookie, so one browser counts once and tapping again un-likes. */

export const dynamic = "force-dynamic";

const VISITOR = "vid";
const YEAR = 60 * 60 * 24 * 365;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Params = { params: { slug: string } };

function visitorId() {
  const id = cookies().get(VISITOR)?.value;
  return id && UUID.test(id) ? id : null;
}

async function summary(slug: string, visitor: string | null) {
  const supabase = db()!;
  const { count } = await supabase.from("likes").select("*", { count: "exact", head: true }).eq("slug", slug);
  let liked = false;
  if (visitor) {
    const { data } = await supabase.from("likes").select("slug").eq("slug", slug).eq("visitor_id", visitor).maybeSingle();
    liked = Boolean(data);
  }
  return { count: count ?? 0, liked };
}

export async function GET(_: Request, { params }: Params) {
  if (!db()) return NextResponse.json({ ready: false, count: 0, liked: false });
  if (!getPost(params.slug)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ready: true, ...(await summary(params.slug, visitorId())) });
}

/** Likes the post, or un-likes it if this reader already has. */
export async function POST(_: Request, { params }: Params) {
  const supabase = db();
  if (!supabase) return NextResponse.json({ error: "Likes aren't set up yet" }, { status: 503 });
  if (!getPost(params.slug)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const visitor = visitorId() ?? randomUUID();
  const { data: existing } = await supabase.from("likes").select("slug").eq("slug", params.slug).eq("visitor_id", visitor).maybeSingle();
  const { error } = existing
    ? await supabase.from("likes").delete().eq("slug", params.slug).eq("visitor_id", visitor)
    : await supabase.from("likes").insert({ slug: params.slug, visitor_id: visitor });
  if (error) return NextResponse.json({ error: "Couldn't save that like" }, { status: 500 });

  const response = NextResponse.json({ ready: true, ...(await summary(params.slug, visitor)) });
  response.cookies.set(VISITOR, visitor, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: YEAR, path: "/" });
  return response;
}
