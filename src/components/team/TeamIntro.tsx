"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Compact editorial statement. Deliberately does not restate the Board / Management responsibilities. */
export function TeamIntro() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-ti-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelector("[data-ti-copy]"), { trigger: el, start, delay: 0.3 });
    fadeUp(el.querySelectorAll("[data-ti-statement]"), { trigger: el, start: "top 74%", delay: 0.4, y: 20, stagger: 0.18, duration: 1 });
    // Fine silver line composition draws once.
    el.querySelectorAll<HTMLElement>("[data-ti-line]").forEach((l, i) => {
      gsap.fromTo(l, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.out", delay: 0.3 + i * 0.12, scrollTrigger: { trigger: el, start: "top 74%", once: true } });
    });
    el.querySelectorAll<HTMLElement>("[data-ti-vline]").forEach((l, i) => {
      gsap.fromTo(l, { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: "expo.out", delay: 0.5 + i * 0.12, scrollTrigger: { trigger: el, start: "top 74%", once: true } });
    });
  });

  return (
    <section ref={root} aria-labelledby="ti-heading" className="relative overflow-clip bg-frost py-12 text-muted sm:py-14 lg:py-16">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:items-center lg:gap-x-14">
        <div className="lg:col-span-6">
          <SectionLabel data-anim data-ti-label>Our Leadership</SectionLabel>
          <MaskedLines id="ti-heading" lines={["Leadership Built", "on Responsibility."]} className="display-md mt-5 text-ink sm:mt-6" />
          <p data-anim data-ti-copy className="mt-5 max-w-[32rem] text-[1.0625rem] leading-[1.6]">
            Nexea Holding AG&rsquo;s leadership brings together corporate governance, executive
            management, and an international business perspective.
          </p>
        </div>

        <div className="relative lg:col-span-6 lg:pl-10">
          {/* fine silver linework */}
          <span aria-hidden data-ti-vline className="absolute inset-y-0 left-0 hidden w-px origin-top bg-line lg:block" />
          <span aria-hidden data-ti-vline className="absolute inset-y-4 left-4 hidden w-px origin-top bg-line/70 lg:block" />
          <span aria-hidden data-ti-line className="mb-6 block h-px w-full origin-left bg-line lg:hidden" />
          <p data-anim data-ti-statement className="font-display text-[1.75rem] leading-[1.2] text-ink sm:text-[2.125rem] lg:text-[2.5rem]">
            A clear structure.
          </p>
          <p data-anim data-ti-statement className="mt-1 font-display text-[1.75rem] italic leading-[1.2] text-steel sm:text-[2.125rem] lg:text-[2.5rem]">
            A considered perspective.
          </p>
          <span aria-hidden data-ti-line className="mt-6 block h-px w-24 origin-left bg-steel" />
        </div>
      </div>
    </section>
  );
}
