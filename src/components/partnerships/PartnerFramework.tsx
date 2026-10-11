"use client";

import { useRef } from "react";
import { Compass, FileSearch, Flag, Users } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

const STAGES = [
  { n: "01", icon: Users, title: "Connect", text: "Introduce the organization and the opportunity." },
  { n: "02", icon: FileSearch, title: "Understand", text: "Establish objectives, interests, and commercial context." },
  { n: "03", icon: Compass, title: "Explore", text: "Consider strategic fit and collaboration possibilities." },
  { n: "04", icon: Flag, title: "Define", text: "Discuss appropriate next steps where interests align." },
] as const;

/** Beat between stages (seconds). The connecting line takes STAGES.length * BEAT to draw. */
const BEAT = 0.5;

export function PartnerFramework() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    const list = el?.querySelector("[data-fw-list]");
    if (!el || !list) return;
    const start = "top 76%";
    fadeUp(el.querySelector("[data-fw-label]"), { trigger: el, start, y: 12 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.14, duration: 1.2 });
    fadeUp(el.querySelector("[data-fw-intro]"), { trigger: el, start, delay: 0.3 });

    const stages = el.querySelectorAll<HTMLElement>("[data-fw-stage]");
    const tl = gsap.timeline({ scrollTrigger: { trigger: list, start: "top 82%", once: true } });

    // Connecting line: horizontal on desktop, one segment per stage on small screens.
    if (desktop) {
      tl.fromTo(el.querySelector("[data-fw-line-h]"), { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, autoAlpha: 1, duration: (STAGES.length - 1) * BEAT + 0.4, ease: "power1.inOut" }, 0);
    } else {
      tl.fromTo(el.querySelectorAll("[data-fw-seg]"), { scaleY: 0, autoAlpha: 1 }, { scaleY: 1, autoAlpha: 1, duration: BEAT, ease: "power1.inOut", stagger: BEAT }, 0.1);
    }

    stages.forEach((s, i) => {
      const t = i * BEAT;
      const last = i === stages.length - 1;
      const fill = s.querySelector("[data-fw-fill]");
      const num = s.querySelector("[data-fw-num]");
      tl.fromTo(s.querySelector("[data-fw-ring]"), { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, t);
      tl.fromTo(s.querySelectorAll("[data-fw-body]"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 }, t + 0.1);
      // Active-stage highlight travels with the line and rests on the final stage.
      tl.to(fill, { scale: 1, duration: 0.4, ease: "power2.out" }, t + 0.15);
      tl.to(num, { color: "#090d11", duration: 0.3 }, t + 0.15);
      if (!last) {
        tl.to(fill, { scale: 0, duration: 0.4, ease: "power2.inOut" }, t + 0.15 + BEAT);
        tl.to(num, { color: "#ffffff", duration: 0.3 }, t + 0.15 + BEAT);
      }
    });
  });

  return (
    <section ref={root} id="framework" aria-labelledby="fw-heading" className="on-dark relative isolate overflow-hidden bg-obsidian py-16 text-pure sm:py-20 lg:py-24">
      <div className="container-nx">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-7">
            <SectionLabel tone="light" data-anim data-fw-label>Our Collaboration Framework</SectionLabel>
            <MaskedLines id="fw-heading" lines={["From Introduction", "to Shared Understanding."]} className="display-lg mt-5 sm:mt-6" />
          </div>
          <p data-anim data-fw-intro className="max-w-[28rem] text-[1.0625rem] leading-[1.6] text-platinum lg:col-span-5 lg:pb-2">
            A framework for building business relationships through careful assessment and meaningful communication.
          </p>
        </div>

        <ol data-fw-list className="relative mt-12 sm:mt-14 lg:mt-16 lg:grid lg:grid-cols-4 lg:gap-x-8">
          <span
            aria-hidden
            data-anim
            data-fw-line-h
            className="absolute left-7 top-7 hidden h-px origin-left bg-silver/40 lg:right-[calc(25%-3.25rem)] lg:block"
          />
          {STAGES.map(({ n, icon: Icon, title, text }, i) => (
            <li key={n} data-fw-stage className="group relative pb-10 pl-[5rem] last:pb-0 lg:pb-0 lg:pl-0">
              {i < STAGES.length - 1 && (
                <span aria-hidden data-anim data-fw-seg className="absolute left-7 top-7 h-full w-px origin-top bg-silver/40 lg:hidden" />
              )}
              <span
                data-anim
                data-fw-ring
                className="absolute left-0 top-0 z-10 grid size-14 place-items-center rounded-full border border-silver/50 bg-obsidian transition-colors duration-500 group-hover:border-pure lg:relative"
              >
                <span aria-hidden data-fw-fill className="absolute inset-[3px] scale-0 rounded-full bg-platinum" />
                <span data-fw-num className="relative font-ui text-[0.8125rem] font-semibold tracking-[0.1em] text-pure">{n}</span>
              </span>
              <div className="lg:mt-7">
                <h3 data-anim data-fw-body className="flex items-center gap-3 font-display text-[1.75rem] leading-none text-pure">
                  <Icon aria-hidden strokeWidth={1.3} className="size-5 text-silver" />
                  {title}
                </h3>
                <p data-anim data-fw-body className="mt-3 max-w-[16rem] text-[0.9375rem] leading-[1.55] text-platinum">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
