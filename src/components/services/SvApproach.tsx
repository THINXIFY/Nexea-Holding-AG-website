"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { SERVICE_APPROACH } from "@/data/services";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

const ACTIVE = { backgroundColor: "#090d11", borderColor: "#090d11", color: "#ffffff" };
const IDLE = { backgroundColor: "#ffffff", borderColor: "#dce3e8", color: "#10171e" };

export function SvApproach() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const list = el.querySelector<HTMLElement>("[data-sp-list]");
    if (!list) return;
    const dots = Array.from(el.querySelectorAll<HTMLElement>("[data-sp-dot]"));
    const fills = Array.from(el.querySelectorAll<HTMLElement>("[data-sp-fill]"));
    const bodies = Array.from(el.querySelectorAll<HTMLElement>("[data-sp-body]"));
    const prop = desktop ? "scaleX" : "scaleY";
    const start = "top 80%";

    fadeUp(el.querySelector("[data-sp-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-sp-copy]"), { trigger: el, start, delay: 0.3, stagger: 0.12 });

    gsap.set(dots, IDLE);
    gsap.set(fills, { [prop]: 0 });
    gsap.set(bodies, { autoAlpha: 0, y: 14 });

    if (desktop) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: list, start: "top 86%", once: true }, defaults: { ease: "power2.out" } });
      const gap = 0.6;
      dots.forEach((d, i) => {
        tl.to(d, { ...ACTIVE, duration: 0.4 }, i * gap);
        tl.to(bodies[i], { autoAlpha: 1, y: 0, duration: 0.7 }, i * gap + 0.1);
        if (fills[i]) tl.to(fills[i], { scaleX: 1, duration: gap, ease: "none" }, i * gap + 0.3);
      });
    } else {
      const seen = new Set<number>();
      const n = SERVICE_APPROACH.length;
      ScrollTrigger.create({
        trigger: list, start: "top 72%", end: "bottom 72%",
        onUpdate: (self) => {
          const p = self.progress * (n - 1);
          fills.forEach((f, i) => gsap.set(f, { scaleY: Math.min(1, Math.max(0, p - i)) }));
          dots.forEach((d, i) => {
            const on = p >= i - 0.02;
            if (on && !seen.has(i)) {
              seen.add(i);
              gsap.to(d, { ...ACTIVE, duration: 0.35 });
              gsap.to(bodies[i], { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" });
            } else if (!on && seen.has(i)) {
              seen.delete(i);
              gsap.to(d, { ...IDLE, duration: 0.3 });
            }
          });
        },
      });
      ScrollTrigger.create({ trigger: list, start: "bottom bottom", once: true, onEnter: () => gsap.to(bodies, { autoAlpha: 1, y: 0, duration: 0.5 }) });
    }
  });

  return (
    <section ref={root} aria-labelledby="sp-heading" className="relative bg-frost py-16 text-muted sm:py-20 lg:py-24">
      <div className="container-nx">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-sp-label>Our Approach</SectionLabel>
            <MaskedLines id="sp-heading" lines={["Clarity at", "Every Stage."]} className="display-md mt-6 text-ink sm:mt-8" />
          </div>
          <p data-anim data-sp-copy className="max-w-[34rem] text-[1.0625rem] leading-[1.6] lg:col-span-6 lg:pb-1">
            Our strategic approach emphasizes understanding the objective, examining the
            opportunity, and defining a considered path forward.
          </p>
        </div>

        <ol data-sp-list aria-label="Strategic approach in four stages" className="mt-12 lg:mt-14 lg:grid lg:grid-cols-4">
          {SERVICE_APPROACH.map((s, i) => {
            const last = i === SERVICE_APPROACH.length - 1;
            return (
              <li key={s.title} className={`relative flex gap-5 lg:block lg:pr-6 ${last ? "" : "pb-9 lg:pb-0"}`}>
                <span data-sp-dot className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-obsidian bg-obsidian font-ui text-sm font-semibold text-pure">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {!last && (
                  <span aria-hidden className="absolute left-6 top-14 h-[calc(100%-3.5rem)] w-px -translate-x-1/2 bg-line lg:left-[3.75rem] lg:right-2 lg:top-6 lg:h-px lg:w-auto lg:translate-x-0">
                    <span data-sp-fill className="absolute inset-0 origin-top bg-steel lg:origin-left" />
                  </span>
                )}
                <div data-sp-body className="min-w-0 pt-1.5 lg:mt-6 lg:pt-0">
                  <h3 className="font-display text-[1.5rem] leading-[1.15] text-ink">{s.title}</h3>
                  <p className="mt-2 max-w-[18rem] text-[0.9375rem] leading-[1.55]">{s.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-10 border-l border-steel/60 pl-5 font-display text-[1.375rem] italic leading-snug text-ink sm:text-[1.625rem]">
          Informed thinking creates clearer direction.
        </p>
      </div>
    </section>
  );
}
