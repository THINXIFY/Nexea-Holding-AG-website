"use client";

import { useRef } from "react";
import Image from "next/image";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { THEMES } from "@/data/services";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function SvIntro() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 78%";
    fadeUp(el.querySelector("[data-si-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-si-copy]"), { trigger: el.querySelector("[data-si-body]"), start: "top 88%", stagger: 0.14 });
    fadeUp(el.querySelector("[data-si-highlight]"), { trigger: el.querySelector("[data-si-highlight]"), start: "top 92%", y: 14, duration: 1 });
    el.querySelectorAll<HTMLElement>("[data-si-frame]").forEach((frame, i) => {
      const img = frame.querySelector("[data-si-img]");
      revealImage(frame, img, { trigger: frame, start: "top 90%", delay: i * 0.15, duration: 1.4 });
      if (desktop && img) parallax(img, { amount: i === 0 ? 7 : 10, trigger: frame });
    });
    fadeUp(el.querySelectorAll("[data-si-theme]"), { trigger: el.querySelector("[data-si-themes]"), start: "top 90%", stagger: 0.13, y: 16 });
  });

  return (
    <section ref={root} aria-labelledby="si-heading" className="relative bg-frost py-20 text-muted sm:py-24 lg:py-28">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-12 md:grid-cols-2 md:gap-x-10 lg:grid-cols-[5fr_4fr_3fr] lg:items-center lg:gap-x-10 xl:gap-x-14">
        <div className="md:col-span-2 lg:col-span-1">
          <SectionLabel data-anim data-si-label>Our Perspective</SectionLabel>
          <MaskedLines
            id="si-heading"
            lines={["Insight That", "Informs Opportunity."]}
            className="display-md mt-6 text-ink sm:mt-8"
          />
          <div data-si-body className="mt-7 max-w-[34rem] space-y-5 text-[1.0625rem] leading-[1.6]">
            <p data-anim data-si-copy>
              Successful business decisions require more than capital. They call for a clear
              understanding of markets, corporate structures, emerging technologies, and
              commercial potential.
            </p>
            <p data-anim data-si-copy>
              Building on its investment-oriented perspective, Nexea&rsquo;s advisory
              perspective brings together strategic analysis, business insight, and an international
              outlook.
            </p>
          </div>
          <p data-anim data-si-highlight className="mt-8 flex items-start gap-4 font-display text-[1.5rem] leading-[1.25] text-ink sm:text-[1.75rem]">
            <span aria-hidden className="mt-4 hidden h-px w-10 shrink-0 bg-steel sm:block" />
            Where investment perspective meets business understanding.
          </p>
        </div>

        <div className="grid grid-cols-12 items-start gap-3 sm:gap-4 md:col-span-1 lg:gap-0">
          <div data-anim data-si-frame className="relative col-span-12 aspect-[4/3] overflow-hidden bg-steel-deep sm:col-span-7 md:col-span-12 lg:col-span-10 lg:aspect-[3/4]">
            <div data-si-img className="absolute inset-x-0 -top-[8%] h-[116%]">
              <Image src="/images/ab-governance.jpg" alt="A modern office interior with panoramic windows overlooking a city skyline" fill sizes="(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 100vw" className="object-cover object-[40%_55%] [filter:saturate(0.8)]" />
            </div>
          </div>
          <div data-anim data-si-frame className="relative col-span-12 aspect-[16/9] overflow-hidden bg-obsidian sm:col-span-5 sm:aspect-[4/5] md:col-span-12 md:aspect-[16/9] lg:col-span-7 lg:col-start-6 lg:-mt-20 lg:aspect-square">
            <div data-si-img className="absolute inset-0">
              <Image src="/images/svc-globe-2.jpg" alt="A close-up of a world globe showing Europe" fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 36vw, 100vw" className="object-cover object-[50%_50%]" />
            </div>
          </div>
        </div>

        <ul data-si-themes aria-label="Perspective themes" className="border-t border-line md:col-span-1 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-8">
          {THEMES.map((t) => (
            <li key={t.title} data-anim data-si-theme className="border-b border-line py-5 last:border-b-0 lg:first:pt-0 lg:last:pb-0">
              <h3 className="font-ui text-[1.0625rem] font-semibold text-ink">{t.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.6]">{t.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
