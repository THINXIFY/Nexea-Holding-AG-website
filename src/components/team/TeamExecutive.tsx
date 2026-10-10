"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { EXECUTIVE } from "@/data/team";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TeamEmail } from "@/components/team/TeamEmail";

const pad = (n: number) => String(n).padStart(2, "0");

/** Executive Management as three full-width editorial rows: name | responsibility | contact. */
export function TeamExecutive() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-te-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelector("[data-te-intro]"), { trigger: el, start, delay: 0.3 });

    // Rows reveal one after another as the visitor scrolls: each row owns its trigger.
    el.querySelectorAll<HTMLElement>("[data-te-row]").forEach((row) => {
      const trigger = { trigger: row, start: "top 88%", once: true } as const;
      gsap.fromTo(row.querySelector("[data-te-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "expo.out", scrollTrigger: trigger });
      gsap.fromTo(row.querySelector("[data-te-name]"), { x: -16, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", delay: 0.15, scrollTrigger: trigger });
      fadeUp(row.querySelectorAll("[data-te-fade]"), { trigger: row, start: trigger.start, y: 10, delay: 0.3, stagger: 0.1, duration: 0.8 });
    });
    const last = el.querySelector("[data-te-end]");
    if (last) gsap.fromTo(last, { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: last, start: "top 94%", once: true } });
  });

  return (
    <section id="executive" ref={root} aria-labelledby="executive-heading" className="relative scroll-mt-20 bg-frost py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx">
        <div className="grid items-end gap-y-5 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-te-label>Executive Management</SectionLabel>
            <MaskedLines id="executive-heading" lines={["Management & Expertise."]} className="display-md mt-5 text-ink sm:mt-6" />
          </div>
          <p data-anim data-te-intro className="max-w-[34rem] text-[1.0625rem] leading-[1.6] lg:col-span-6 lg:max-w-none lg:border-l lg:border-line lg:pb-1 lg:pl-8">
            Leadership across the company&rsquo;s financial, marketing, and asset-management
            functions.
          </p>
        </div>

        <ul className="mt-9 sm:mt-10 lg:mt-12">
          {EXECUTIVE.map((m) => (
            <li
              key={m.id}
              data-member={m.id}
              data-te-row
              className="group relative grid gap-x-8 py-6 transition-colors duration-500 hover:bg-pure md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:py-7 lg:grid-cols-[minmax(0,5fr)_minmax(0,3.5fr)_minmax(0,3.5fr)] lg:items-center lg:px-4 lg:py-8"
            >
              <span aria-hidden data-te-rule className="absolute inset-x-0 top-0 h-px origin-left bg-silver/60 transition-colors duration-500 group-hover:bg-obsidian" />
              <div className="flex items-baseline gap-4 md:col-span-2 lg:col-span-1">
                <span data-anim data-te-fade aria-hidden className="w-6 shrink-0 font-ui text-xs font-semibold tracking-[0.16em] text-steel">{pad(m.order)}</span>
                <h3 data-anim data-te-name className="font-display text-[1.75rem] leading-[1.15] text-ink sm:text-[2rem]">{m.name}</h3>
              </div>
              <p data-anim data-te-fade className="mt-2 pl-[2.5rem] text-[0.9375rem] leading-[1.45] md:mt-3 md:pl-[2.5rem] lg:mt-0 lg:pl-0">
                <span className="font-ui font-semibold text-ink">{m.role}</span>
              </p>
              <div data-anim data-te-fade className="mt-1 pl-[2.5rem] md:mt-3 md:pl-[2.5rem] lg:mt-0 lg:pl-0 lg:justify-self-end">
                <TeamEmail member={m} arrow />
              </div>
            </li>
          ))}
        </ul>
        <span aria-hidden data-te-end className="block h-px origin-left bg-silver/60" />
      </div>
    </section>
  );
}
