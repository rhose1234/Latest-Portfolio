"use client";
import { ME } from "@/lib/data";
import { wrap } from "@/lib/styles";

export default function Footer() {
  return (
    <footer className="border-t border-light-red/20 bg-crimson pb-10 pt-7 text-[13px] text-light-red/80">
      <p className={`${wrap} text-center`}>
        {/* Rendered in the visitor's browser, so the year stays current long after the site was built */}
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {ME.full}
      </p>
    </footer>
  );
}
