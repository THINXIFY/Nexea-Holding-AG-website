"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";

export function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;

    gsap.fromTo("[data-ah-zoom]", { scale: 1.08 }, { scale: 1, duration: 2.8, ease: "power2.out" });
    fadeUp(el.querySelector("[data-ah-crumb]"), { delay: 0.1, y: 10, duration: 0.7 });
    fadeUp(el.querySelector("[data-ah-eyebrow]"), { delay: 0.2, y: 12, duration: 0.8 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { delay: 0.35, stagger: 0.14, duration: 1.3 });
    fadeUp(el.querySelectorAll("[data-ah-copy]"), { delay: 0.9, y: 18, stagger: 0.12 });

    if (desktop) {
      gsap.to("[data-ah-parallax]", {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }
  });

  return (
    <section
      ref={root}
      aria-labelledby="about-hero-heading"
      className="on-dark relative isolate flex min-h-[30rem] flex-col overflow-hidden bg-obsidian text-pure md:min-h-[64svh]"
    >
      <div
        data-ah-parallax
        aria-hidden
        className="absolute inset-x-0 -top-[8%] -z-20 h-[116%] will-change-transform"
      >
        <div data-ah-zoom className="absolute inset-0 will-change-transform">
          <Image
            src="/images/nexea-reception.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[88%_45%] md:object-[100%_45%]"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/95 via-obsidian/65 via-45% to-transparent to-65% max-md:from-obsidian/85 max-md:via-obsidian/70 max-md:to-obsidian/55"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-obsidian to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-obsidian/85 to-transparent"
      />

      <div className="container-nx flex flex-1 flex-col justify-end pb-9 pt-32 sm:pb-12 lg:pt-36">
        <nav
          data-anim
          data-ah-crumb
          aria-label="Breadcrumb"
          className="mb-7 font-ui text-[0.8125rem] tracking-[0.04em] text-silver sm:mb-9"
        >
          <ol className="flex items-center gap-2.5">
            <li>
              <Link href="/" className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-pure">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-steel">
              /
            </li>
            <li aria-current="page" className="text-pure">
              About
            </li>
          </ol>
        </nav>

        <p data-anim data-ah-eyebrow className="eyebrow mb-5 flex items-center gap-4 text-platinum">
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/70" />
          About Nexea Holding AG
        </p>

        <MaskedLines
          id="about-hero-heading"
          as="h1"
          lines={["Independent Thinking.", "Global Perspective."]}
          className="display-xl text-pure"
        />

        <p
          data-anim
          data-ah-copy
          className="mt-6 max-w-[34rem] text-[1.0625rem] leading-[1.6] text-platinum/90 sm:mt-8 sm:text-lg"
        >
          Nexea Holding AG is a Swiss investment holding company focused on corporate participations
          and opportunities across international markets.
        </p>

        <p
          data-anim
          data-ah-copy
          className="eyebrow mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.6875rem] text-silver sm:mt-9 sm:text-xs"
        >
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/50" />
          <span>Swiss Foundations</span>
          <span aria-hidden className="text-steel">
            ·
          </span>
          <span>International Perspective</span>
        </p>
      </div>
    </section>
  );
}
