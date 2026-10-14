"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/** How far ahead of the viewport (vertically) an image starts loading. */
const NEAR = "1200px 0px";
/** Safety net: load anyway this long after the page's load event, e.g. for a visitor who never scrolls. */
const FALLBACK_MS = 4500;

/**
 * Drop-in replacement for `next/image` for images far below the fold.
 *
 * Browsers fetch lazy images well before they are visible (on a slow connection roughly 2,500px ahead), so a long page
 * still pulls hundreds of KB of photography during the first paint and delays the hero. This renders an empty,
 * correctly-sized placeholder instead and mounts the real image when it is near the viewport (or shortly after the
 * page has loaded). Only `fill` images are used with it, so the placeholder fills the same positioned frame and nothing
 * shifts. Above-the-fold images (the hero slides) keep using `next/image` directly with priority.
 */
export default function DeferredImage(props: ImageProps) {
  const [ready, setReady] = useState(false);
  const holder = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ready) return;
    const el = holder.current;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = () => setReady(true);

    let io: IntersectionObserver | undefined;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && show(), { rootMargin: NEAR });
      io.observe(el);
    } else {
      timer = setTimeout(show, 0);
    }
    const afterLoad = () => {
      timer = setTimeout(show, FALLBACK_MS);
    };
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      io?.disconnect();
      clearTimeout(timer);
      window.removeEventListener("load", afterLoad);
    };
  }, [ready]);

  if (ready) return <Image {...props} alt={props.alt} />;
  return <span ref={holder} aria-hidden className="absolute inset-0 block" />;
}
