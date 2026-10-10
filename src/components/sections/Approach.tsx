"use client";

import { useRef } from "react";
import Image from "next/image";
import { Compass, Layers, RefreshCw, Scale, ShieldCheck, type LucideIcon } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { fadeUp, parallax, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

const STEPS: readonly Step[] = [
  {
    title: "Discover Opportunities",
    description:
      "Identifying businesses, assets, and sectors aligned with our investment interests.",
    icon: Compass,
  },
  {
    title: "Evaluate Potential",
    description: "Assessing business fundamentals, market conditions, and growth potential.",
    icon: Scale,
  },
  {
    title: "Conduct Due Diligence",
    description: "Examining financial, commercial, legal, and operational considerations.",
    icon: ShieldCheck,
  },
  {
    title: "Structure & Decide",
    description: "Evaluating investment structures, terms, and strategic alignment.",
    icon: Layers,
  },
  {
    title: "Review & Adapt",
    description: "Monitoring developments and reassessing long-term opportunities.",
    icon: RefreshCw,
  },
];

// Circle states (hex mirrors the Tailwind tokens: obsidian / pure / light border / muted)
const ACTIVE = { backgroundColor: "#090d11", borderColor: "#090d11", color: "#ffffff" };
const IDLE = { backgroundColor: "#ffffff", borderColor: "#dce3e8", color: "#52616d" };

export function Approach() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const list = el.querySelector<HTMLElement>("[data-steps]");
    if (!list) return;
    const circles = Array.from(el.querySelectorAll<HTMLElement>("[data-step-circle]"));
    const fills = Array.from(el.querySelectorAll<HTMLElement>("[data-step-fill]"));
    const bodies = Array.from(el.querySelectorAll<HTMLElement>("[data-step-body]"));
    const prop = desktop ? "scaleX" : "scaleY";
    const start = "top 78%";

    fadeUp(el.querySelector("[data-approach-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.13,
    });
    fadeUp(el.querySelectorAll("[data-approach-intro]"), {
      trigger: el,
      start,
      delay: 0.3,
      stagger: 0.12,
    });

    gsap.set(circles, IDLE);
    gsap.set(fills, { [prop]: 0 });

    if (desktop) {
      // Plays once when the process comes into view: line draws left to right
      // while each stage switches on as the line reaches it.
      gsap.set(bodies, { autoAlpha: 0, y: 14 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: list, start: "top 80%", once: true },
        defaults: { ease: "power2.out" },
      });
      const gap = 0.6;
      circles.forEach((c, i) => {
        const at = i * gap;
        tl.to(c, { ...ACTIVE, duration: 0.4 }, at);
        tl.to(bodies[i], { autoAlpha: 1, y: 0, duration: 0.7 }, at + 0.1);
        if (fills[i]) tl.to(fills[i], { scaleX: 1, duration: gap, ease: "none" }, at + 0.3);
      });
    } else {
      // Vertical timeline: the line fills with scroll, stages light up as it passes them.
      gsap.set(bodies, { autoAlpha: 0, y: 12 });
      const n = STEPS.length;
      const seen = new Set<number>();
      ScrollTrigger.create({
        trigger: list,
        start: "top 70%",
        end: "bottom 70%",
        onUpdate: (self) => {
          const p = self.progress * (n - 1);
          fills.forEach((f, i) => {
            gsap.set(f, { scaleY: Math.min(1, Math.max(0, p - i)) });
          });
          circles.forEach((c, i) => {
            const on = p >= i - 0.02;
            if (on && !seen.has(i)) {
              seen.add(i);
              gsap.to(c, { ...ACTIVE, duration: 0.35 });
              gsap.to(bodies[i], { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" });
            } else if (!on && seen.has(i)) {
              seen.delete(i);
              gsap.to(c, { ...IDLE, duration: 0.3 });
            }
          });
        },
      });
      // Steps stay readable even if the trigger never fires (e.g. restored scroll position).
      ScrollTrigger.create({
        trigger: list,
        start: "bottom bottom",
        once: true,
        onEnter: () => gsap.to(bodies, { autoAlpha: 1, y: 0, duration: 0.5 }),
      });
    }

    fadeUp(el.querySelectorAll("[data-approach-foot]"), {
      trigger: el.querySelector("[data-approach-foot]"),
      start: "top 96%",
      y: 14,
      stagger: 0.1,
    });

    const img = el.querySelector("[data-approach-img]");
    if (desktop && img) parallax(img, { amount: 6, trigger: el });
  });

  return (
    <section
      id="approach"
      ref={root}
      aria-labelledby="approach-heading"
      className="relative isolate overflow-clip bg-frost py-20 text-muted sm:py-24 lg:py-28"
    >
      {/* Architectural backdrop (decorative, never behind the timeline) */}
      <div
        aria-hidden
        className="mask-fade-left-bottom pointer-events-none absolute right-0 top-0 -z-10 hidden h-[52%] w-[52%] lg:block"
      >
        <div data-approach-img className="absolute inset-x-0 -top-[8%] h-[116%]">
          <Image
            src="/images/approach-architecture.jpg"
            alt=""
            fill
            sizes="52vw"
            className="object-cover object-[50%_40%] opacity-90"
          />
        </div>
      </div>

      <div className="container-nx">
        <SectionLabel data-anim data-approach-label>
          Our Approach
        </SectionLabel>

        <MaskedLines
          id="approach-heading"
          lines={["From Opportunity to", "Informed Decisions."]}
          className="display-lg mt-6 max-w-[16ch] text-ink sm:mt-8 sm:max-w-none lg:max-w-[60%]"
        />
        <p
          data-anim
          data-approach-intro
          className="mt-6 max-w-[32rem] text-[1.0625rem] leading-[1.6] sm:mt-8 sm:text-[1.125rem]"
        >
          A structured investment approach built around careful evaluation, commercial insight,
          and long-term perspective.
        </p>

        <ol
          data-steps
          className="mt-14 sm:mt-16 lg:mt-20 lg:grid lg:grid-cols-5"
          aria-label="Investment approach in five stages"
        >
          {STEPS.map(({ title, description, icon: Icon }, i) => {
            const last = i === STEPS.length - 1;
            return (
              <li
                key={title}
                className={`relative flex gap-5 lg:block lg:pr-6 ${last ? "" : "pb-10 lg:pb-0"}`}
              >
                <span
                  data-step-circle
                  className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-obsidian bg-obsidian font-ui text-sm font-semibold text-pure"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {!last && (
                  <span
                    aria-hidden
                    className="absolute left-6 top-14 h-[calc(100%-3.5rem)] w-px -translate-x-1/2 bg-line lg:left-[3.75rem] lg:right-2 lg:top-6 lg:h-px lg:w-auto lg:translate-x-0"
                  >
                    <span
                      data-step-fill
                      className="absolute inset-0 origin-top bg-steel lg:origin-left"
                    />
                  </span>
                )}

                <div data-step-body className="min-w-0 pt-1.5 lg:mt-7 lg:pt-0">
                  <h3 className="flex items-start gap-2.5 font-ui text-[1.0625rem] font-semibold leading-snug text-ink">
                    <Icon aria-hidden strokeWidth={1.3} className="mt-0.5 size-[1.125rem] shrink-0 text-steel" />
                    {title}
                  </h3>
                  <p className="mt-2.5 max-w-[20rem] text-[0.9375rem] leading-[1.55] lg:max-w-none">
                    {description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex flex-col items-start gap-4 sm:mt-14 lg:mt-16">
          <div data-anim data-approach-foot>
            <Button href="/investments#approach" variant="solid-dark">Explore Our Investment Approach</Button>
          </div>
          <p data-anim data-approach-foot className="max-w-[36rem] text-sm leading-[1.55] text-muted">
            A proposed evaluation framework. It does not describe a guaranteed outcome or an
            established underwriting process.
          </p>
        </div>
      </div>
    </section>
  );
}
