"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Proposed positioning, subject to Nexea leadership approval. */
const PRINCIPLES = [
  {
    title: "Independent Thinking",
    description: "Considering opportunities with clarity and objectivity.",
  },
  {
    title: "Investment Discipline",
    description: "Evaluating opportunities through structured analysis and risk awareness.",
  },
  {
    title: "Fundamental Understanding",
    description: "Looking beyond immediate potential to understand underlying value.",
  },
  {
    title: "Long-Term Perspective",
    description: "Seeking sustainable relevance and enduring value.",
  },
] as const;

export function Principles() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 76%";

    fadeUp(el.querySelector("[data-pr-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.14,
      duration: 1.4,
    });
    fadeUp(el.querySelectorAll("[data-pr-copy]"), {
      trigger: el,
      start: "top 66%",
      delay: 0.3,
      stagger: 0.14,
    });

    const grid = el.querySelector("[data-pr-grid]");
    el.querySelectorAll<HTMLElement>("[data-pr-item]").forEach((item, i) => {
      const line = item.querySelector("[data-pr-line]");
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "expo.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: grid, start: "top 86%", once: true },
          },
        );
      }
      fadeUp(item.querySelectorAll("[data-pr-body]"), {
        trigger: grid,
        start: "top 86%",
        y: 22,
        delay: 0.15 + i * 0.12,
        stagger: 0.08,
      });
    });

    if (desktop) {
      gsap.fromTo(
        "[data-pr-bg]",
        { yPercent: -5, scale: 1.08 },
        {
          yPercent: 5,
          scale: 1.02,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    }
  });

  return (
    <section
      ref={root}
      aria-labelledby="pr-heading"
      className="on-dark relative isolate overflow-clip bg-obsidian py-20 text-pure sm:py-24 lg:py-28"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div data-pr-bg className="absolute inset-0 will-change-transform">
          <Image
            src="/images/ab-principles-bg.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_40%] opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/70" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-obsidian to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-obsidian to-transparent" />
      </div>

      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-14">
        <div className="lg:col-span-5">
          <SectionLabel tone="light" data-anim data-pr-label>
            Our Principles
          </SectionLabel>
          <MaskedLines
            id="pr-heading"
            lines={["Perspective.", "Discipline.", "Long-Term Thinking."]}
            lineClasses={["", "text-platinum", "italic text-silver"]}
            className="display-lg mt-7 sm:mt-9"
          />
          <p
            data-anim
            data-pr-copy
            className="mt-7 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-platinum"
          >
            Our proposed investment approach emphasizes independent judgment, careful evaluation, and
            a long-term view of business opportunities.
          </p>
          <p
            data-anim
            data-pr-copy
            className="mt-8 flex items-center gap-4 font-display text-[1.375rem] italic leading-snug text-pure sm:text-[1.625rem]"
          >
            <span aria-hidden className="hidden h-px w-10 shrink-0 bg-silver/60 sm:block" />
            Driven by perspective. Guided by discipline.
          </p>
        </div>

        <ol data-pr-grid className="grid sm:grid-cols-2 lg:col-span-7">
          {PRINCIPLES.map((p, i) => (
            <li
              key={p.title}
              data-pr-item
              className={`relative py-8 sm:py-10 ${i % 2 === 0 ? "sm:pr-8" : "sm:pl-8"}`}
            >
              <span
                aria-hidden
                data-pr-line
                className="absolute inset-x-0 top-0 h-px origin-left bg-silver/35"
              />
              {i % 2 === 1 && (
                <span aria-hidden className="absolute inset-y-8 left-0 hidden w-px bg-silver/20 sm:block" />
              )}
              <p
                aria-hidden
                data-anim
                data-pr-body
                className="font-display text-[2.25rem] leading-none text-silver/45 sm:text-[2.75rem]"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                data-anim
                data-pr-body
                className="mt-5 font-display text-[1.625rem] leading-[1.15] text-pure sm:text-[1.875rem]"
              >
                {p.title}
              </h3>
              <p
                data-anim
                data-pr-body
                className="mt-3 max-w-[20rem] text-[0.9375rem] leading-[1.55] text-silver"
              >
                {p.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
