"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";

/** Logo artwork supplied by Nexea; this variant has the tagline set in Arctic Silver so it reads on Obsidian. */
const LOGO_SRC = "/images/nexea-holding-logo-on-dark.png";

interface WordmarkProps {
  /** "header": reveals on first paint. "footer": reveals once, when scrolled into view. */
  variant?: "header" | "footer";
  className?: string;
  /** Size classes for the logo image (height drives the width). */
  imageClassName?: string;
}

/**
 * The Nexea Holding AG logo (links home). Motion is deliberately small: a left-to-right clip reveal,
 * then one soft light sweep across the metal lettering; the sweep repeats on hover with a fine pointer.
 * Reduced-motion visitors get the static logo.
 */
export function Wordmark({ variant = "header", className = "", imageClassName = "h-[2.5rem] md:h-[2.625rem]" }: WordmarkProps) {
  const root = useRef<HTMLAnchorElement>(null);

  useMotion(root, ({ finePointer }) => {
    const el = root.current;
    const wrap = el?.querySelector("[data-logo-wrap]");
    const sheen = el?.querySelector<HTMLElement>("[data-logo-sheen]");
    if (!el || !wrap || !sheen) return;

    const sweep = () => {
      gsap.killTweensOf(sheen);
      gsap.fromTo(sheen, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 1.5, ease: "power2.inOut" });
    };

    const tl = gsap.timeline({
      delay: variant === "header" ? 0.15 : 0,
      scrollTrigger: variant === "footer" ? { trigger: el, start: "top 92%", once: true } : undefined,
    });
    tl.fromTo(wrap, { autoAlpha: 0, y: variant === "header" ? -8 : 10, clipPath: "inset(0% 100% 0% 0%)" }, { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.out" });
    tl.add(sweep, ">-0.25");

    if (!finePointer) return;
    el.addEventListener("pointerenter", sweep);
    return () => el.removeEventListener("pointerenter", sweep);
  });

  return (
    <Link ref={root} href="/" aria-label="Nexea Holding AG, home" className={`on-dark group relative inline-block leading-none ${className}`}>
      <span data-anim data-logo-wrap className="relative block">
        <Image
          src={LOGO_SRC}
          alt=""
          width={2022}
          height={537}
          priority={variant === "header"}
          quality={90}
          sizes={variant === "header" ? "(min-width: 768px) 159px, 151px" : "(min-width: 640px) 220px, 197px"}
          className={`w-auto select-none ${imageClassName}`}
        />
        {/* Light sweep, clipped to the lettering by the logo itself. */}
        <span
          aria-hidden
          data-logo-sheen
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.7)_50%,transparent_62%)] [background-position:100%_0] [background-size:260%_100%] [mask-image:url(/images/nexea-logo-mask.png)] [mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-image:url(/images/nexea-logo-mask.png)] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]"
        />
      </span>
    </Link>
  );
}
