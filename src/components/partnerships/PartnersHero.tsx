"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";

export function PartnersHero() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    gsap.fromTo("[data-ph-zoom]", { scale: 1.04 }, { scale: 1, duration: 2.6, ease: "power2.out" });
    fadeUp(el.querySelector("[data-ph-eyebrow]"), { delay: 0.15, y: 12, duration: 0.8 });
    gsap.fromTo(el.querySelector("[data-ph-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.out", delay: 0.2 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { delay: 0.3, stagger: 0.14, duration: 1.3 });
    fadeUp(el.querySelector("[data-ph-desc]"), { delay: 0.85, y: 18 });
    fadeUp(el.querySelectorAll("[data-ph-btn]"), { delay: 1.05, y: 14, stagger: 0.12 });
    fadeUp(el.querySelector("[data-ph-micro]"), { delay: 1.35, y: 10 });
  });

  return (
    <section
      ref={root}
      aria-labelledby="partners-hero-heading"
      className="on-dark relative isolate flex min-h-[34rem] flex-col overflow-hidden bg-obsidian text-pure md:min-h-[88svh]"
    >
      <div aria-hidden className="absolute inset-0 -z-20">
        <div data-ph-zoom className="absolute inset-0 will-change-transform">
          <Image
            src="/images/partners-hero-boardroom.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[62%_50%] md:object-[60%_50%]"
          />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/90 via-obsidian/55 via-50% to-transparent to-80% max-md:from-obsidian/85 max-md:via-obsidian/65 max-md:to-obsidian/35" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-obsidian/90 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-obsidian/85 to-transparent" />

      <div className="container-nx relative flex flex-1 flex-col justify-center pb-12 pt-32 sm:pb-14 lg:pt-36">
        <p data-anim data-ph-eyebrow className="eyebrow mb-5 flex items-center gap-4 text-platinum">
          <span aria-hidden data-ph-rule className="h-px w-10 shrink-0 origin-left bg-silver/70" />
          Nexea / Partners
        </p>

        <MaskedLines id="partners-hero-heading" as="h1" lines={["Stronger Connections.", "Broader Opportunities."]} className="display-xl" />

        <p data-anim data-ph-desc className="mt-6 max-w-[34rem] text-[1.0625rem] leading-[1.6] text-platinum/90 sm:mt-8 sm:text-lg">
          Exploring strategic relationships, investment opportunities, and international business
          collaborations built on shared objectives and long-term perspective.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
          <div data-anim data-ph-btn className="flex">
            <Button href="#our-partners" variant="solid-light" sweep className="w-full sm:w-auto">Explore Partners</Button>
          </div>
          <div data-anim data-ph-btn className="flex">
            <Button href="/contact?type=partnership" variant="outline-light" sweep className="w-full sm:w-auto">Become a Partner</Button>
          </div>
        </div>

        <p data-anim data-ph-micro className="eyebrow mt-10 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.6875rem] text-silver sm:mt-12 sm:text-xs">
          <span>Global Connections</span>
          <span aria-hidden className="text-steel">·</span>
          <span>Strategic Collaboration</span>
          <span aria-hidden className="text-steel">·</span>
          <span>Business Opportunities</span>
        </p>
      </div>
    </section>
  );
}
