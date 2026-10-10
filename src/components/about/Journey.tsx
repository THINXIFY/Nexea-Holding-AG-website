"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Official corporate registration history only. No business milestones are claimed. */
const MILESTONES = [
  { year: "2004", caption: "Company incorporation in Switzerland." },
  { year: "2010", caption: "Registered office transferred to Engelberg." },
  { year: "2014", caption: "Registered office established in Hergiswil." },
  { year: "Today", caption: "Continuing as a Swiss-registered investment holding company." },
] as const;

const DOT_ON = { backgroundColor: "#10171e", borderColor: "#10171e" };
const DOT_OFF = { backgroundColor: "#ffffff", borderColor: "#dce3e8" };

export function Journey() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const list = el.querySelector<HTMLElement>("[data-ms-list]");
    if (!list) return;
    const dots = Array.from(el.querySelectorAll<HTMLElement>("[data-ms-dot]"));
    const fills = Array.from(el.querySelectorAll<HTMLElement>("[data-ms-fill]"));
    const bodies = Array.from(el.querySelectorAll<HTMLElement>("[data-ms-body]"));
    const prop = desktop ? "scaleX" : "scaleY";
    const start = "top 80%";

    fadeUp(el.querySelector("[data-jr-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.13,
    });
    fadeUp(el.querySelector("[data-jr-intro]"), { trigger: el, start, delay: 0.3 });

    gsap.set(dots, DOT_OFF);
    gsap.set(fills, { [prop]: 0 });
    gsap.set(bodies, { autoAlpha: 0, y: 14 });

    if (desktop) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: list, start: "top 88%", once: true },
        defaults: { ease: "power2.out" },
      });
      const gap = 0.7;
      dots.forEach((d, i) => {
        const at = i * gap;
        tl.to(d, { ...DOT_ON, duration: 0.4 }, at);
        tl.to(bodies[i], { autoAlpha: 1, y: 0, duration: 0.8 }, at + 0.1);
        if (fills[i]) tl.to(fills[i], { scaleX: 1, duration: gap, ease: "none" }, at + 0.3);
      });
    } else {
      const seen = new Set<number>();
      const n = MILESTONES.length;
      ScrollTrigger.create({
        trigger: list,
        start: "top 72%",
        end: "bottom 72%",
        onUpdate: (self) => {
          const p = self.progress * (n - 1);
          fills.forEach((f, i) => gsap.set(f, { scaleY: Math.min(1, Math.max(0, p - i)) }));
          dots.forEach((d, i) => {
            const on = p >= i - 0.02;
            if (on && !seen.has(i)) {
              seen.add(i);
              gsap.to(d, { ...DOT_ON, duration: 0.35 });
              gsap.to(bodies[i], { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" });
            } else if (!on && seen.has(i)) {
              seen.delete(i);
              gsap.to(d, { ...DOT_OFF, duration: 0.3 });
            }
          });
        },
      });
      // Content is never left hidden if the scrub trigger is skipped (e.g. restored scroll).
      ScrollTrigger.create({
        trigger: list,
        start: "bottom bottom",
        once: true,
        onEnter: () => gsap.to(bodies, { autoAlpha: 1, y: 0, duration: 0.5 }),
      });
    }
  });

  return (
    <section
      ref={root}
      aria-labelledby="journey-heading"
      className="relative border-y border-line bg-pure py-16 text-muted sm:py-20 lg:py-24"
    >
      <div className="container-nx">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-jr-label>
              Our Journey
            </SectionLabel>
            <MaskedLines
              id="journey-heading"
              lines={["Established in 2004.", "Evolving with Perspective."]}
              className="display-md mt-6 text-ink sm:mt-8"
            />
          </div>
          <p
            data-anim
            data-jr-intro
            className="max-w-[34rem] text-[1.0625rem] leading-[1.6] lg:col-span-6 lg:border-l lg:border-line lg:pb-1 lg:pl-8"
          >
            Since its establishment in 2004, Nexea Holding AG has maintained its identity as a Swiss
            corporate investment holding company, with a mandate encompassing domestic and
            international business participations.
          </p>
        </div>

        <ol
          data-ms-list
          aria-label="Corporate registration milestones"
          className="mt-12 lg:mt-14 lg:grid lg:grid-cols-4"
        >
          {MILESTONES.map((m, i) => {
            const last = i === MILESTONES.length - 1;
            return (
              <li
                key={m.year}
                className={`relative flex gap-6 lg:block lg:pr-6 ${last ? "" : "pb-9 lg:pb-0"}`}
              >
                <span
                  data-ms-dot
                  className="relative z-10 mt-2 block size-3.5 shrink-0 rounded-full border border-ink bg-ink lg:mt-0"
                />
                {!last && (
                  <span
                    aria-hidden
                    className="absolute left-[0.4375rem] top-7 h-[calc(100%-1.75rem)] w-px -translate-x-1/2 bg-line lg:left-6 lg:right-2 lg:top-[0.4375rem] lg:h-px lg:w-auto lg:translate-x-0 lg:-translate-y-1/2"
                  >
                    <span data-ms-fill className="absolute inset-0 origin-top bg-steel lg:origin-left" />
                  </span>
                )}
                <div data-ms-body className="min-w-0 lg:mt-6">
                  <p className="font-display text-[2rem] leading-none text-ink sm:text-[2.25rem] xl:text-[2.75rem]">
                    {m.year}
                  </p>
                  <p className="mt-3 max-w-[16rem] text-[0.9375rem] leading-[1.55]">{m.caption}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
