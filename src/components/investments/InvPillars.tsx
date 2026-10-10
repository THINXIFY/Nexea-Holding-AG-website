"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { PILLARS } from "@/data/investments";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function InvPillars() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-pl-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelector("[data-pl-intro]"), { trigger: el, start, delay: 0.3 });

    el.querySelectorAll<HTMLElement>("[data-pl-panel]").forEach((panel, i) => {
      const delay = (i % 4) * 0.12;
      const img = panel.querySelector("[data-pl-img]");
      revealImage(panel, img, { trigger: panel, start: "top 90%", duration: 1.2, delay });
      if (desktop && img) {
        // Four images, four speeds; titles and overlays stay put.
        parallax(img, { amount: [4, 8, 5, 9][i] ?? 6, trigger: panel });
        gsap.fromTo(panel.querySelector("[data-pl-scale]"), { scale: 1.08 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
      fadeUp(panel.querySelectorAll("[data-pl-text]"), {
        trigger: panel,
        start: "top 90%",
        delay: delay + 0.55,
        y: 14,
        duration: 0.8,
        stagger: 0.08,
      });
    });
  });

  return (
    <section ref={root} aria-labelledby="pl-heading" className="relative bg-pure py-20 text-muted sm:py-24 lg:py-28">
      <div className="container-nx">
        <div className="grid items-end gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <SectionLabel data-anim data-pl-label>Investment Pillars</SectionLabel>
            <MaskedLines
              id="pl-heading"
              lines={["Four Perspectives.", "A World of Possibility."]}
              className="display-md mt-6 text-ink sm:mt-8"
            />
          </div>
          <p data-anim data-pl-intro className="max-w-[32rem] text-[1.0625rem] leading-[1.6] lg:col-span-5 lg:pb-2">
            Our proposed investment landscape is organized around four strategic themes, bringing
            together established sectors and emerging opportunities.
          </p>
        </div>

        <ul className="mt-12 grid auto-rows-[22rem] gap-3 sm:grid-cols-2 sm:auto-rows-[24rem] lg:mt-14 xl:grid-cols-4 xl:auto-rows-[30rem] xl:gap-4">
          {PILLARS.map((p) => (
            <li
              key={p.number}
              data-anim
              data-pl-panel
              className="on-dark group relative isolate overflow-hidden bg-carbon text-pure"
            >
              <div data-pl-img className="absolute inset-x-0 -top-[10%] -z-20 h-[120%]">
                <div data-pl-scale className="absolute inset-0">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  style={{ objectPosition: p.image.position }}
                  className="object-cover brightness-[0.9] transition-[transform,filter] duration-[1400ms] ease-out-expo group-hover:scale-[1.05] group-hover:brightness-100"
                />
                </div>
              </div>
              <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian/92 via-obsidian/35 to-obsidian/25" />
              <div className="flex h-full flex-col justify-between p-6">
                <p data-pl-text aria-hidden className="font-display text-[2.5rem] leading-none text-pure/85">
                  {p.number}
                </p>
                <div>
                  <h3 data-pl-text className="font-display text-[1.875rem] leading-[1.08]">
                    <Link href="#sectors" className="after:absolute after:inset-0 after:content-['']">
                      {p.title}
                    </Link>
                  </h3>
                  <p data-pl-text className="mt-3 text-[0.9375rem] leading-[1.55] text-platinum/90">
                    {p.description}
                  </p>
                  <span
                    aria-hidden
                    className="mt-5 grid size-10 place-items-center border border-white/35 transition-colors duration-500 group-hover:border-platinum group-hover:bg-platinum group-hover:text-obsidian"
                  >
                    <ArrowRight strokeWidth={1.4} className="size-[1.125rem] transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
