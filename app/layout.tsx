import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import MotionProvider from "@/components/MotionProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { ME } from "@/lib/data";
import { OPEN_GRAPH, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

/* Served from this site rather than Google's, so the first paint doesn't wait on another server. Space Mono is only for small details, so it isn't preloaded. */
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono", display: "swap", preload: false });

/* The favicon, home-screen icon and link-preview images come from app/icon.tsx, apple-icon.tsx and opengraph-image.tsx */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${ME.name}` },
  description: SITE_DESCRIPTION,
  applicationName: ME.name,
  authors: [{ name: ME.name, url: SITE_URL }],
  creator: ME.name,
  keywords: ["Marvelous Rose", "software engineer", "web developer", "website developer Nigeria", "UGC creator", "UGC creator Nigeria", "Next.js developer"],
  alternates: { canonical: "/" },
  openGraph: { ...OPEN_GRAPH, url: "/", title: SITE_TITLE, description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, creator: "@RoseMarvelous4" },
};

/** Colours the browser bar on phones to match the dark sections. */
export const viewport: Viewport = { themeColor: "#0c0003" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body className="overflow-x-hidden font-sans antialiased">
        <ScrollToTop />
        <MotionProvider>{children}</MotionProvider>
        {/* Vercel Web Analytics: page views only, no cookies. Switch it on under the project's Analytics tab on Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
