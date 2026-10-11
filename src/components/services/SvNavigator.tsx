"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { QUESTIONS } from "@/data/service-navigator";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Featured entry point to the Service Navigator, placed on the Services page. */
export function SvNavigator() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-sn-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-sn-copy]"), { trigger: el, start, delay: 0.3, stagger: 0.12 });
    el.querySelectorAll("[data-sn-step]").forEach((s, i) => {
      fadeUp(s, { trigger: el.querySelector("[data-sn-steps]"), start: "top 88%", y: 14, delay: i * 0.08, duration: 0.7 });
    });
    const line = el.querySelector("[data-sn-line]");
    if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: line, start: "top 92%", once: true } });
  });

  return (
    <section ref={root} id="service-navigator" aria-labelledby="sn-heading" className="on-dark relative isolate overflow-hidden bg-obsidian py-14 text-pure sm:py-16 lg:py-20">
      <svg aria-hidden viewBox="0 0 400 400" fill="none" className="pointer-events-none absolute -right-28 -top-28 -z-10 size-[34rem] text-silver/[0.08]">
        {[70, 120, 170, 220, 270].map((r) => (
          <circle key={r} cx="400" cy="0" r={r} stroke="currentColor" strokeWidth="1" />
        ))}
      </svg>
      <div className="container-nx">
        <div className="grid items-end gap-y-6 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <SectionLabel tone="light" data-anim data-sn-label>Service Navigator</SectionLabel>
            <MaskedLines id="sn-heading" lines={["Which Nexea", "Service Fits You?"]} className="display-lg mt-5 sm:mt-6" />
          </div>
          <div className="lg:col-span-5">
            <p data-anim data-sn-copy className="max-w-[28rem] text-[1.0625rem] leading-[1.5] text-platinum">
              A guided, five-question consultation that matches your objectives to Nexea&rsquo;s areas of expertise, in about a minute.
            </p>
            <div data-anim data-sn-copy className="mt-6">
              <Button href="/service-navigator" variant="solid-light" arrowIcon="up-right" sweep className="w-full sm:w-auto">Find My Service</Button>
            </div>
          </div>
        </div>

        <span aria-hidden data-sn-line className="mt-10 block h-px origin-left bg-white/20 sm:mt-12" />
        <ol data-sn-steps className="grid sm:grid-cols-2 lg:grid-cols-5">
          {QUESTIONS.map((q, i) => (
            <li key={q.id} data-anim data-sn-step className="border-b border-white/10 py-5 sm:pr-6 lg:border-b-0 lg:border-r lg:border-white/10 lg:px-6 lg:first:pl-0 lg:last:border-r-0">
              <span aria-hidden className="font-display text-[2.25rem] leading-none text-transparent [-webkit-text-stroke:1px_#aebeca]">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-3 font-ui text-[0.9375rem] font-semibold leading-[1.3] text-pure">{q.short}</p>
              <p className="mt-1 text-[0.8125rem] leading-[1.4] text-silver/85">{q.question}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
