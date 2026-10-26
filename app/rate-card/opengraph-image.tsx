import { ImageResponse } from "next/og";
import { ME, RATES } from "@/lib/data";
import { BRAND_MARK, COLORS, OG_SIZE, loadFonts } from "@/lib/og";

/* Preview card for the rate card link: the packages and their prices, in the page's price stickers */
export const alt = `UGC rate card by ${ME.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

/* Rendered on the edge runtime: the Node.js renderer in Next 14 breaks on Windows file paths */
export const runtime = "edge";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          background: COLORS.crimson,
          backgroundImage: "radial-gradient(circle at 100% 0%, rgba(234,4,93,.4), transparent 50%)",
          color: COLORS.lightRed,
          fontFamily: "Outfit, Noto Sans",
        }}
      >
        {/* Name top left, price stickers top right, the title along the bottom */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={BRAND_MARK} width={65} height={60} />
            <span style={{ fontSize: 30, fontWeight: 500 }}>{ME.name}</span>
          </div>
          <div style={{ display: "flex", gap: 22 }}>
            {RATES.map((pkg, i) => (
              <div key={pkg.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: `rotate(${[-8, 4, -4][i % 3]}deg)` }}>
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: COLORS.pink,
                    color: COLORS.white,
                    fontSize: 25,
                    fontWeight: 800,
                  }}
                >
                  {pkg.price}
                </div>
                <span style={{ fontSize: 22, fontWeight: 500, textTransform: "uppercase", letterSpacing: 2 }}>{pkg.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 800, lineHeight: 0.86, letterSpacing: -6, color: COLORS.white, textTransform: "uppercase" }}>
          <span>UGC</span>
          <span>rate card</span>
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}
