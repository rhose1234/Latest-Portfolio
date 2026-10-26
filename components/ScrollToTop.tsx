"use client";
import { useEffect } from "react";

/** A refresh always starts at the top of the page, instead of where you were or the section in the address bar (e.g. /#reviews).
    Following a shared link to a section still lands on that section. */
export default function ScrollToTop() {
  useEffect(() => {
    // Stop the browser putting you back where you were
    history.scrollRestoration = "manual";

    const [navigation] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (navigation?.type !== "reload") return;

    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return null;
}
