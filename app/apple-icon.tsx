import { ImageResponse } from "next/og";
import { Face, loadPortrait } from "@/lib/og";

/* Home-screen icon for iPhones and iPads: my face, full bleed (iOS rounds the corners itself) */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* Rendered on the edge runtime: the Node.js renderer in Next 14 breaks on Windows file paths */
export const runtime = "edge";

export default async function AppleIcon() {
  return new ImageResponse(<Face photo={await loadPortrait()} size={size.width} />, size);
}
