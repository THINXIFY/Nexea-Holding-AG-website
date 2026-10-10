"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for GSAP plugins. Import `gsap` and `ScrollTrigger`
 * from here (never from "gsap" directly) so plugins are registered exactly once
 * and only on the client.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Mobile browser chrome resizes the viewport while scrolling; don't refresh for it.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

/** Shared timing language so every section moves with the same restraint. */
export const MOTION = {
  ease: "expo.out",
  easeSoft: "power3.out",
  easeInOut: "power2.inOut",
  reveal: 1.2,
  fade: 0.9,
  stagger: 0.09,
  start: "top 82%",
} as const;
