import type { Metadata } from "next";
import Link from "next/link";
import { btnGhostLight, btnPink } from "@/lib/styles";

export const metadata: Metadata = { title: "Page not found" };

/** Shown for any link that doesn't exist: the hero's lanyard ID card, reading 404. */
export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-crimson-loading px-7 pb-16 pt-40 text-center text-light-red">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[30%] size-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(234,4,93,.35),transparent_30%)]" />

      {/* The card hangs from the top of the screen and sways a little */}
      <div aria-hidden className="relative origin-[50%_-160px] motion-safe:animate-[sway_5s_ease-in-out_infinite]">
        <div className="absolute bottom-[calc(100%-6px)] left-1/2 h-screen w-3 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300" />
        <div className="absolute -top-2.5 left-1/2 z-10 flex h-4 w-10 -translate-x-1/2 items-center justify-center rounded-md border border-gray-500/30 bg-gradient-to-b from-gray-300 to-gray-400 shadow-lg">
          <div className="h-2 w-6 rounded-full bg-gray-500" />
        </div>
        <div className="relative w-[min(220px,60vw)] rounded-2xl border border-white/30 bg-white/10 p-5 pt-8 text-left shadow-[0_20px_60px_rgba(0,0,0,.65)] backdrop-blur-md">
          <p className="text-[64px] font-extrabold leading-none tracking-tighter text-white">404</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-vivid-pink">Page not found</p>
          <div className="mt-6 flex h-8 items-stretch gap-0.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <i key={i} className={`bg-white/80 ${i % 4 === 0 ? "w-px" : i % 3 === 0 ? "w-1" : "w-0.5"}`} />
            ))}
          </div>
        </div>
      </div>

      <h1 className="relative mt-14 text-[clamp(34px,6vw,64px)] font-extrabold leading-[.95] tracking-tighter text-white">This page went off script</h1>
      <p className="relative mt-4 max-w-[40ch] leading-relaxed text-light-red/75">The link might be broken, or the page has moved. Let&apos;s get you back to the good part.</p>
      <div className="relative mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className={btnPink}>
          Back home
        </Link>
        <Link href="/rate-card" className={btnGhostLight}>
          See my UGC rate card
        </Link>
      </div>
    </main>
  );
}
