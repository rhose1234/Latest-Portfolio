"use client";

type PhotoProps = { src: string; alt?: string; className?: string };

/** Image with a pink gradient fallback while the file is missing. */
export default function Photo({ src, alt = "", className = "" }: PhotoProps) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-vivid-pink to-light-red ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    </div>
  );
}
