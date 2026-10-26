/* Site-wide details for search results, link previews and the sitemap */

/** The live address. Set NEXT_PUBLIC_SITE_URL to your domain; on Vercel it falls back to the project's production domain. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const SITE_TITLE = "Marvelous Rose | Software engineer, web developer & UGC creator";

export const SITE_DESCRIPTION =
  "Software engineer, web developer and UGC creator. I build websites that work for businesses and make relatable short-form videos that connect brands with their audience.";

export const RATE_CARD_DESCRIPTION =
  "UGC packages from ₦100,000. Relatable short-form videos that connect your brand with its audience, posted on X, Instagram, Facebook and TikTok.";

/** Link-preview settings every page shares. A page's own openGraph replaces the layout's rather than adding to it, so pages spread this in. */
export const OPEN_GRAPH = { type: "website", siteName: "Marvelous Rose", locale: "en_NG" } as const;
