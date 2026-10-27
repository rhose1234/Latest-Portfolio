import "server-only";
import { createHash } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* The database for blog likes and comments. Only ever used on the server: the secret key can read and write everything.
   Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local and on Vercel (see supabase/schema.sql for the tables). */

let client: SupabaseClient | null | undefined;

/** The server's database connection, or null while Supabase isn't set up yet. */
export function db(): SupabaseClient | null {
  if (client === undefined) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  }
  return client;
}

export type Comment = { id: number; slug: string; parent_id: number | null; name: string; body: string; is_author: boolean; hidden: boolean; seen: boolean; created_at: string };

/** A one-way scramble of the visitor's IP address, so the spam limit works without storing the address itself. */
export function hashIp(ip: string) {
  return createHash("sha256").update(`${ip}:${process.env.ADMIN_PASSWORD ?? "salt"}`).digest("hex").slice(0, 32);
}

/** Trims text, drops invisible control characters (keeping line breaks in comments) and caps the length. */
export function cleanText(value: unknown, max: number, multiline = false) {
  let text = String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/g, "");
  text = multiline ? text.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n") : text.replace(/\s+/g, " ");
  return text.trim().slice(0, max);
}
