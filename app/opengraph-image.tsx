import { ImageResponse } from "next/og";
import { ME } from "@/lib/data";
import { OG_SIZE, loadFonts, loadPortrait } from "@/lib/og";

/* The preview shown when the site is shared on WhatsApp, X, LinkedIn and so on: the hero's ID card on its lanyard, on its own */
export const alt = `${ME.name}'s ID card: software engineer and UGC creator`;
export const size = OG_SIZE;
export const contentType = "image/png";

/* Rendered on the edge runtime: the Node.js renderer in Next 14 breaks on Windows file paths */
export const runtime = "edge";

/* Card measurements, scaled up from the hero's 240px card so it fills the preview's height */
const CARD = { width: 330, top: 56, padding: 22 };
const PHOTO = { width: CARD.width - CARD.padding * 2, height: Math.round(((CARD.width - CARD.padding * 2) * 5) / 4) };
/** Barcode bar widths, in the same pattern as the card on the site. */
const BARS = Array.from({ length: 18 }, (_, i) => (i % 4 === 0 ? 1.5 : i % 3 === 0 ? 5 : 3));

export default async function OpengraphImage() {
  const photo = await loadPortrait();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          background: "#2a0a12",
          backgroundImage: "radial-gradient(circle at 50% 45%, rgba(234,4,93,.38), transparent 42%)",
          fontFamily: "Outfit",
        }}
      >
        {/* Pink lanyard rope, running up off the top of the image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 600 - 7,
            width: 14,
            height: CARD.top + 10,
            borderRadius: 7,
            backgroundImage: "linear-gradient(90deg, #f9a8d4, #fbcfe8, #f9a8d4)",
          }}
        />
        {/* Metal clip */}
        <div
          style={{
            position: "absolute",
            top: CARD.top - 14,
            left: 600 - 26,
            width: 52,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 7,
            border: "1px solid rgba(107,114,128,.3)",
            backgroundImage: "linear-gradient(180deg, #d1d5db, #9ca3af)",
            boxShadow: "0 6px 14px rgba(0,0,0,.4)",
          }}
        >
          <div style={{ width: 30, height: 9, borderRadius: 9, background: "#6b7280" }} />
        </div>

        {/* The card */}
        <div
          style={{
            position: "absolute",
            top: CARD.top,
            width: CARD.width,
            display: "flex",
            flexDirection: "column",
            padding: CARD.padding,
            borderRadius: 22,
            border: "1.5px solid rgba(255,255,255,.3)",
            background: "rgba(255,255,255,.1)",
            boxShadow: "0 26px 70px rgba(0,0,0,.65)",
          }}
        >
          {/* The renderer takes the raw image bytes here, though the type says string */}
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={photo as unknown as string} width={PHOTO.width} height={PHOTO.height} style={{ objectFit: "cover", borderRadius: 12 }} />
          <div style={{ display: "flex", marginTop: 18, fontSize: 26, fontWeight: 800, letterSpacing: -0.5, color: "#ffffff", textTransform: "uppercase" }}>{ME.name}</div>
          <div style={{ display: "flex", marginTop: 2, fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,.9)" }}>Software Engineer | UGC Creator</div>
          <div style={{ display: "flex", gap: 3, height: 38, marginTop: 14 }}>
            {BARS.map((width, i) => (
              <div key={i} style={{ width, height: "100%", background: "#ffffff" }} />
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}
