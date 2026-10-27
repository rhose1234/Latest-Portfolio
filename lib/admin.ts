import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/* Signing in to /admin. The password is ADMIN_PASSWORD in .env.local and on Vercel.
   Signing in stores a signed cookie for 30 days; changing the password signs every device out. */

const COOKIE = "admin_session";
const DAYS = 30;

function sign(value: string) {
  return createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update(value).digest("hex");
}

function same(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Whether a password has been set up at all. */
export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);
}

export function isAdmin() {
  if (!adminConfigured()) return false;
  const [expires, signature] = (cookies().get(COOKIE)?.value ?? "").split(".");
  return Boolean(expires && signature && Number(expires) > Date.now() && same(signature, sign(expires)));
}

/** Checks the password and, if it's right, signs this browser in. */
export function signIn(password: string) {
  if (!adminConfigured() || !same(password, process.env.ADMIN_PASSWORD!)) return false;
  const expires = String(Date.now() + DAYS * 86_400_000);
  cookies().set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: DAYS * 86_400,
    path: "/admin",
  });
  return true;
}

export function signOut() {
  cookies().delete({ name: COOKIE, path: "/admin" });
}
