"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { AUDIENCES } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function SvAudiences() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 78%";
    fadeUp(el.querySelector("[data-sw-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-sw-copy]"), { trigger: el, start: "top 70%", delay: 0.3, stagger: 0.12 });

    const list = el.querySelector("[data-sw-list]");
    el.querySelectorAll<HTMLElement>("[data-sw-row]").forEach((row, i) => {
      const line = row.querySelector("[data-sw-line]");
      if (line) {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1, duration: 1.2, ease: "expo.out", delay: i * 0.15,
          scrollTrigger: { trigger: list, start: "top 88%", once: true },
        });
      }
      fadeUp(row.querySelectorAll("[data-sw-body]"), { trigger: list, start: "top 88%", y: 18, delay: 0.1 + i * 0.15, stagger: 0.07 });
    });
  });

  return (
    <section ref={root} aria-labelledby="sw-heading" className="relative bg-pure py-20 text-muted sm:py-24 lg:py-28">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:gap-x-14">
        <div className="lg:col-span-5">
          <SectionLabel data-anim data-sw-label>Potential Engagements</SectionLabel>
          <MaskedLines
            id="sw-heading"
            lines={["Different Ambitions.", "Shared Perspective."]}
            className="display-md mt-6 text-ink sm:mt-8"
          />
          <p data-anim data-sw-copy className="mt-7 max-w-[30rem] text-[1.0625rem] leading-[1.6]">
            Our consulting and partnership pathways are designed around the distinct
            priorities of businesses, investors, and strategic collaborators.
          </p>
          <div data-anim data-sw-copy className="mt-8">
            <Button href="/partnerships" variant="solid-dark" sweep>Explore Partnerships</Button>
          </div>
        </div>

        <ol data-sw-list className="lg:col-span-7">
          {AUDIENCES.map((a, i) => (
            <li key={a.title} data-sw-row className="relative">
              <span aria-hidden data-sw-line className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <Link
                href="/partnerships"
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-x-4 py-7 transition-colors duration-500 hover:bg-frost sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-9 sm:pl-2 sm:pr-3"
              >
                <span data-anim data-sw-body aria-hidden className="font-display text-[2rem] leading-none text-steel/50 transition-colors duration-500 group-hover:text-ink sm:text-[2.5rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block min-w-0">
                  <span data-anim data-sw-body className="block font-display text-[1.5rem] leading-[1.15] text-ink sm:text-[1.875rem]">{a.title}</span>
                  <span data-anim data-sw-body className="mt-2.5 block max-w-[32rem] text-[1rem] leading-[1.55]">{a.description}</span>
                </span>
                <span aria-hidden data-anim data-sw-body className="mt-1 grid size-10 place-items-center border border-line text-ink transition-colors duration-500 group-hover:border-obsidian group-hover:bg-obsidian group-hover:text-pure">
                  <ArrowRight strokeWidth={1.4} className="size-[1.125rem] transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
          <li aria-hidden className="h-px bg-line" />
        </ol>
      </div>
    </section>
  );
}
