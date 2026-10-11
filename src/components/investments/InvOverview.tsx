"use client";

import { useRef } from "react";
import Image from "next/image";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function InvOverview() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 78%";
    fadeUp(el.querySelector("[data-ov-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-ov-copy]"), { trigger: el.querySelector("[data-ov-body]"), start: "top 88%", stagger: 0.14 });

    el.querySelectorAll<HTMLElement>("[data-ov-frame]").forEach((frame, i) => {
      const img = frame.querySelector("[data-ov-img]");
      revealImage(frame, img, { trigger: frame, start: "top 90%", delay: i * 0.15, duration: 1.4 });
      if (desktop && img) parallax(img, { amount: i === 0 ? 7 : 10, trigger: frame });
    });
    fadeUp(el.querySelector("[data-ov-statement]"), {
      trigger: el.querySelector("[data-ov-statement]"),
      start: "top 92%",
      y: 16,
      duration: 1,
    });
  });

  return (
    <section ref={root} aria-labelledby="ov-heading" className="relative bg-frost py-20 text-muted sm:py-24 lg:py-28">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-12">
        <div className="lg:col-span-5">
          <SectionLabel data-anim data-ov-label>Our Investment Focus</SectionLabel>
          <MaskedLines
            id="ov-heading"
            lines={["A Broader View", "of Opportunity."]}
            className="display-md mt-6 text-ink sm:mt-8"
          />
          <div data-ov-body className="mt-7 max-w-[34rem] space-y-5 text-[1.0625rem] leading-[1.6]">
            <p data-anim data-ov-copy>
              Nexea Holding AG&rsquo;s investment mandate encompasses the acquisition, management,
              and disposal of participations in listed and privately held companies across
              domestic and international markets.
            </p>
            <p data-anim data-ov-copy>
              Our investment focus spans established asset classes, productive
              industries, and emerging technologies, reflecting a broad perspective on long-term
              business potential.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="grid grid-cols-12 items-start gap-3 sm:gap-4">
            <div
              data-anim
              data-ov-frame
              className="relative col-span-12 aspect-[4/3] overflow-hidden bg-steel-deep sm:col-span-6 lg:col-span-6 lg:aspect-[3/4]"
            >
              <div data-ov-img className="absolute inset-x-0 -top-[8%] h-[116%]">
                <Image
                  src="/images/inv-overview-tower.jpg"
                  alt="Looking up the curved glass facade of a modern commercial tower"
                  fill
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover object-[50%_40%]"
                />
              </div>
            </div>
            <div
              data-anim
              data-ov-frame
              className="relative col-span-12 aspect-[4/3] overflow-hidden bg-steel-deep sm:col-span-6 lg:col-span-6 lg:mt-14 lg:aspect-[3/4]"
            >
              <div data-ov-img className="absolute inset-x-0 -top-[8%] h-[116%]">
                <Image
                  src="/images/inv-overview-analysis.jpg"
                  alt="A hand holding a pen over financial documents on a wooden desk"
                  fill
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover object-[60%_50%]"
                />
              </div>
            </div>
          </div>
          <p
            data-anim
            data-ov-statement
            className="mt-8 border-l border-steel/60 pl-5 font-display text-[1.5rem] leading-[1.25] text-ink sm:text-[1.875rem]"
          >
            Independent thinking. Diverse opportunities.
            <span className="mt-1 block italic text-steel">A long-term outlook.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
