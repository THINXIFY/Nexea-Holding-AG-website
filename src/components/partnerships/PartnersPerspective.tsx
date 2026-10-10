"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function PartnersPerspective() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-pp-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    gsap.fromTo(el.querySelector("[data-pp-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "expo.out", delay: 0.3, scrollTrigger: { trigger: el, start, once: true } });
    fadeUp(el.querySelectorAll("[data-pp-copy]"), { trigger: el, start, delay: 0.3, stagger: 0.14 });
  });

  return (
    <section ref={root} id="perspective" aria-labelledby="pp-heading" className="relative bg-pure py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-8 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <SectionLabel data-anim data-pp-label>Our Perspective</SectionLabel>
          <div className="mt-5 flex items-end gap-8 sm:mt-6">
            <MaskedLines id="pp-heading" lines={["Connecting Ambition", "with Opportunity."]} className="display-lg shrink-0 text-ink" />
            <span aria-hidden data-pp-rule className="mb-[0.9rem] hidden h-px flex-1 origin-left bg-silver lg:block" />
          </div>
        </div>
        <div className="lg:col-span-5 lg:pt-10">
          <p data-anim data-pp-copy className="max-w-[34rem] text-[1.0625rem] leading-[1.65]">
            Strong business relationships begin with complementary strengths and a shared
            understanding of opportunity. Nexea Holding AG&rsquo;s international investment
            perspective provides a foundation for exploring relationships across companies,
            industries, and markets.
          </p>
          <p data-anim data-pp-copy className="mt-5 font-display text-[1.375rem] italic leading-[1.3] text-steel sm:text-[1.5rem]">
            Different strengths. Shared possibilities.
          </p>
        </div>
      </div>
    </section>
  );
}
