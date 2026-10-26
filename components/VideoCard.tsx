"use client";
import { useEffect, useRef, useState } from "react";
import { ME, type UgcVideo } from "@/lib/data";
import { SOCIALS } from "@/lib/socials";

const PLATFORMS = [
  { key: "instagram", name: "Instagram" },
  { key: "x", name: "X" },
  { key: "tiktok", name: "TikTok" },
] as const;

type Props = {
  video: UgcVideo;
  brand: string;
  index: number;
  /** False while the card sits behind others in a deck: it stops playing. */
  active?: boolean;
  onPlayingChange?: (playing: boolean) => void;
};

/** A UGC video on a phone screen: a cover with a play button, its length and title, and icons for where it was posted. Tapping play swaps in the video. */
export default function VideoCard({ video, brand, index, active = true, onPlayingChange }: Props) {
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLVideoElement>(null);
  const title = video.title ?? `Story ${String(index + 1).padStart(2, "0")}`;

  // Each icon opens this video's post, or my profile on that platform until the post's link is added
  const posted = PLATFORMS.flatMap((platform) => {
    const post = video.links?.[platform.key];
    const icon = SOCIALS.find((social) => social.name === platform.name)?.icon;
    return icon ? [{ ...platform, url: post || ME[platform.key], label: post ? `Watch on ${platform.name}` : `${ME.name} on ${platform.name}`, icon }] : [];
  });

  useEffect(() => {
    if (playing) player.current?.play().catch(() => {});
    onPlayingChange?.(playing);
  }, [playing, onPlayingChange]);

  useEffect(() => {
    if (!active) setPlaying(false);
  }, [active]);

  return (
    // A phone: crimson bezel and notch around the screen, with the icons down the right side like a Reels or TikTok screen
    <div className="group relative aspect-[9/16.4] w-full rounded-[38px] border-[7px] border-crimson bg-crimson shadow-[0_24px_50px_rgba(30,1,7,.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_60px_rgba(30,1,7,.34)]">
      <div className="relative h-full overflow-hidden rounded-[31px] bg-crimson">
        {playing ? (
          <video
            ref={player}
            src={video.src}
            poster={video.cover}
            controls
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            // Only one video plays at a time
            onPlay={(event) => document.querySelectorAll("video").forEach((other) => other !== event.currentTarget && other.pause())}
            onEnded={() => setPlaying(false)}
          />
        ) : (
          <>
            {video.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={video.cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            ) : (
              <video src={`${video.src}#t=0.1`} preload="metadata" muted playsInline aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            )}
            {/* Darkens the top and bottom so the notch, length, title and icons read on any frame */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-crimson/85 via-crimson/0 to-crimson/45" />

            {video.length && (
              <span className="pointer-events-none absolute left-4 top-3.5 text-xs font-bold text-white">{video.length}</span>
            )}

            <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${brand} ${title}`} className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex size-16 items-center justify-center rounded-full bg-vivid-pink text-white shadow-[0_12px_30px_rgba(234,4,93,.5)] transition duration-300 group-hover:scale-110">
                {/* A soft pulse on hover */}
                <span aria-hidden className="absolute inset-0 rounded-full bg-vivid-pink/50 group-hover:animate-ping" />
                <svg aria-hidden className="relative ml-1 size-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.14v13.72a1 1 0 001.5.86l11.2-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
                </svg>
              </span>
            </button>

            <p className="pointer-events-none absolute bottom-5 left-4 text-base font-bold leading-tight text-white">{title}</p>
          </>
        )}

        {/* Down the right side, above the video controls; they stay put while it plays */}
        {posted.length > 0 && (
          <div className="absolute bottom-16 right-2.5 flex flex-col gap-2">
            {posted.map((platform) => (
              <a
                key={platform.key}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform.label}
                className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-crimson/35 text-white backdrop-blur-md transition hover:scale-110 hover:border-vivid-pink hover:bg-vivid-pink"
              >
                <svg aria-hidden className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d={platform.icon} />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* The notch */}
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-crimson" />
      </div>
    </div>
  );
}
