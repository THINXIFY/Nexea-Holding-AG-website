"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export interface MotionEnv {
  /** Viewport is at least 1024px wide. */
  desktop: boolean;
  /** Viewport is at least 1280px wide and the primary pointer is a mouse/trackpad. */
  finePointer: boolean;
}

type Setup = (env: MotionEnv) => void | (() => void);

/**
 * Runs `setup` inside a scoped gsap context + matchMedia, only when the visitor
 * has not requested reduced motion. Everything created in `setup` (tweens,
 * ScrollTriggers) is reverted on unmount and whenever a query stops matching.
 * `setup` may return a cleanup function for non-GSAP resources (listeners).
 */
export function useMotion(scope: RefObject<HTMLElement | null>, setup: Setup) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 1024px)",
          finePointer: "(min-width: 1280px) and (hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const c = ctx.conditions as Record<string, boolean>;
          if (!c.motion) return;
          return setup({ desktop: !!c.desktop, finePointer: !!c.finePointer });
        },
      );
      return () => mm.revert();
    },
    { scope },
  );
}
