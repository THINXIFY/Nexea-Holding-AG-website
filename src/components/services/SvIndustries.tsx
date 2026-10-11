"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { INDUSTRY_GROUPS } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function SvIndustries() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 78%";
    fadeUp(el.querySelector("[data-sx-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-sx-copy]"), { trigger: el, start: "top 70%", delay: 0.3, stagger: 0.12 });
    el.querySelectorAll<HTMLElement>("[data-sx-tile]").forEach((tile, i) => {
      const img = tile.querySelector("[data-sx-img]");
      revealImage(tile, img, { trigger: tile, start: "top 90%", duration: 1.2, delay: (i % 2) * 0.12 });
      fadeUp(tile.querySelectorAll("[data-sx-text]"), { trigger: tile, start: "top 90%", delay: 0.55 + (i % 2) * 0.12, y: 14, duration: 0.8, stagger: 0.08 });
      if (desktop && img) {
        // Each tile travels at its own speed; the two large tiles also settle in scale.
        parallax(img, { amount: [7, 4, 5, 8][i] ?? 5, trigger: tile });
        if (i === 0 || i === 3) {
          gsap.fromTo(tile.querySelector("[data-sx-scale]"), { scale: 1.09 }, {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      }
    });
  });

  return (
    <section ref={root} aria-labelledby="sx-heading" className="relative bg-frost py-20 text-muted sm:py-24 lg:py-28">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:items-start lg:gap-x-10 xl:gap-x-14">
        <div className="lg:col-span-4 lg:pt-2">
          <SectionLabel data-anim data-sx-label>Cross-Sector Perspective</SectionLabel>
          <MaskedLines
            id="sx-heading"
            lines={["Understanding", "Business Across", "Industries."]}
            className="display-md mt-6 text-ink sm:mt-8"
          />
          <div className="mt-7 max-w-[28rem] space-y-4 text-[1.0625rem] leading-[1.6]">
            <p data-anim data-sx-copy>
              Strategic insight becomes more valuable when informed by the realities of different
              industries.
            </p>
            <p data-anim data-sx-copy>
              Nexea&rsquo;s expertise spans investment themes across established assets,
              productive enterprises, and emerging markets.
            </p>
          </div>
          <div data-anim data-sx-copy className="mt-8">
            <Button href="/investments#sectors" variant="outline-dark" sweep>Explore Investment Sectors</Button>
          </div>
        </div>

        <ul className="grid auto-rows-[14rem] gap-3 sm:grid-cols-2 sm:auto-rows-[15rem] lg:col-span-8 lg:grid-cols-12 lg:auto-rows-[15rem] lg:gap-4">
          {INDUSTRY_GROUPS.map((g) => (
            <li key={g.title} data-anim data-sx-tile className={`on-dark group relative isolate overflow-hidden bg-carbon text-pure ${g.className}`}>
              <div data-sx-img className="absolute inset-x-0 -top-[10%] -z-20 h-[120%]">
                <div data-sx-scale className="absolute inset-0">
                <Image
                  src={g.image.src}
                  alt={g.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                  style={{ objectPosition: g.image.position }}
                  className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.05]"
                />
                </div>
              </div>
              <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian/90 via-obsidian/35 to-obsidian/10" />
              <div className="flex h-full items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <h3 data-sx-text className="font-display text-[1.5rem] leading-[1.1] sm:text-[1.75rem]">
                    <Link href="/investments#sectors" className="after:absolute after:inset-0 after:content-['']">{g.title}</Link>
                  </h3>
                  <p data-sx-text className="mt-2 max-w-[22rem] text-sm leading-[1.55] text-platinum/90">{g.description}</p>
                </div>
                <span aria-hidden className="grid size-10 shrink-0 place-items-center border border-white/35 transition-colors duration-500 group-hover:border-platinum group-hover:bg-platinum group-hover:text-obsidian">
                  <ArrowUpRight strokeWidth={1.4} className="size-[1.125rem] transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
