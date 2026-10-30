"use client";
import Image from "next/image";

/** sizes says how wide the photo shows, so phones get a small file. priority is for a photo that's on screen as the page opens. */
type PhotoProps = { src: string; alt?: string; className?: string; sizes: string; priority?: boolean };

/** Image with a pink gradient fallback while the file is missing. */
export default function Photo({ src, alt = "", className = "", sizes, priority = false }: PhotoProps) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-vivid-pink to-light-red ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    </div>
  );
}
