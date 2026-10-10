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
 * Board of Directors. The President is set as a featured, darker typographic panel;
 * the other four sit in a ruled 2x2 composition. The featured treatment is purely
 * visual and implies no authority beyond the supplied role. Text only, by design:
 * no photographs, portraits, initials or avatars.
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
    // 2. Featured panel opens upward, its accent line draws, then its text follows.
    const feat = el.querySelector("[data-tb-feature]");
    if (feat) {
      gsap.fromTo(feat, { clipPath: "inset(8% 0% 0% 0%)", autoAlpha: 1 }, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 0.75, ease: "power3.out", scrollTrigger: trigger });
      gsap.fromTo(feat.querySelector("[data-tb-accent]"), { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: "expo.out", delay: 0.12, scrollTrigger: trigger });
      fadeUp(feat.querySelectorAll("[data-tb-text]"), { trigger: grid, start: trigger.start, y: 12, delay: 0.18, stagger: 0.06, duration: 0.55 });
    }
    // 3-5. The four directors: restrained stagger, rules draw, email fades last.
    el.querySelectorAll<HTMLElement>("[data-tb-director]").forEach((d, i) => {
      const at = 0.22 + i * 0.07;
      d.querySelectorAll("[data-tb-rule]").forEach((r) =>
        gsap.fromTo(r, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "expo.out", delay: at, scrollTrigger: trigger }),
      );
      fadeUp(d.querySelectorAll("[data-tb-text]"), { trigger: grid, start: trigger.start, y: 10, delay: at + 0.05, stagger: 0.045, duration: 0.55 });
    });
  });

  return (
    <section id="board" ref={root} aria-labelledby="board-heading" className="relative scroll-mt-20 bg-pure py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx">
        <div className="grid items-end gap-y-5 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-tb-label>Board of Directors</SectionLabel>
            <MaskedLines id="board-heading" lines={["Corporate Leadership."]} className="display-md mt-5 text-ink sm:mt-6" />
          </div>
          <p data-anim data-tb-intro className="max-w-[34rem] text-[1.0625rem] leading-[1.6] lg:col-span-6 lg:max-w-none lg:border-l lg:border-line lg:pb-1 lg:pl-8">
            Meet the individuals serving in Nexea Holding AG&rsquo;s Board of Directors.
          </p>
        </div>

        <div data-tb-grid className="mt-9 grid gap-4 sm:mt-10 lg:mt-12 lg:grid-cols-12 lg:gap-5">
          {/* Featured: President */}
          <article
            data-anim
            data-member={president.id}
            data-tb-feature
            aria-labelledby={`m-${president.id}`}
            className="on-dark group relative isolate overflow-hidden bg-carbon p-7 text-pure sm:p-8 lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:p-9 xl:p-10"
          >
            {/* quiet geometry: concentric arcs, a soft silver sweep on hover */}
            <svg aria-hidden viewBox="0 0 400 400" fill="none" className="pointer-events-none absolute -bottom-24 -right-24 -z-10 size-[26rem] text-silver/[0.10] transition-transform duration-[1600ms] ease-out-expo group-hover:scale-[1.06]">
              {[60, 110, 160, 210].map((r) => (
                <circle key={r} cx="400" cy="400" r={r} stroke="currentColor" strokeWidth="1" />
              ))}
            </svg>
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-silver/[0.07] to-transparent transition-transform duration-[1400ms] ease-out-expo group-hover:translate-x-[220%]" />
            <span aria-hidden data-tb-accent className="absolute inset-y-8 left-0 w-px origin-top bg-silver/70 sm:inset-y-10" />

            <div>
              <p data-anim data-tb-text className="eyebrow flex items-center gap-3 text-[0.6875rem] text-silver">
                <span aria-hidden>{pad(president.order)}</span>
                <span aria-hidden className="h-px w-8 bg-silver/50" />
                Featured
                <span className="sr-only">Board member</span>
              </p>
              <h3 id={`m-${president.id}`} data-anim data-tb-text className="mt-5 font-display text-[1.875rem] leading-[1.12] sm:text-[2.25rem] lg:mt-8 lg:text-[2.375rem] xl:text-[2.5rem]">
                {president.name}
              </h3>
              <p data-anim data-tb-text className="mt-5 max-w-[24rem] border-t border-silver/25 pt-4 font-ui text-[1rem] font-semibold leading-[1.4] tracking-[0.01em] text-platinum">
                {president.role}
              </p>
            </div>
            <div data-anim data-tb-text className="mt-6 border-t border-silver/15 pt-1 lg:mt-8">
              <TeamEmail member={president} tone="dark" arrow />
            </div>
          </article>

          {/* The other four directors: a ruled 2x2 */}
          <div className="grid sm:grid-cols-2 lg:col-span-7">
            {directors.map((m, i) => (
              <article
                key={m.id}
                data-member={m.id}
                data-tb-director
                aria-labelledby={`m-${m.id}`}
                className={`group relative flex flex-col py-5 transition-colors duration-500 hover:bg-frost sm:py-6 lg:px-0 lg:py-6 ${
                  i % 2 === 0 ? "sm:pr-5 lg:pr-7" : "sm:pl-5 lg:pl-7"
                } ${i < 2 ? "" : ""}`}
              >
                <span aria-hidden data-tb-rule className="absolute inset-x-0 top-0 h-px origin-left bg-line transition-colors duration-500 group-hover:bg-obsidian" />
                {i % 2 === 1 && <span aria-hidden className="absolute inset-y-6 left-0 hidden w-px bg-line sm:block" />}
                <p data-anim data-tb-text aria-hidden className="font-ui text-xs font-semibold tracking-[0.16em] text-steel">
                  {pad(m.order)}
                </p>
                <h3 id={`m-${m.id}`} data-anim data-tb-text className="mt-2.5 font-display text-[1.5rem] leading-[1.18] text-ink xl:text-[1.625rem]">
                  {m.name}
                </h3>
                <p data-anim data-tb-text className="mt-1.5 text-[0.9375rem] leading-[1.45]">{m.role}</p>
                <div data-anim data-tb-text className="mt-auto pt-2">
                  <TeamEmail member={m} />
                </div>
              </article>
            ))}
            {/* closing rule under the 2x2 */}
            <span aria-hidden className="h-px bg-line sm:col-span-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
