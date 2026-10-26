import { ImageResponse } from "next/og";
import { Face, loadPortrait } from "@/lib/og";

/* The browser-tab icon: my face in a circle */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/* Rendered on the edge runtime: the Node.js renderer in Next 14 breaks on Windows file paths */
export const runtime = "edge";

export default async function Icon() {
  return new ImageResponse(<Face photo={await loadPortrait()} size={size.width} round />, size);
}
