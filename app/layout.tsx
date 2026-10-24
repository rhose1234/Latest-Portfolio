import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marv | Software engineer, web developer & creator",
  description: "I build websites and products people actually use, and document the journey with real receipts.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden font-sans antialiased">{children}</body>
    </html>
  );
}
