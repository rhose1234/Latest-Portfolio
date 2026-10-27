"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin, signIn, signOut } from "@/lib/admin";
import { ME } from "@/lib/data";
import { cleanText, db } from "@/lib/supabase";

/* What the buttons on /admin do. Every action checks the sign-in first. */

export async function login(_: unknown, form: FormData) {
  if (signIn(String(form.get("password") ?? ""))) redirect("/admin");
  return { error: "That password isn't right." };
}

export async function logout() {
  signOut();
  redirect("/admin");
}

function supabaseForAdmin() {
  const supabase = db();
  if (!isAdmin() || !supabase) throw new Error("Not signed in");
  return supabase;
}

export async function reply(form: FormData) {
  const supabase = supabaseForAdmin();
  const parentId = Number(form.get("parent_id"));
  const body = cleanText(form.get("body"), 2000, true);
  if (!parentId || body.length < 1) return;
  const { data: parent } = await supabase.from("comments").select("slug").eq("id", parentId).single();
  if (!parent) return;
  await supabase.from("comments").insert({ slug: parent.slug, parent_id: parentId, name: ME.name, body, is_author: true, seen: true });
  await supabase.from("comments").update({ seen: true }).eq("id", parentId);
  revalidatePath("/admin");
}

export async function setHidden(form: FormData) {
  const supabase = supabaseForAdmin();
  await supabase.from("comments").update({ hidden: form.get("hidden") === "true", seen: true }).eq("id", Number(form.get("id")));
  revalidatePath("/admin");
}

export async function remove(form: FormData) {
  const supabase = supabaseForAdmin();
  await supabase.from("comments").delete().eq("id", Number(form.get("id")));
  revalidatePath("/admin");
}

export async function markAllSeen() {
  const supabase = supabaseForAdmin();
  await supabase.from("comments").update({ seen: true }).eq("seen", false);
  revalidatePath("/admin");
}
