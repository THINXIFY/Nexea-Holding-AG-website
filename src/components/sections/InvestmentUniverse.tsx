"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { UNIVERSE } from "@/data/universe";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

const pad = (n: number) => String(n).padStart(2, "0");
const TOTAL = UNIVERSE.length;

export function InvestmentUniverse() {
  const root = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const prev = useRef(0);

  // Hover-to-preview only where a real hover exists; everything else needs a click / Enter / Space.
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  /* Entrance ------------------------------------------------------------ */
  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 78%";
    const frame = el.querySelector<HTMLElement>("[data-uni-frame]");

    fadeUp(el.querySelector("[data-uni-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.13,
    });
    fadeUp(el.querySelector("[data-uni-intro]"), { trigger: el, start, delay: 0.3 });
    fadeUp(el.querySelectorAll("[data-uni-row]"), {
      trigger: el.querySelector("[data-uni-list]"),
      start: "top 88%",
      y: 16,
      duration: 0.7,
      stagger: 0.06,
    });
    fadeUp(el.querySelector("[data-uni-cta]"), {
      trigger: el.querySelector("[data-uni-cta]"),
      start: "top 96%",
      y: 14,
    });
    if (frame) revealImage(frame, null, { trigger: frame, start: "top 88%", duration: 1.3 });
  });

  /* Image crossfade + content swap -------------------------------------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const imgs = el.querySelectorAll<HTMLElement>("[data-uni-img]");
      const last = prev.current;
      prev.current = active;
      if (last === active) return;

      imgs.forEach((node, i) => {
        gsap.to(node, {
          autoAlpha: i === active ? 1 : 0,
          duration: reduce ? 0 : 0.9,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });
      if (!reduce) {
        gsap.fromTo(
          imgs[active].firstElementChild,
          { scale: 1.06 },
          { scale: 1, duration: 1.6, ease: "expo.out", overwrite: "auto" },
        );
        gsap.fromTo(
          el.querySelectorAll("[data-uni-copy]"),
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.06, overwrite: "auto" },
        );
      }
    },
    { scope: root, dependencies: [active] },
  );

  // Keyboard: arrows only move focus. Selection is always an explicit Enter / Space / click.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = TOTAL - 1;
    const half = TOTAL / 2;
    const map: Record<string, number> = {
      ArrowDown: Math.min(i + 1, last),
      ArrowUp: Math.max(i - 1, 0),
      ArrowRight: i + half <= last ? i + half : i,
      ArrowLeft: i - half >= 0 ? i - half : i,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      rowRefs.current[map[e.key]]?.focus();
    }
  };

  const current = UNIVERSE[active];

  return (
    <section
      id="investment-universe"
      ref={root}
      aria-labelledby="universe-heading"
      className="on-dark relative isolate bg-obsidian py-20 text-pure sm:py-24 lg:py-28"
    >
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-x-12 xl:gap-x-14">
        {/* Heading */}
        <div className="lg:col-span-12 lg:row-start-1 xl:col-span-7">
          <SectionLabel tone="light" data-anim data-uni-label>
            Our Investment Universe
          </SectionLabel>
          <MaskedLines
            id="universe-heading"
            lines={["Opportunity Across Industries."]}
            className="display-md mt-6 text-pure sm:mt-8"
          />
          <p
            data-anim
            data-uni-intro
            className="mt-5 max-w-[40rem] text-[1.0625rem] leading-[1.55] text-[#b1c0cc] sm:text-[1.125rem]"
          >
            Exploring opportunities across real assets, technology, healthcare, energy, industry,
            and emerging markets.
          </p>
        </div>

        {/* Preview (above the list on small screens, right-hand column on desktop) */}
        <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-2 lg:self-start xl:col-span-5 xl:col-start-8 xl:row-span-3 xl:row-start-1">
          <div id="universe-preview" aria-live="polite" aria-atomic="true">
            <div
              data-anim
              data-uni-frame
              className="relative isolate aspect-[16/10] w-full overflow-hidden bg-carbon sm:aspect-[16/9] md:aspect-[2/1] lg:aspect-[4/3] xl:aspect-square"
            >
              {UNIVERSE.map((c, i) => (
                <div
                  key={c.id}
                  data-uni-img
                  className={`absolute inset-0 -z-10 ${i === 0 ? "" : "invisible opacity-0"}`}
                >
                  <Image
                    src={c.image.src}
                    alt={i === active ? c.image.alt : ""}
                    aria-hidden={i !== active}
                    fill
                    sizes="(min-width: 1280px) 40vw, (min-width: 640px) 90vw, 100vw"
                    style={{ objectPosition: c.image.position }}
                    className="object-cover [filter:grayscale(0.3)_saturate(0.85)] will-change-transform"
                  />
                </div>
              ))}
              <div
                aria-hidden
                className="absolute inset-0 -z-[5] bg-gradient-to-t from-obsidian/90 via-obsidian/25 to-obsidian/10"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 -z-[5] h-24 bg-gradient-to-b from-obsidian/60 to-transparent"
              />
              <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 xl:p-8">
                <p data-uni-copy className="eyebrow text-[0.6875rem] text-platinum" aria-hidden>
                  {pad(active + 1)} / {pad(TOTAL)}
                </p>
                <div>
                  <p
                    data-uni-copy
                    className="font-display text-[1.5rem] leading-[1.2] sm:text-[1.75rem] xl:text-[1.875rem]"
                  >
                    {current.title}
                  </p>
                  <p
                    data-uni-copy
                    className="mt-3 hidden max-w-[26rem] text-base leading-[1.55] text-platinum/90 sm:block xl:text-[1.0625rem]"
                  >
                    {current.description}
                  </p>
                </div>
              </div>
            </div>
            {/* Small screens: description sits below the photo so it never competes with the image */}
            <p data-uni-copy className="mt-4 text-base leading-[1.55] text-[#b1c0cc] sm:hidden">
              {current.description}
            </p>
          </div>
          <p className="mt-4 hidden text-sm leading-[1.55] text-[#b1c0cc]/85 xl:block">
            Proposed areas of interest, not a record of portfolio holdings or completed
            investments.
          </p>
        </div>

        {/* Category selector */}
        <div className="lg:col-span-6 lg:col-start-1 lg:row-start-2 xl:col-span-7">
          <ul
            data-uni-list
            aria-label="Investment categories"
            className="grid border-t border-[#34414c] md:grid-flow-col md:grid-rows-4 md:gap-x-10 lg:grid-flow-row lg:grid-rows-none lg:gap-x-0 xl:grid-flow-col xl:grid-rows-4 xl:gap-x-10"
          >
            {UNIVERSE.map((c, i) => {
              const selected = i === active;
              return (
                <li key={c.id} data-anim data-uni-row className="border-b border-[#34414c]">
                  <button
                    ref={(n) => {
                      rowRefs.current[i] = n;
                    }}
                    type="button"
                    aria-pressed={selected}
                    aria-controls="universe-preview"
                    onClick={() => setActive(i)}
                    onPointerEnter={(e) => canHover && e.pointerType === "mouse" && setActive(i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className={`group relative flex min-h-[4.25rem] w-full items-center gap-4 py-3 pl-3 pr-2 text-left transition-colors duration-500 sm:gap-5 sm:pl-4 ${
                      selected ? "bg-carbon" : "hover:bg-carbon/50"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-0.5 origin-top bg-platinum transition-transform duration-500 ease-out-expo ${
                        selected ? "scale-y-100" : "scale-y-0"
                      }`}
                    />
                    <span
                      aria-hidden
                      className={`w-6 shrink-0 font-ui text-xs font-semibold tracking-[0.14em] transition-colors duration-500 ${
                        selected ? "text-platinum" : "text-[#b1c0cc]/80"
                      }`}
                    >
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`flex-1 font-ui text-[0.9375rem] font-semibold leading-snug transition-colors duration-500 sm:text-base ${
                        selected ? "text-pure" : "text-[#b1c0cc] group-hover:text-pure"
                      }`}
                    >
                      {c.title}
                    </span>
                    <ArrowRight
                      aria-hidden
                      strokeWidth={1.4}
                      className={`size-[1.125rem] shrink-0 transition-all duration-500 ease-out-expo ${
                        selected
                          ? "translate-x-0 text-platinum opacity-100"
                          : "-translate-x-1.5 text-silver opacity-40 group-hover:translate-x-0 group-hover:opacity-80"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div data-anim data-uni-cta className="lg:col-span-6 lg:row-start-3 xl:col-span-7">
          <Button href="#sectors" variant="solid-light" sweep>
            Explore All Investment Sectors
          </Button>
          <p className="mt-4 text-sm leading-[1.55] text-[#b1c0cc]/85 xl:hidden">
            Proposed areas of interest, not a record of portfolio holdings or completed
            investments.
          </p>
        </div>
      </div>
    </section>
  );
}
