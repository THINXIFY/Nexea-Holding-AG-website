"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fadeUp, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Tile {
  title: string;
  description: string;
  image: { src: string; alt: string; position: string };
  /** Tile placement classes (desktop mosaic). */
  className: string;
  feature?: boolean;
}

/** Areas of interest only; these are not holdings. */
const TILES: readonly Tile[] = [
  {
    title: "Real Assets & Infrastructure",
    description: "Commercial real estate, infrastructure, and essential assets.",
    image: {
      src: "/images/ab-real-assets.jpg",
      alt: "Aerial view of a dense financial district of skyscrapers in a major city",
      position: "50% 40%",
    },
    className: "sm:col-span-2 lg:col-span-7 lg:row-span-3",
    feature: true,
  },
  {
    title: "Technology & Innovation",
    description: "AI, digital infrastructure, and emerging technologies.",
    image: {
      src: "/images/ab-technology.jpg",
      alt: "Close-up of a blue-lit server rack inside a data centre",
      position: "30% 50%",
    },
    className: "lg:col-span-5",
  },
  {
    title: "Industry & Commerce",
    description: "Industrial production and advanced manufacturing.",
    image: {
      src: "/images/ab-industry.jpg",
      alt: "A yellow industrial robot arm on an automated production line",
      position: "50% 40%",
    },
    className: "lg:col-span-5",
  },
  {
    title: "Health & Sustainability",
    description: "Healthcare, pharmaceuticals, and sustainable industries.",
    image: {
      src: "/images/ab-health.jpg",
      alt: "Two researchers in protective clothing working in a bright, clean laboratory",
      position: "50% 45%",
    },
    className: "sm:col-span-2 lg:col-span-5",
  },
];

export function InvestmentPerspective() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 78%";

    fadeUp(el.querySelector("[data-ip-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.13,
    });
    fadeUp(el.querySelectorAll("[data-ip-copy]"), {
      trigger: el,
      start: "top 70%",
      delay: 0.3,
      stagger: 0.12,
    });

    el.querySelectorAll<HTMLElement>("[data-ip-tile]").forEach((tile, i) => {
      const delay = i === 0 ? 0 : (i - 1) * 0.12;
      revealImage(tile, tile.querySelector("[data-ip-img]"), {
        trigger: tile,
        start: "top 90%",
        duration: 1.2,
        delay,
      });
      fadeUp(tile.querySelectorAll("[data-ip-text]"), {
        trigger: tile,
        start: "top 90%",
        delay: delay + 0.55,
        y: 14,
        duration: 0.8,
        stagger: 0.08,
      });
    });
  });

  return (
    <section
      ref={root}
      aria-labelledby="ip-heading"
      className="relative bg-frost py-20 text-muted sm:py-24 lg:py-28"
    >
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:items-start lg:gap-x-10 xl:gap-x-14">
        <div className="lg:col-span-4 lg:pt-2">
          <SectionLabel data-anim data-ip-label>
            Investment Perspective
          </SectionLabel>
          <MaskedLines
            id="ip-heading"
            lines={["A Broader View", "of Investment", "Opportunity."]}
            className="display-md mt-6 text-ink sm:mt-8"
          />
          <p
            data-anim
            data-ip-copy
            className="mt-7 max-w-[28rem] text-[1.0625rem] leading-[1.6]"
          >
            We explore a diverse range of assets, enterprises, and industries that reflect a dynamic
            global economy.
          </p>
          <div data-anim data-ip-copy className="mt-8 sm:mt-10">
            <Button href="/investments#sectors" variant="outline-dark" sweep>
              Explore Our Investment Sectors
            </Button>
          </div>
        </div>

        <ul className="grid auto-rows-[15rem] gap-3 sm:grid-cols-2 sm:auto-rows-[13rem] lg:col-span-8 lg:grid-cols-12 lg:auto-rows-[11.5rem] lg:gap-4">
          {TILES.map((t) => (
            <li
              key={t.title}
              data-anim
              data-ip-tile
              className={`on-dark group relative isolate overflow-hidden bg-carbon text-pure ${t.className}`}
            >
              <div data-ip-img className="absolute inset-0 -z-20">
                <Image
                  src={t.image.src}
                  alt={t.image.alt}
                  fill
                  sizes={
                    t.feature
                      ? "(min-width: 1024px) 38vw, 100vw"
                      : "(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                  }
                  style={{ objectPosition: t.image.position }}
                  className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
                />
              </div>
              <div
                aria-hidden
                className={`absolute inset-0 -z-10 bg-gradient-to-t from-obsidian/90 via-obsidian/35 to-obsidian/10 ${t.feature ? "" : "from-obsidian/85 via-obsidian/55 bg-gradient-to-r to-obsidian/20"}`}
              />
              <div className="flex h-full items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <h3
                    data-ip-text
                    className={`font-display leading-[1.08] ${
                      t.feature ? "text-[1.875rem] sm:text-[2.5rem]" : "text-[1.5rem] sm:text-[1.625rem]"
                    }`}
                  >
                    <Link href="/#sectors" className="after:absolute after:inset-0 after:content-['']">
                      {t.title}
                    </Link>
                  </h3>
                  <p
                    data-ip-text
                    className={`mt-2 max-w-[22rem] text-platinum/90 ${
                      t.feature ? "text-base leading-[1.6]" : "text-sm leading-[1.55]"
                    }`}
                  >
                    {t.description}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center border border-white/35 transition-colors duration-500 group-hover:border-platinum group-hover:bg-platinum group-hover:text-obsidian"
                >
                  <ArrowUpRight
                    strokeWidth={1.4}
                    className="size-[1.125rem] transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
