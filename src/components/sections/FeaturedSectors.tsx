"use client";

import { useRef } from "react";
import Image from "@/components/ui/DeferredImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { SECTORS, type Sector } from "@/data/sectors";
import { INVESTMENT_SECTORS } from "@/data/investment-sectors";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

const TITLE_SIZE: Record<Sector["size"], string> = {
  feature: "text-[2.125rem] leading-[1.04] sm:text-[2.75rem] lg:text-[3.25rem]",
  wide: "text-[1.75rem] leading-[1.08] sm:text-[2rem]",
  compact: "text-[1.75rem] leading-[1.08] sm:text-[1.875rem]",
};

function SectorTile({ sector, index }: { sector: Sector; index: number }) {
  const { title, summary, image, href, size, layout } = sector;
  const feature = size === "feature";
  // The feature and wide tiles carry the depth effect; compact tiles stay still.
  const depth = size !== "compact";

  const heading = (
    <h3 className={`font-display ${TITLE_SIZE[size]} ${feature ? "max-w-[14ch]" : ""}`}>
      {href ? (
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
          {title}
        </Link>
      ) : (
        title
      )}
    </h3>
  );

  return (
    <li
      data-anim
      data-sector-tile
      data-sector-size={size}
      data-index={index}
      className={`on-dark group relative isolate overflow-hidden bg-carbon text-pure ${layout}`}
    >
      <div data-sector-img className={`absolute inset-x-0 -z-20 will-change-transform ${depth ? "-top-[10%] h-[120%]" : "inset-y-0"}`}>
        <div data-sector-scale className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={
            feature
              ? "(min-width: 1024px) 58vw, 100vw"
              : "(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
          }
          style={{ objectPosition: image.position }}
          className="object-cover saturate-[0.85] transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
        />
        </div>
      </div>

      {/* directional overlay: dark from the lower-left, where the copy sits */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian/92 via-obsidian/45 to-obsidian/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/45 to-transparent"
      />

      <div className="flex h-full flex-col justify-between p-6 sm:p-8">
        <div data-sector-copy className="flex items-start justify-between">
          <span
            aria-hidden
            className="eyebrow text-[0.6875rem] text-platinum/80"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className="grid size-11 place-items-center border border-white/30 transition-colors duration-500 group-hover:border-platinum group-hover:bg-platinum group-hover:text-obsidian"
          >
            <ArrowUpRight
              strokeWidth={1.4}
              className="size-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>

        <div data-sector-copy>
          {heading}
          <p
            className={`mt-3 text-platinum/90 ${
              feature
                ? "max-w-[30rem] text-[1.0625rem] leading-[1.55]"
                : "text-[0.9375rem] leading-[1.55] sm:max-w-[26rem]"
            }`}
          >
            {summary}
          </p>
        </div>
      </div>
    </li>
  );
}

export function FeaturedSectors() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";

    fadeUp(el.querySelector("[data-sectors-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.13,
    });
    fadeUp(el.querySelectorAll("[data-sectors-intro]"), {
      trigger: el,
      start,
      delay: 0.3,
      stagger: 0.12,
    });

    // Each tile opens with its own trigger so tiles that enter together are
    // staggered by their column, and tiles further down wait for the scroll.
    el.querySelectorAll<HTMLElement>("[data-sector-tile]").forEach((tile, i) => {
      const img = tile.querySelector("[data-sector-img]");
      const copy = tile.querySelectorAll("[data-sector-copy]");
      const delay = (i % 3) * 0.1;
      revealImage(tile, img, { trigger: tile, start: "top 88%", duration: 1.2, delay });
      // One depth composition: the feature tile travels furthest and settles in scale,
      // the wide tiles drift more gently, compact tiles stay still. Desktop only.
      if (desktop && img && tile.dataset.sectorSize !== "compact") {
        const feat = tile.dataset.sectorSize === "feature";
        parallax(img, { amount: feat ? 9 : 4, trigger: tile });
        if (feat) {
          gsap.fromTo(tile.querySelector("[data-sector-scale]"), { scale: 1.1 }, {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      }
      fadeUp(copy, {
        trigger: tile,
        start: "top 88%",
        delay: delay + 0.55,
        y: 18,
        duration: 0.8,
        stagger: 0.1,
      });
    });

    fadeUp(el.querySelector("[data-sectors-cta]"), {
      trigger: el.querySelector("[data-sectors-cta]"),
      start: "top 95%",
      y: 16,
    });
  });

  return (
    <section
      id="sectors"
      ref={root}
      aria-labelledby="sectors-heading"
      className="relative bg-frost py-24 text-steel-deep sm:py-28 lg:py-36"
    >
      <div className="container-nx">
        <div className="grid items-end gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <SectionLabel data-anim data-sectors-label>
              Sectors of Interest
            </SectionLabel>
            <MaskedLines
              id="sectors-heading"
              lines={["Established Industries.", "Emerging Possibilities."]}
              className="display-lg mt-7 text-obsidian sm:mt-9"
            />
          </div>
          <p
            data-anim
            data-sectors-intro
            className="max-w-[30rem] text-[1.0625rem] leading-[1.6] sm:text-[1.125rem] lg:col-span-4 lg:col-start-9 lg:pb-2"
          >
            Our investment interests span businesses and assets that support economic activity,
            technological progress, and evolving global needs.
          </p>
        </div>

        <ul className="mt-14 grid auto-rows-[19rem] grid-cols-1 gap-3 sm:mt-16 sm:auto-rows-[20rem] sm:gap-4 md:grid-cols-2 lg:mt-20 lg:auto-rows-[18rem] lg:grid-cols-12">
          {SECTORS.map((s, i) => (
            <SectorTile key={s.id} sector={s} index={i} />
          ))}
        </ul>

        <div
          data-anim
          data-sectors-cta
          className="mt-10 flex flex-col items-start gap-6 sm:mt-12 sm:flex-row sm:items-center sm:gap-8"
        >
          <span aria-hidden className="hidden h-px flex-1 bg-line sm:block" />
          <Button href="/investments#sectors" variant="solid-dark">Discover All {INVESTMENT_SECTORS.length} Sectors</Button>
        </div>
      </div>
    </section>
  );
}
