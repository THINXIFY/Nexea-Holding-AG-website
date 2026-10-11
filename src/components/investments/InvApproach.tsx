"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { APPROACH_STEPS } from "@/data/investments";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Geometry: every step is a two-column row (3rem marker column + text column),
 * so every marker centre sits 1.5rem from the row's left edge, and each
 * connector segment is drawn on exactly that axis from one marker to the next.
 * The default (no JS / reduced motion) styling is the fully "reached" state;
 * GSAP only switches steps to `data-state="idle"` while it is running.
 */
export function InvApproach() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-ap-step]"));
    const start = "top 80%";

    fadeUp(el.querySelector("[data-ap-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-ap-copy]"), { trigger: el, start, delay: 0.3, stagger: 0.12 });

    steps.forEach((step) => {
      step.dataset.state = "idle";
      const fill = step.querySelector<HTMLElement>("[data-ap-fill]");
      // A step activates when it reaches 62% of the viewport and stays "reached" afterwards.
      ScrollTrigger.create({
        trigger: step,
        start: "top 62%",
        onEnter: () => (step.dataset.state = "active"),
        onLeaveBack: () => (step.dataset.state = "idle"),
        // Loaded already scrolled past this step: it must read as reached.
        onRefresh: (self) => {
          if (self.progress > 0 || self.isActive) step.dataset.state = "active";
        },
      });
      // The connector below a step fills between its marker and the next marker.
      if (fill) {
        gsap.set(fill, { scaleY: 0 });
        gsap.to(fill, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: step, start: "top 62%", end: () => `+=${step.offsetHeight}`, scrub: true },
        });
      }
    });
    return () => steps.forEach((s) => delete s.dataset.state);
  });

  return (
    <section ref={root} id="approach" aria-labelledby="ap-heading" className="relative scroll-mt-16 bg-frost py-20 text-muted sm:py-24 lg:py-28">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-[38fr_62fr] lg:gap-x-16 xl:gap-x-24">
        <div>
          <div className="lg:sticky lg:top-32">
            <SectionLabel data-anim data-ap-label>Our Approach</SectionLabel>
            <MaskedLines id="ap-heading" lines={["From Evaluation", "to Perspective."]} className="display-md mt-5 text-ink sm:mt-6" />
            <p data-anim data-ap-copy className="mt-6 max-w-[28rem] text-[1.0625rem] leading-[1.6]">
              A considered investment process supports informed decisions through commercial
              understanding, due diligence, and strategic assessment.
            </p>
            <div data-anim data-ap-copy className="mt-8">
              <Button href="/contact?type=investment" variant="solid-dark" sweep>Discuss an Opportunity</Button>
            </div>
          </div>
        </div>

        <ol aria-label="Investment approach in five stages" className="relative">
          {APPROACH_STEPS.map((s, i) => {
            const last = i === APPROACH_STEPS.length - 1;
            return (
              <li
                key={s.title}
                data-ap-step
                className="group relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-5 pb-10 sm:gap-x-6 [&:last-child]:pb-0"
              >
                <span className="relative z-10 grid size-12 place-items-center rounded-full border border-obsidian bg-obsidian font-ui text-sm font-semibold text-pure transition-colors duration-500 group-data-[state=idle]:border-line group-data-[state=idle]:bg-pure group-data-[state=idle]:text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {!last && (
                  <span aria-hidden className="absolute bottom-0 left-6 top-12 w-px -translate-x-1/2 bg-line">
                    <span data-ap-fill className="absolute inset-0 origin-top bg-steel" />
                  </span>
                )}
                <div className="min-w-0 transition-opacity duration-500 group-data-[state=idle]:opacity-70">
                  <h3 className="flex min-h-12 items-center font-display text-[1.5rem] leading-[1.2] text-ink sm:text-[1.75rem]">{s.title}</h3>
                  <p className="max-w-[30rem] text-[1rem] leading-[1.55]">{s.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
