"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Keeps ScrollTrigger positions correct once layout settles: after fonts and
 * images have loaded, when the document height changes (lazy images, accordion
 * rows) and when the page is restored from the back/forward cache.
 */
export function ScrollRefresh() {
  const pathname = usePathname();

  // New route = new set of triggers: refresh once the new page has mounted, then
  // settle on the #hash target (smooth scrolling started before layout finished
  // would otherwise stop short of the section).
  useEffect(() => {
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      const id = window.location.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target) {
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - margin;
        window.scrollTo({ top, behavior: "instant" });
      }
    }, 500);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const debounced = () => {
      clearTimeout(timer);
      timer = setTimeout(refresh, 250);
    };

    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    window.addEventListener("pageshow", (e) => e.persisted && refresh());

    let lastHeight = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastHeight) > 2) {
        lastHeight = h;
        debounced();
      }
    });
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}
