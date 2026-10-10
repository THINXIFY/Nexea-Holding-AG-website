"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { fadeUp, parallax, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { Button } from "@/components/ui/Button";
import { GlobeLines } from "@/components/ui/GlobeLines";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function GlobalPerspective() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 76%";

    fadeUp(el.querySelector("[data-global-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.16,
      duration: 1.4,
    });
    fadeUp(el.querySelectorAll("[data-global-copy]"), {
      trigger: el,
      start: "top 66%",
      delay: 0.3,
      stagger: 0.13,
    });

    const photo = el.querySelector("[data-global-photo]");
    const globe = el.querySelector("[data-global-globe]");
    if (desktop && photo) parallax(photo, { amount: 6, trigger: el });
    if (globe) {
      // Scroll-linked, lightweight "rotation": the linework turns a few degrees as the section passes.
      gsap.fromTo(
        globe,
        { rotation: -10, scale: 1.04 },
        {
          rotation: 10,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );
    }
  });

  return (
    <section
      id="global-perspective"
      ref={root}
      aria-labelledby="global-heading"
      className="on-dark relative isolate overflow-clip bg-obsidian py-24 text-pure sm:py-28 lg:py-36"
    >
      {/* Backdrop: night-time Earth photograph + abstract globe linework */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="mask-fade-left absolute inset-y-0 right-0 w-full lg:w-[68%]">
          <div data-global-photo className="absolute inset-x-0 -top-[7%] h-[114%]">
            <Image
              src="/images/global-earth.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 68vw, 100vw"
              className="object-cover object-[60%_50%] grayscale brightness-[2.4] contrast-110"
            />
          </div>
        </div>
        <div
          data-global-globe
          className="absolute -right-[18%] top-1/2 aspect-square w-[min(56rem,140vw)] -translate-y-1/2 text-silver/[0.16] lg:-right-[4%]"
        >
          <GlobeLines className="size-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/75 to-obsidian/10 max-lg:bg-obsidian/70" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-obsidian to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian to-transparent" />
      </div>

      <div className="container-nx">
        <div className="max-w-[40rem]">
          <SectionLabel tone="light" data-anim data-global-label>
            Global Perspective
          </SectionLabel>

          <MaskedLines
            id="global-heading"
            lines={["Swiss Foundations.", "A World of Opportunity."]}
            lineClasses={["", "italic text-silver"]}
            className="display-lg mt-7 sm:mt-9"
          />

          <p
            data-anim
            data-global-copy
            className="mt-8 max-w-[34rem] text-[1.0625rem] leading-[1.6] text-platinum sm:mt-10 sm:text-[1.125rem]"
          >
            Headquartered in Switzerland, Nexea Holding AG maintains an international investment
            mandate, exploring opportunities across diverse markets, industries, and economic
            environments.
          </p>

          <p
            data-anim
            data-global-copy
            className="mt-8 border-l border-silver/60 pl-5 font-display text-[1.5rem] italic leading-[1.3] text-pure sm:text-[1.75rem]"
          >
            A broader outlook. A longer horizon.
          </p>

          <div data-anim data-global-copy className="mt-10 sm:mt-12">
            <Button href="/about" variant="solid-light">
              Discover Nexea
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
