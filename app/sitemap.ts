import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { UGC_BRANDS } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

/** Every page on the site, for search engines. New UGC brands and blog posts are picked up automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/ugc`, priority: 0.8 },
    ...UGC_BRANDS.map((brand) => ({ url: `${SITE_URL}/ugc/${brand.slug}`, priority: 0.6 })),
    { url: `${SITE_URL}/blog`, priority: 0.7 },
    ...getPosts().filter((post) => !post.link && !post.soon).map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.date, priority: 0.6 })),
  ];
}
