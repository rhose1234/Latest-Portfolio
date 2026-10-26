/* Shared pieces for the generated link-preview images and the home-screen icon */

export const OG_SIZE = { width: 1200, height: 630 };

export const COLORS = { crimson: "#0c0003", lightRed: "#ffe5e3", pink: "#ea045d", white: "#ffffff" };

/** The M from the Marv logo with a pink full stop, as a data URI the image renderer can draw. */
const MARK_PATH = "M1.68854 6.57233H6.75415L12.1043 19.6253H12.332L17.6822 6.57233H22.7478V26H18.7636V13.3549H18.6024L13.5747 25.9051H10.8617L5.83399 13.3075H5.67273V26H1.68854V6.57233Z";
export const BRAND_MARK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 26 24"><path transform="translate(4.72 2.97) scale(0.8)" fill="#fff" d="${MARK_PATH}"/><circle cx="26.2" cy="21.8" r="2" fill="${COLORS.pink}"/></svg>`,
)}`;

/** Reads the TrueType file out of a Google Fonts stylesheet. Without a browser user agent, Google serves TrueType, which the renderer can read. */
async function googleFont(query: string) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error("No font file in the stylesheet");
  return (await fetch(url)).arrayBuffer();
}

/** Outfit, the site's font, in the weights the images use, plus Noto Sans for the naira sign (Outfit doesn't have one).
    Falls back to the default font if Google Fonts can't be reached. */
export async function loadFonts() {
  try {
    const [regular, bold, naira] = await Promise.all([
      googleFont("family=Outfit:wght@500"),
      googleFont("family=Outfit:wght@800"),
      googleFont(`family=Noto+Sans:wght@800&text=${encodeURIComponent("₦")}`),
    ]);
    return [
      { name: "Outfit", data: regular, weight: 500 as const, style: "normal" as const },
      { name: "Outfit", data: bold, weight: 800 as const, style: "normal" as const },
      { name: "Noto Sans", data: naira, weight: 800 as const, style: "normal" as const },
    ];
  } catch {
    return [];
  }
}

/** My portrait (public/images/hero.jpg), bundled with the route since the edge runtime has no file system. */
export async function loadPortrait() {
  return (await fetch(new URL("../public/images/hero.jpg", import.meta.url))).arrayBuffer();
}

/* The portrait is 752x1280; this square sits around my face */
const PORTRAIT = { width: 752, height: 1280 };
const FACE = { x: 110, y: 300, size: 560 };

/** My face cropped into a square of the given size, for the favicon and home-screen icon. */
export function Face({ photo, size, round = false }: { photo: ArrayBuffer; size: number; round?: boolean }) {
  const scale = size / FACE.size;
  return (
    <div style={{ width: size, height: size, display: "flex", position: "relative", overflow: "hidden", borderRadius: round ? "50%" : 0 }}>
      {/* The renderer takes the raw image bytes here, though the type says string */}
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        src={photo as unknown as string}
        width={PORTRAIT.width * scale}
        height={PORTRAIT.height * scale}
        style={{ position: "absolute", left: -FACE.x * scale, top: -FACE.y * scale }}
      />
    </div>
  );
}
