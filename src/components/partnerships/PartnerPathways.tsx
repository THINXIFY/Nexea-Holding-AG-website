"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

const PATHWAYS = [
  { n: "01", title: "Investment Partnerships", text: "Explore potential corporate participations, investment structures, and business opportunities." },
  { n: "02", title: "Strategic Business Alliances", text: "Consider relationships built around complementary commercial objectives and long-term collaboration." },
  { n: "03", title: "International Business Development", text: "Explore cross-border commercial connections and opportunities across international markets." },
  { n: "04", title: "Innovation & Technology Partnerships", text: "Consider collaboration involving artificial intelligence, emerging technologies, digital infrastructure, and business innovation." },
] as const;

export function PartnerPathways() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-pw-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelector("[data-pw-intro]"), { trigger: el, start, delay: 0.3 });
    const list = el.querySelector("[data-pw-list]");
    el.querySelectorAll<HTMLElement>("[data-pw-item]").forEach((item, i) => {
      const st = { trigger: list, start: "top 85%", once: true } as const;
      const d = i * 0.12;
      gsap.fromTo(item.querySelector("[data-pw-top]"), { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, autoAlpha: 1, duration: 1.1, ease: "expo.out", delay: d, scrollTrigger: st });
      gsap.fromTo(item.querySelector("[data-pw-rule]"), { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, autoAlpha: 1, duration: 1.1, ease: "expo.out", delay: d + 0.15, scrollTrigger: st });
      fadeUp(item.querySelectorAll("[data-pw-body]"), { trigger: list, start: "top 85%", y: 18, delay: d + 0.1, stagger: 0.07, duration: 0.8 });
    });
  });

  return (
    <section ref={root} id="pathways" aria-labelledby="pw-heading" className="relative bg-pure py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-y-5 lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-pw-label>Collaboration Opportunities</SectionLabel>
            <MaskedLines id="pw-heading" lines={["Different Paths.", "Shared Potential."]} className="display-lg mt-5 text-ink sm:mt-6" />
          </div>
          <p data-anim data-pw-intro className="max-w-[26rem] text-[1.0625rem] leading-[1.6] lg:col-span-6 lg:pb-2 lg:pl-8">
            Discover the types of strategic relationships and business opportunities Nexea may consider.
          </p>
        </div>

        <ol data-pw-list className="mt-10 grid sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {PATHWAYS.map((p) => (
            <li
              key={p.n}
              data-pw-item
              className="relative sm:px-7 sm:odd:border-r sm:odd:border-line sm:odd:pl-0 sm:even:pr-0 lg:border-r lg:border-line lg:odd:pl-7 lg:even:pr-7 lg:first:pl-0! lg:last:border-r-0 lg:last:pr-0!"
            >
              <Link
                href="/contact?type=partnership#enquiry-form"
                aria-label={`Discuss ${p.title} with Nexea`}
                className="group relative flex h-full flex-col py-7 transition-colors duration-500 lg:py-8"
              >
                <span aria-hidden data-pw-top className="absolute inset-x-0 top-0 h-px origin-left bg-ink/80" />
                <span data-anim data-pw-body className="flex items-center gap-4">
                  <span aria-hidden className="font-display text-[2.75rem] leading-none text-silver transition-colors duration-500 group-hover:text-steel">{p.n}</span>
                  <span aria-hidden data-pw-rule className="h-px flex-1 origin-left bg-line" />
                </span>
                <h3 data-anim data-pw-body className="mt-5 font-display text-[1.5rem] leading-[1.15] text-ink text-balance sm:text-[1.625rem]">
                  {p.title}
                </h3>
                <p data-anim data-pw-body className="mt-3 mb-6 text-[0.9375rem] leading-[1.6]">{p.text}</p>
                <span
                  data-anim
                  data-pw-body
                  className="mt-auto grid size-10 place-items-center rounded-full border border-line text-ink transition-colors duration-500 group-hover:border-obsidian group-hover:bg-obsidian group-hover:text-pure"
                >
                  <ArrowRight aria-hidden strokeWidth={1.4} className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
