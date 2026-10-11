"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { QUESTIONS } from "@/data/investor-challenge";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Promotional band for the Investor Challenge on the Investments page. */
export function InvChallenge() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-icp-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-icp-copy]"), { trigger: el, start, delay: 0.3, stagger: 0.12 });
    const path = el.querySelector("[data-icp-path]");
    if (path) gsap.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 75%", once: true } });
  });

  return (
    <section ref={root} id="investor-challenge" aria-labelledby="icp-heading" className="on-dark relative isolate overflow-hidden bg-obsidian py-16 text-pure sm:py-20 lg:py-24">
      <div className="container-nx grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <SectionLabel tone="light" data-anim data-icp-label>Investor Challenge</SectionLabel>
          <MaskedLines id="icp-heading" lines={["Think Like", "an Investor."]} className="display-lg mt-5 sm:mt-6" />
          <p data-anim data-icp-copy className="mt-6 max-w-[30rem] text-[1.0625rem] leading-[1.5] text-platinum">
            Five questions. One challenge. Discover your investment knowledge, from diversification and due diligence to liquidity and time horizon.
          </p>
          <div data-anim data-icp-copy className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button href="/investor-challenge" variant="solid-light" arrowIcon="up-right" sweep className="w-full sm:w-auto">Start the Challenge</Button>
            <p className="font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-silver">{QUESTIONS.length} questions · about a minute</p>
          </div>
        </div>
        <div aria-hidden className="flex justify-center lg:col-span-5 lg:justify-end">
          <svg viewBox="0 0 360 220" fill="none" className="w-full max-w-[24rem]">
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="0" x2="360" y1={30 + i * 50} y2={30 + i * 50} stroke="#aebeca" strokeOpacity="0.14" />
            ))}
            <path data-icp-path d="M10 190 L70 165 L120 172 L180 120 L230 128 L290 70 L350 30" stroke="#d6e0e8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} />
            {[[70, 165], [180, 120], [290, 70], [350, 30]].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="3.5" fill="#090d11" stroke="#aebeca" strokeWidth="1.4" />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
