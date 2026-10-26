import type { MetadataRoute } from "next";
import { UGC_BRANDS } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

/** Every page on the site, for search engines. New UGC brands are picked up automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/rate-card`, priority: 0.8 },
    ...UGC_BRANDS.map((brand) => ({ url: `${SITE_URL}/ugc/${brand.slug}`, priority: 0.6 })),
  ];
}
