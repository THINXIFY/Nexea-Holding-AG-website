"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { PRINCIPLES } from "@/data/philosophy";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Cinematic philosophy statement over a dusk skyline, with the four principles
 * set below it in a ruled 2x2 editorial grid. Photograph only; it does not depict a Nexea property.
 */
export function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 76%";
    const bgFrame = el.querySelector("[data-phil-frame]");
    const bg = el.querySelector("[data-phil-img]");

    // 1. Photograph opens from a soft clip + settle (opacity untouched so it can paint immediately).
    if (bgFrame) {
      gsap.fromTo(bgFrame, { clipPath: "inset(7% 4% 7% 4%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }
    if (bg) {
      gsap.fromTo(bg, { scale: 1.12 }, {
        scale: 1, duration: 2.2, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }
    // 2-4. Eyebrow, masked heading, secondary statement, intro.
    fadeUp(el.querySelector("[data-phil-label]"), { trigger: el, start, y: 12, delay: 0.2 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.35, stagger: 0.16, duration: 1.3 });
    fadeUp(el.querySelectorAll("[data-phil-copy]"), { trigger: el, start, delay: 0.9, y: 16, stagger: 0.14 });

    // 5-6. Principles: rules draw, then content follows in a short stagger.
    const grid = el.querySelector("[data-phil-grid]");
    el.querySelectorAll<HTMLElement>("[data-principle]").forEach((item, i) => {
      const line = item.querySelector("[data-principle-line]");
      const at = i * 0.12;
      if (line) {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1, duration: 1.3, ease: "expo.out", delay: at,
          scrollTrigger: { trigger: grid, start: "top 88%", once: true },
        });
      }
      fadeUp(item.querySelectorAll("[data-principle-body]"), { trigger: grid, start: "top 88%", y: 16, delay: 0.1 + at, stagger: 0.07, duration: 0.8 });
    });
    // 7. CTA last.
    fadeUp(el.querySelector("[data-phil-cta]"), { trigger: grid, start: "top 70%", y: 14, delay: 0.5 });

    // Parallax: the photograph travels slower than the content (desktop only).
    if (desktop && bg) {
      gsap.fromTo(bg.parentElement, { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
      });
    }
  });

  return (
    <section
      id="philosophy"
      ref={root}
      aria-labelledby="philosophy-heading"
      className="on-dark relative isolate overflow-clip bg-carbon py-12 text-pure sm:py-16 lg:py-20"
    >
      {/* Backdrop */}
      <div aria-hidden data-phil-frame className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-[7%] h-[114%] will-change-transform">
          <div data-phil-img className="absolute inset-0">
            <Image
              src="/images/home-philosophy-dusk.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[50%_50%] [filter:saturate(0.85)_brightness(1.2)_contrast(1.08)]"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-obsidian/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/92 via-obsidian/55 to-obsidian/30 max-md:from-obsidian/80 max-md:via-obsidian/65 max-md:to-obsidian/50" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-carbon to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent" />
      </div>

      <div className="container-nx">
        {/* Upper: statement */}
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-7">
            <SectionLabel tone="light" data-anim data-phil-label>
              Our Investment Philosophy
            </SectionLabel>
            <MaskedLines
              id="philosophy-heading"
              lines={["Perspective Shapes Decisions.", "Discipline Guides Opportunity."]}
              lineClasses={["", "italic text-silver"]}
              className="display-lg mt-5 sm:mt-6 lg:text-[3rem] lg:leading-[1.14]"
            />
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p data-anim data-phil-copy className="max-w-[30rem] text-[1.0625rem] leading-[1.55] text-platinum">
              Our investment perspective combines a fundamental understanding of businesses,
              disciplined evaluation, independent thinking, and long-term considerations.
            </p>
            <p data-anim data-phil-copy className="mt-3 max-w-[30rem] text-sm leading-[1.5] text-[#b1c0cc]">
              A proposed philosophy, subject to company approval.
            </p>
          </div>
        </div>

        {/* Lower: 2x2 principles */}
        <ol data-phil-grid className="mt-10 grid sm:mt-12 sm:grid-cols-2 lg:mt-16">
          {PRINCIPLES.map((p, i) => (
            <li
              key={p.title}
              data-principle
              className={`relative py-6 sm:py-8 ${i % 2 === 0 ? "sm:pr-8 lg:pr-12" : "sm:pl-8 lg:pl-12"}`}
            >
              <span aria-hidden data-principle-line className="absolute inset-x-0 top-0 h-px origin-left bg-silver/35" />
              {i % 2 === 1 && <span aria-hidden className="absolute inset-y-6 left-0 hidden w-px bg-silver/20 sm:block" />}
              <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[3.25rem_minmax(0,1fr)]">
                <span
                  data-anim
                  data-principle-body
                  aria-hidden
                  className="font-display text-[1.625rem] leading-none text-silver/60 sm:text-[1.875rem]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 data-anim data-principle-body className="font-display text-[1.375rem] leading-[1.25] text-pure sm:text-[1.5rem]">
                    {p.title}
                  </h3>
                  <p data-anim data-principle-body className="mt-2 max-w-[26rem] text-[0.9375rem] leading-[1.55] text-[#b1c0cc]">
                    {p.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div aria-hidden className="h-px bg-silver/35" />

        <div data-anim data-phil-cta className="mt-8 sm:mt-10">
          <Button href="#approach" variant="solid-light" sweep>
            Discover Our Investment Approach
          </Button>
        </div>
      </div>
    </section>
  );
}
