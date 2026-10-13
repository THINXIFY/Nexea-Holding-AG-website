"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";

export function ImpressumHero() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    gsap.fromTo("[data-ih-zoom]", { scale: 1.05 }, { scale: 1, duration: 2.2, ease: "power2.out" });
    fadeUp(el.querySelector("[data-ih-crumb]"), { delay: 0.1, y: 10, duration: 0.7 });
    fadeUp(el.querySelector("[data-ih-eyebrow]"), { delay: 0.2, y: 12, duration: 0.8 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { delay: 0.3, stagger: 0.12, duration: 1.1 });
    fadeUp(el.querySelectorAll("[data-ih-copy]"), { delay: 0.8, y: 16, stagger: 0.1 });
    if (desktop) {
      gsap.to("[data-ih-parallax]", { yPercent: 4, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
    }
  });

  return (
    <section ref={root} aria-labelledby="impressum-heading" className="on-dark relative isolate flex min-h-[26rem] flex-col overflow-hidden bg-obsidian text-pure md:min-h-[48svh]">
      <div data-ih-parallax aria-hidden className="absolute inset-x-0 -top-[5%] -z-20 h-[110%] will-change-transform">
        <div data-ih-zoom className="absolute inset-0 will-change-transform">
          <Image src="/images/nexea-reception.webp" alt="" fill priority fetchPriority="high" sizes="100vw" className="object-cover object-[88%_45%] md:object-[100%_45%]" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/95 via-obsidian/65 via-45% to-transparent to-65% max-md:from-obsidian/90 max-md:via-obsidian/75 max-md:to-obsidian/60" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-obsidian/85 to-transparent" />

      <div className="container-nx relative flex flex-1 flex-col justify-end pb-8 pt-28 sm:pb-10">
        <nav data-anim data-ih-crumb aria-label="Breadcrumb" className="mb-5 font-ui text-[0.8125rem] tracking-[0.04em] text-silver">
          <ol className="flex items-center gap-2.5">
            <li>
              <Link href="/" className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-pure">Home</Link>
            </li>
            <li aria-hidden className="text-steel">/</li>
            <li aria-current="page" className="text-pure">Impressum</li>
          </ol>
        </nav>

        <p data-anim data-ih-eyebrow className="eyebrow mb-4 flex items-center gap-4 text-platinum">
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/70" />
          Nexea / Legal Information
        </p>

        <MaskedLines id="impressum-heading" as="h1" lines={["Impressum."]} className="display-xl" />

        <p data-anim data-ih-copy className="mt-4 font-display text-[1.375rem] italic leading-[1.25] text-platinum sm:text-[1.625rem]">
          Corporate Identity. Legal Transparency.
        </p>
        <p data-anim data-ih-copy className="mt-4 max-w-[34rem] text-[1.0625rem] leading-[1.55] text-platinum/90">
          Official company identification, registered corporate details, and legal information
          relating to Nexea Holding AG.
        </p>
        <p data-anim data-ih-copy className="eyebrow mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.6875rem] text-silver sm:text-xs">
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/50" />
          <span>Swiss Foundations</span>
          <span aria-hidden className="text-steel">·</span>
          <span>Corporate Transparency</span>
        </p>
      </div>
    </section>
  );
}
