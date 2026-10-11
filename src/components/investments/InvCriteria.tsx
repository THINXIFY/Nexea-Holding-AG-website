"use client";

import { useRef } from "react";
import { Building, Gauge, LineChart, ShieldCheck, Target, Telescope, type LucideIcon } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { CRITERIA } from "@/data/investments";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

const ICONS: readonly LucideIcon[] = [Building, LineChart, Gauge, Target, ShieldCheck, Telescope];

export function InvCriteria() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-cr-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelector("[data-cr-intro]"), { trigger: el, start, delay: 0.3 });

    const grid = el.querySelector("[data-cr-grid]");
    el.querySelectorAll<HTMLElement>("[data-cr-item]").forEach((item, i) => {
      const line = item.querySelector("[data-cr-line]");
      if (line) {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1, duration: 1.2, ease: "expo.out", delay: (i % 3) * 0.1 + Math.floor(i / 3) * 0.2,
          scrollTrigger: { trigger: grid, start: "top 88%", once: true },
        });
      }
      fadeUp(item.querySelectorAll("[data-cr-body]"), {
        trigger: grid, start: "top 88%", y: 16,
        delay: 0.15 + (i % 3) * 0.1 + Math.floor(i / 3) * 0.2, stagger: 0.06,
      });
    });
  });

  return (
    <section ref={root} aria-labelledby="cr-heading" className="relative bg-pure py-20 text-muted sm:py-24 lg:py-28">
      <div className="container-nx">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-7">
            <SectionLabel data-anim data-cr-label>Investment Considerations</SectionLabel>
            <MaskedLines
              id="cr-heading"
              lines={["What Makes an Opportunity", "Worth Exploring?"]}
              className="display-md mt-6 text-ink sm:mt-8"
            />
          </div>
          <p data-anim data-cr-intro className="max-w-[34rem] text-[1.0625rem] leading-[1.6] lg:col-span-5 lg:pb-2">
            Every business and asset presents distinct characteristics. Our evaluation
            criteria focus on understanding commercial potential, financial fundamentals, and
            strategic relevance.
          </p>
        </div>

        <ul data-cr-grid className="mt-12 grid sm:grid-cols-2 sm:gap-x-10 lg:mt-14 lg:grid-cols-3 lg:gap-x-12">
          {CRITERIA.map((c, i) => {
            const Icon = ICONS[i];
            return (
              <li key={c.title} data-cr-item className="group relative py-7 sm:py-9">
                <span aria-hidden data-cr-line className="absolute inset-x-0 top-0 h-px origin-left bg-line transition-colors duration-500 group-hover:bg-obsidian" />
                <div data-anim data-cr-body className="flex items-center justify-between">
                  <span aria-hidden className="font-ui text-xs font-semibold tracking-[0.16em] text-steel">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon aria-hidden strokeWidth={1.2} className="size-6 text-steel transition-colors duration-500 group-hover:text-ink" />
                </div>
                <h3 data-anim data-cr-body className="mt-5 font-ui text-[1.0625rem] font-semibold leading-snug text-ink">
                  {c.title}
                </h3>
                <p data-anim data-cr-body className="mt-2.5 max-w-[22rem] text-[1rem] leading-[1.55]">
                  {c.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
