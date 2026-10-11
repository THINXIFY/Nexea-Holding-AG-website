"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { BOARD } from "@/data/team";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TeamEmail } from "@/components/team/TeamEmail";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Board of Directors. The President is set as a wide, dark, cinematic band (name left, role summary right);
 * the four directors sit in a hairline-ruled grid beneath it with outlined numerals. The featured treatment is
 * purely visual and implies no authority beyond the supplied role. Text only, by design: no photographs,
 * portraits, initials or avatars.
 */
export function TeamBoard() {
  const root = useRef<HTMLElement>(null);
  const [president, ...directors] = BOARD;

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 88%";
    fadeUp(el.querySelector("[data-tb-label]"), { trigger: el, start, y: 10, duration: 0.6 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.05, stagger: 0.08, duration: 0.8 });
    fadeUp(el.querySelector("[data-tb-intro]"), { trigger: el, start, delay: 0.15, y: 12, duration: 0.6 });

    // The directory starts as soon as it peeks into view, so nothing waits on the scroll.
    const grid = el.querySelector("[data-tb-grid]");
    const trigger = { trigger: grid, start: "top 94%", once: true } as const;
    const feat = el.querySelector("[data-tb-feature]");
    if (feat) {
      gsap.fromTo(feat, { clipPath: "inset(8% 0% 0% 0%)", autoAlpha: 1 }, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 0.75, ease: "power3.out", scrollTrigger: trigger });
      gsap.fromTo(feat.querySelector("[data-tb-accent]"), { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: "expo.out", delay: 0.12, scrollTrigger: trigger });
      fadeUp(feat.querySelectorAll("[data-tb-text]"), { trigger: grid, start: trigger.start, y: 12, delay: 0.18, stagger: 0.06, duration: 0.55 });
    }
    el.querySelectorAll<HTMLElement>("[data-tb-director]").forEach((d, i) => {
      const at = 0.22 + i * 0.07;
      d.querySelectorAll("[data-tb-rule]").forEach((r) =>
        gsap.fromTo(r, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "expo.out", delay: at, scrollTrigger: trigger }),
      );
      fadeUp(d.querySelectorAll("[data-tb-text]"), { trigger: grid, start: trigger.start, y: 10, delay: at + 0.05, stagger: 0.045, duration: 0.55 });
    });
  });

  return (
    <section id="board" ref={root} aria-labelledby="board-heading" className="relative scroll-mt-20 bg-pure py-12 text-muted sm:py-14 lg:py-16">
      <div className="container-nx">
        <div className="grid items-end gap-y-4 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-tb-label>Board of Directors</SectionLabel>
            <MaskedLines id="board-heading" lines={["Corporate Leadership."]} className="display-md mt-4 text-ink sm:mt-5" />
          </div>
          <p data-anim data-tb-intro className="max-w-[34rem] text-[1.0625rem] leading-[1.45] lg:col-span-6 lg:max-w-none lg:border-l lg:border-line lg:pb-1 lg:pl-8">
            Meet the individuals serving in Nexea Holding AG&rsquo;s Board of Directors.
          </p>
        </div>

        <div data-tb-grid className="mt-8 sm:mt-9 lg:mt-10">
          {/* Featured: President */}
          <article
            data-anim
            data-member={president.id}
            data-tb-feature
            aria-labelledby={`m-${president.id}`}
            className="on-dark group relative isolate grid overflow-hidden bg-carbon text-pure lg:grid-cols-12"
          >
            <svg aria-hidden viewBox="0 0 400 400" fill="none" className="pointer-events-none absolute -bottom-32 -right-24 -z-10 size-[30rem] text-silver/[0.10] transition-transform duration-[1600ms] ease-out-expo group-hover:scale-[1.06]">
              {[60, 110, 160, 210, 260].map((r) => (
                <circle key={r} cx="400" cy="400" r={r} stroke="currentColor" strokeWidth="1" />
              ))}
            </svg>
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-silver/[0.07] to-transparent transition-transform duration-[1400ms] ease-out-expo group-hover:translate-x-[330%]" />
            <span aria-hidden data-tb-accent className="absolute inset-y-8 left-0 w-px origin-top bg-silver/70 sm:inset-y-10" />

            <div className="p-7 sm:p-9 lg:col-span-7 lg:p-12">
              <p data-anim data-tb-text className="eyebrow flex items-center gap-3 text-[0.6875rem] text-silver">
                <span aria-hidden>{pad(president.order)}</span>
                <span aria-hidden className="h-px w-8 bg-silver/50" />
                Featured
                <span className="sr-only">Board member</span>
              </p>
              <h3 id={`m-${president.id}`} data-anim data-tb-text className="mt-5 max-w-[44rem] font-display text-[2.125rem] leading-[1.05] sm:text-[2.5rem] lg:mt-7 lg:text-[2.75rem] xl:text-[3.25rem]">
                {president.name}
              </h3>
              <p data-anim data-tb-text className="mt-4 font-ui text-[0.9375rem] font-semibold leading-[1.3] tracking-[0.02em] text-platinum">
                {president.role}
              </p>
            </div>

            <div className="flex flex-col justify-between border-t border-silver/15 p-7 sm:p-9 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-12">
              <p data-anim data-tb-text className="max-w-[28rem] text-[1rem] leading-[1.5] text-platinum/85">
                {president.description}
              </p>
              <div data-anim data-tb-text className="mt-6 lg:mt-10">
                <TeamEmail member={president} tone="dark" arrow />
              </div>
            </div>
          </article>

          {/* The four directors: a hairline-ruled grid */}
          <div className="mt-px grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
            {directors.map((m) => (
              <article
                key={m.id}
                data-member={m.id}
                data-tb-director
                aria-labelledby={`m-${m.id}`}
                className="group relative flex flex-col bg-pure p-6 transition-colors duration-500 hover:bg-frost lg:p-7"
              >
                <span aria-hidden data-tb-rule className="absolute inset-x-0 top-0 h-[2px] origin-left bg-steel/0 bg-gradient-to-r from-obsidian to-obsidian/20" />
                <p data-anim data-tb-text aria-hidden className="font-display text-[3.25rem] leading-none text-transparent transition-[-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1px_#aebeca] group-hover:[-webkit-text-stroke-color:#526d80]">
                  {pad(m.order)}
                </p>
                <h3 id={`m-${m.id}`} data-anim data-tb-text className="mt-5 font-display text-[1.5rem] leading-[1.1] text-ink xl:text-[1.625rem]">
                  {m.name}
                </h3>
                <p data-anim data-tb-text className="mt-1.5 font-ui text-[0.8125rem] font-semibold uppercase leading-[1.3] tracking-[0.1em] text-steel">{m.role}</p>
                <p data-anim data-tb-text className="mt-3 text-[0.9375rem] leading-[1.5]">{m.description}</p>
                <div data-anim data-tb-text className="mt-auto pt-4">
                  <TeamEmail member={m} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
