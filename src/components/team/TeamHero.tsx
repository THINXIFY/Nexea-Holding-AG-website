"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { ParticleField } from "@/components/ui/ParticleField";

export function TeamHero() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    gsap.fromTo("[data-th-zoom]", { scale: 1.07 }, { scale: 1, duration: 2.6, ease: "power2.out" });
    fadeUp(el.querySelector("[data-th-crumb]"), { delay: 0.1, y: 10, duration: 0.7 });
    fadeUp(el.querySelector("[data-th-eyebrow]"), { delay: 0.2, y: 12, duration: 0.8 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { delay: 0.35, stagger: 0.14, duration: 1.3 });
    fadeUp(el.querySelectorAll("[data-th-copy]"), { delay: 0.9, y: 18, stagger: 0.12 });
    fadeUp(el.querySelector("[data-th-cue]"), { delay: 1.5, y: 0, duration: 1 });
    // Ambient drift of the particle layer; only runs while the hero is on screen.
    gsap.to("[data-th-ambient]", {
      x: 16, y: -10, duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1,
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
    });
    if (desktop) {
      gsap.to("[data-th-parallax]", {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }
  });

  return (
    <section
      ref={root}
      aria-labelledby="team-hero-heading"
      className="on-dark relative isolate flex min-h-[28rem] flex-col overflow-hidden bg-obsidian text-pure md:min-h-[56svh]"
    >
      <div data-th-parallax aria-hidden className="absolute inset-x-0 -top-[8%] -z-20 h-[116%] will-change-transform">
        <div data-th-zoom className="absolute inset-0 will-change-transform">
          <Image
            src="/images/team-hero.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[62%_50%] [filter:saturate(0.9)_brightness(1.05)]"
          />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/95 via-obsidian/60 to-obsidian/10 max-md:from-obsidian/85 max-md:via-obsidian/70 max-md:to-obsidian/55" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-obsidian/85 to-transparent" />

      {/* Particle / connectivity layer: above the photo and overlays, below all copy */}
      <div data-th-ambient aria-hidden className="pointer-events-none absolute -inset-[3%] -z-[5]">
        <ParticleField className="size-full" />
      </div>

      <div className="container-nx relative flex flex-1 flex-col justify-end pb-8 pt-28 sm:pb-10 lg:pt-28">
        <nav data-anim data-th-crumb aria-label="Breadcrumb" className="mb-5 font-ui text-[0.8125rem] tracking-[0.04em] text-silver sm:mb-6">
          <ol className="flex items-center gap-2.5">
            <li>
              <Link href="/" className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-pure">Home</Link>
            </li>
            <li aria-hidden className="text-steel">/</li>
            <li aria-current="page" className="text-pure">Our Team</li>
          </ol>
        </nav>

        <p data-anim data-th-eyebrow className="eyebrow mb-5 flex items-center gap-4 text-platinum">
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/70" />
          Nexea / Our Team
        </p>

        <MaskedLines id="team-hero-heading" as="h1" lines={["Leadership", "with Perspective."]} className="display-xl" />

        <p data-anim data-th-copy className="mt-5 max-w-[34rem] text-[1.0625rem] leading-[1.55] text-platinum/90 sm:mt-6 sm:text-lg">
          Our Board of Directors and Executive Management bring together distinct responsibilities
          in corporate leadership, oversight, and management.
        </p>

        <p data-anim data-th-copy className="eyebrow mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.6875rem] text-silver sm:mt-9 sm:text-xs">
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/50" />
          {["People", "Governance", "Leadership", "Long-Term Perspective"].map((t, i) => (
            <span key={t} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden className="text-steel">·</span>}
              {t}
            </span>
          ))}
        </p>

        <div data-anim data-th-cue aria-hidden className="absolute bottom-12 right-5 hidden flex-col items-center gap-4 lg:flex xl:right-8">
          <span className="eyebrow text-[0.6875rem] text-silver [writing-mode:vertical-rl]">Scroll</span>
          <span className="relative block h-14 w-px overflow-hidden bg-silver/25">
            <span className="scroll-cue-run absolute inset-0 bg-platinum" />
          </span>
        </div>
      </div>
    </section>
  );
}
