"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";

interface LegalHeroProps {
  eyebrow: string;
  headingId: string;
  title: string;
  description: string;
  breadcrumb: string;
}

/** Compact hero shared by the website legal documents (Privacy Policy, Terms & Conditions). */
export function LegalHero({ eyebrow, headingId, title, description, breadcrumb }: LegalHeroProps) {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    gsap.fromTo("[data-lh-zoom]", { scale: 1.04 }, { scale: 1, duration: 2, ease: "power2.out" });
    fadeUp(el.querySelector("[data-lh-crumb]"), { delay: 0.1, y: 10, duration: 0.7 });
    fadeUp(el.querySelector("[data-lh-eyebrow]"), { delay: 0.2, y: 12, duration: 0.8 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { delay: 0.3, stagger: 0.12, duration: 1.1 });
    fadeUp(el.querySelectorAll("[data-lh-copy]"), { delay: 0.7, y: 16, stagger: 0.1 });
  });

  return (
    <section ref={root} aria-labelledby={headingId} className="on-dark relative isolate flex min-h-[22rem] flex-col overflow-hidden bg-obsidian text-pure md:min-h-[40svh]">
      <div aria-hidden className="absolute inset-0 -z-20">
        <div data-lh-zoom className="absolute inset-0 will-change-transform">
          <Image src="/images/nexea-reception.webp" alt="" fill priority sizes="100vw" className="object-cover object-[30%_45%] md:object-[40%_45%]" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/95 via-obsidian/80 to-obsidian/55 max-md:from-obsidian/92 max-md:via-obsidian/82 max-md:to-obsidian/70" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-obsidian/85 to-transparent" />

      <div className="container-nx relative flex flex-1 flex-col justify-end pb-8 pt-28 sm:pb-10">
        <nav data-anim data-lh-crumb aria-label="Breadcrumb" className="mb-5 font-ui text-[0.8125rem] tracking-[0.04em] text-silver">
          <ol className="flex items-center gap-2.5">
            <li>
              <Link href="/" className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-pure">Home</Link>
            </li>
            <li aria-hidden className="text-steel">/</li>
            <li aria-current="page" className="text-pure">{breadcrumb}</li>
          </ol>
        </nav>

        <p data-anim data-lh-eyebrow className="eyebrow mb-4 flex items-center gap-4 text-platinum">
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/70" />
          {eyebrow}
        </p>

        <MaskedLines id={headingId} as="h1" lines={[title]} className="display-xl" />

        <p data-anim data-lh-copy className="mt-4 max-w-[36rem] text-[1.0625rem] leading-[1.55] text-platinum/90">
          {description}
        </p>
      </div>
    </section>
  );
}
