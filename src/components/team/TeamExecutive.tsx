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

/** Executive Management as a three-column hairline-ruled grid: numeral, name, role, responsibility, contact. */
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
  });

  return (
    <section id="executive" ref={root} aria-labelledby="executive-heading" className="relative scroll-mt-20 bg-frost py-12 text-muted sm:py-14 lg:py-16">
      <div className="container-nx">
        <div className="grid items-end gap-y-4 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-te-label>Executive Management</SectionLabel>
            <MaskedLines id="executive-heading" lines={["Management & Expertise."]} className="display-md mt-4 text-ink sm:mt-5" />
          </div>
          <p data-anim data-te-intro className="max-w-[34rem] text-[1.0625rem] leading-[1.45] lg:col-span-6 lg:max-w-none lg:border-l lg:border-line lg:pb-1 lg:pl-8">
            Leadership across the company&rsquo;s financial, marketing, and asset-management
            functions.
          </p>
        </div>

        <ul className="mt-8 grid gap-px border border-line bg-line sm:mt-9 md:grid-cols-3 lg:mt-10">
          {EXECUTIVE.map((m) => (
            <li
              key={m.id}
              data-member={m.id}
              data-te-row
              className="group relative flex flex-col bg-frost p-6 transition-colors duration-500 hover:bg-pure lg:p-8"
            >
              <span aria-hidden data-te-rule className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-obsidian to-obsidian/20" />
              <span data-anim data-te-fade aria-hidden className="font-display text-[3.25rem] leading-none text-transparent transition-[-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1px_#aebeca] group-hover:[-webkit-text-stroke-color:#526d80]">{pad(m.order)}</span>
              <h3 data-anim data-te-name className="mt-5 font-display text-[1.75rem] leading-[1.08] text-ink sm:text-[1.875rem]">{m.name}</h3>
              <p data-anim data-te-fade className="mt-1.5 font-ui text-[0.8125rem] font-semibold uppercase leading-[1.3] tracking-[0.1em] text-steel">{m.role}</p>
              <p data-anim data-te-fade className="mt-3 text-[0.9375rem] leading-[1.5]">{m.description}</p>
              <div data-anim data-te-fade className="mt-auto pt-4">
                <TeamEmail member={m} arrow />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
