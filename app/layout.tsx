import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ME } from "@/lib/data";
import { OPEN_GRAPH, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

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
    <html lang="en">
      <body className="overflow-x-hidden font-sans antialiased">{children}</body>
    </html>
  );
}
