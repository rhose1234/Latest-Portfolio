import { ImageResponse } from "next/og";
import { ME, ROLES } from "@/lib/data";
import { BRAND_MARK, COLORS, OG_SIZE, loadFonts, loadPortrait } from "@/lib/og";

/* The preview card shown when the site is shared on WhatsApp, X, LinkedIn and so on */
export const alt = `${ME.name}, software engineer, web developer and UGC creator`;
export const size = OG_SIZE;
export const contentType = "image/png";

/* Rendered on the edge runtime: the Node.js renderer in Next 14 breaks on Windows file paths */
export const runtime = "edge";

export default async function OpengraphImage() {
  const photo = await loadPortrait();
  const [first, ...rest] = ME.name.split(" ");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: COLORS.crimson, color: COLORS.lightRed, fontFamily: "Outfit" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 64px",
            backgroundImage: "radial-gradient(circle at 0% 0%, rgba(234,4,93,.4), transparent 55%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={BRAND_MARK} width={78} height={72} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 108, fontWeight: 800, lineHeight: 0.9, letterSpacing: -5, color: COLORS.white }}>
              <span>{first}</span>
              <span style={{ color: COLORS.pink }}>{rest.join(" ")}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
              {ROLES.map((role) => (
                <span key={role.title} style={{ border: "2px solid rgba(255,229,227,.3)", borderRadius: 999, padding: "8px 22px", fontSize: 26, fontWeight: 500 }}>
                  {role.title}
                </span>
              ))}
            </div>
          </div>
          <span style={{ fontSize: 26, fontWeight: 500, color: "rgba(255,229,227,.6)" }}>{ME.handle}</span>
        </div>
        {/* The renderer takes the raw image bytes here, though the type says string */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={photo as unknown as string} width={430} height={630} style={{ objectFit: "cover" }} />
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}
