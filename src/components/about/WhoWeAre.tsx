"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

const FACTS = [
  { value: "2004", label: "Established" },
  { value: "Switzerland", label: "Registered Headquarters" },
  { value: "International", label: "Investment Mandate" },
] as const;

export function WhoWeAre() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 78%";

    fadeUp(el.querySelector("[data-ww-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.13,
    });
    fadeUp(el.querySelectorAll("[data-ww-copy]"), {
      trigger: el.querySelector("[data-ww-body]"),
      start: "top 88%",
      stagger: 0.14,
    });
    fadeUp(el.querySelectorAll("[data-ww-fact]"), {
      trigger: el.querySelector("[data-ww-facts]"),
      start: "top 92%",
      stagger: 0.14,
      y: 16,
    });

    const main = el.querySelector<HTMLElement>("[data-ww-main]");
    const side = el.querySelector<HTMLElement>("[data-ww-side]");
    if (main) {
      const img = main.querySelector("[data-ww-img]");
      revealImage(main, img, { trigger: main, start: "top 90%", duration: 1.4 });
      if (desktop && img) parallax(img, { amount: 8, trigger: main });
      // Layered depth (desktop): the two frames drift in opposite directions...
      if (desktop) {
        gsap.fromTo(main, { y: -18 }, { y: 18, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      }
    }
    if (side) {
      revealImage(side, side.querySelector("[data-ww-img]"), {
        trigger: side,
        start: "top 92%",
        delay: 0.2,
        duration: 1.4,
      });
      if (desktop) {
        // ...and the tall frame's own photograph counter-moves inside it, for foreground / background separation.
        gsap.fromTo(side, { y: 46 }, { y: -46, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        const sideImg = side.querySelector("[data-ww-img]");
        if (sideImg) parallax(sideImg, { amount: -9, trigger: side });
      }
    }
  });

  return (
    <section
      ref={root}
      aria-labelledby="who-heading"
      className="relative bg-frost py-20 text-muted sm:py-24 lg:py-28"
    >
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-12 md:grid-cols-2 md:items-center md:gap-x-10 lg:grid-cols-[45fr_55fr] lg:gap-x-14">
        {/* Copy */}
        <div>
          <SectionLabel data-anim data-ww-label>
            Who We Are
          </SectionLabel>
          <MaskedLines
            id="who-heading"
            lines={["A Focused Approach", "to Corporate Investment."]}
            className="display-md mt-6 text-ink sm:mt-8"
          />
          <div data-ww-body className="mt-7 max-w-[32rem] space-y-5 text-[1.0625rem] leading-[1.6]">
            <p data-anim data-ww-copy>
              Founded in 2004 and headquartered in Hergiswil, Switzerland, Nexea Holding AG focuses
              on acquiring, managing, and holding corporate participations.
            </p>
            <p data-anim data-ww-copy>
              Our investment mandate spans listed and privately held businesses across domestic and
              international markets.
            </p>
          </div>

          <ul
            data-ww-facts
            aria-label="Corporate facts"
            className="mt-9 grid border-t border-line sm:grid-cols-3 sm:border-t-0 sm:pt-0"
          >
            {FACTS.map((f, i) => (
              <li
                key={f.label}
                data-anim
                data-ww-fact
                className={`border-b border-line py-4 sm:border-b-0 sm:py-1 ${
                  i > 0 ? "sm:border-l sm:pl-5" : ""
                } sm:pr-4`}
              >
                <p className="font-display text-[1.625rem] leading-none text-ink xl:text-[1.875rem]">
                  {f.value}
                </p>
                <p className="mt-2 font-ui text-[0.8125rem] leading-snug text-muted">{f.label}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Images: stacked on small screens, offset composition from lg */}
        <div className="grid grid-cols-12 items-start gap-3 sm:gap-4 lg:gap-0">
          <div
            data-anim
            data-ww-main
            className="relative col-span-12 aspect-[4/3] overflow-hidden bg-steel-deep sm:col-span-7 md:col-span-12 lg:col-span-8"
          >
            <div data-ww-img className="absolute inset-x-0 -top-[8%] h-[116%]">
              <Image
                src="/images/ab-analysis.jpg"
                alt="A professional reviewing financial reports and charts at a desk, pen in hand"
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-[55%_50%] [filter:saturate(0.8)]"
              />
            </div>
          </div>
          <div
            data-anim
            data-ww-side
            className="relative col-span-12 aspect-[16/9] overflow-hidden bg-obsidian sm:col-span-5 sm:aspect-[4/5] md:col-span-12 md:aspect-[16/9] lg:col-span-5 lg:col-start-8 lg:-mt-24 lg:aspect-[4/5]"
          >
            <div data-ww-img className="absolute inset-x-0 -top-[10%] h-[120%]">
              <Image
                src="/images/ab-tower.jpg"
                alt="Black-and-white view up the glass facade of a commercial office tower"
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 36vw, 100vw"
                className="object-cover object-[60%_40%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
