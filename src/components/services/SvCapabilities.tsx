"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { CAPABILITY_STAGES } from "@/data/services";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function SvCapabilities() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 76%";
    fadeUp(el.querySelector("[data-sc-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.14, duration: 1.3 });
    fadeUp(el.querySelectorAll("[data-sc-copy]"), { trigger: el, start: "top 66%", delay: 0.3, stagger: 0.14 });

    const grid = el.querySelector("[data-sc-grid]");
    const rule = el.querySelector("[data-sc-rule]");
    const trigger = { trigger: grid, start: desktop ? "top 85%" : "top 80%", once: true } as const;
    // The rule draws once, and each stage lands as the line reaches it.
    if (rule) {
      gsap.fromTo(rule, desktop ? { scaleX: 0 } : { scaleY: 0 }, {
        ...(desktop ? { scaleX: 1 } : { scaleY: 1 }),
        duration: 2, ease: "power2.inOut", scrollTrigger: trigger,
      });
    }
    const stages = el.querySelectorAll<HTMLElement>("[data-sc-stage]");
    stages.forEach((stage, i) => {
      const at = 0.2 + i * 0.45;
      gsap.fromTo(stage.querySelector("[data-sc-dot]"), { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(2)", delay: at, scrollTrigger: trigger });
      fadeUp(stage.querySelectorAll("[data-sc-body]"), { trigger: grid, start: trigger.start, y: 16, delay: at + 0.1, stagger: 0.08, duration: 0.8 });
    });

    if (desktop) {
      gsap.fromTo("[data-sc-bg]", { yPercent: -5, scale: 1.08 }, {
        yPercent: 5, scale: 1.02, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    }
  });

  return (
    <section ref={root} aria-labelledby="sc-heading" className="on-dark relative isolate overflow-clip bg-carbon py-20 text-pure sm:py-24 lg:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div data-sc-bg className="absolute inset-0 will-change-transform">
          <Image src="/images/ab-principles-bg.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/88 to-carbon/70" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-carbon to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-carbon to-transparent" />
      </div>

      <div className="container-nx">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-7">
            <SectionLabel tone="light" data-anim data-sc-label>Strategic Capabilities</SectionLabel>
            <MaskedLines
              id="sc-heading"
              lines={["From Understanding", "to Strategic Direction."]}
              className="display-lg mt-5 sm:mt-6"
            />
          </div>
          <p data-anim data-sc-copy className="max-w-[34rem] text-[1.0625rem] leading-[1.6] text-platinum lg:col-span-5 lg:pb-1">
            Effective decision-making connects commercial insight with clearly defined objectives.
            Our proposed capability framework brings together four complementary disciplines.
          </p>
        </div>

        <ol data-sc-grid className="relative mt-12 grid gap-y-9 pl-7 lg:mt-14 lg:grid-cols-4 lg:gap-y-0 lg:pl-0">
          {/* progress rule: vertical on small screens, horizontal from lg */}
          <span aria-hidden className="absolute bottom-1 left-0 top-1 w-px bg-silver/20 lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-0 lg:h-px lg:w-auto">
            <span data-sc-rule className="absolute inset-0 origin-top bg-silver/70 lg:origin-left" />
          </span>
          {CAPABILITY_STAGES.map((s, i) => (
            <li key={s.title} data-sc-stage className="relative lg:pr-8 lg:pt-8">
              <span
                aria-hidden
                data-sc-dot
                className="absolute -left-7 top-2 size-[0.4375rem] -translate-x-1/2 rounded-full bg-platinum lg:left-0 lg:top-0 lg:-translate-y-1/2 lg:translate-x-0"
              />
              <p data-anim data-sc-body aria-hidden className="font-display text-[2rem] leading-none text-silver/55 lg:text-[2.5rem]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 data-anim data-sc-body className="mt-3 font-ui text-[0.9375rem] font-semibold uppercase tracking-[0.16em] text-pure">
                {s.title}
              </h3>
              <p data-anim data-sc-body className="mt-3 max-w-[19rem] text-[0.9375rem] leading-[1.55] text-silver">{s.description}</p>
            </li>
          ))}
        </ol>

        <p data-anim data-sc-copy className="mt-12 flex items-center gap-4 font-display text-[1.25rem] italic leading-[1.3] text-pure sm:text-[1.5rem]">
          <span aria-hidden className="hidden h-px w-10 shrink-0 bg-silver/60 sm:block" />
          Clarity in thinking. Purpose in direction.
        </p>
      </div>
    </section>
  );
}
