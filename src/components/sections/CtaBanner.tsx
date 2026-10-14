"use client";

import { useRef } from "react";
import Image from "@/components/ui/DeferredImage";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export interface CtaAction {
  label: string;
  /** Leave undefined while no destination exists: the button then renders as an inert, labelled control. */
  href?: string;
}

export interface CtaBannerProps {
  /** Section id (anchor target). */
  id?: string;
  headingId: string;
  eyebrow: string;
  headline: readonly string[];
  lead: string;
  body?: string;
  primary: CtaAction;
  secondary: CtaAction;
  microtext: readonly string[];
  image: { src: string; position: string; filter?: string };
  /** Column ratio of the two-column composition (headline | copy). */
  cols?: "5-7" | "6-6";
  /** Small decorative linework that distinguishes one CTA from another. */
  accent?: "none" | "rule" | "ticks" | "corner";
}

/**
 * The shared closing-CTA family. Structure, spacing, type, button size and
 * motion are identical everywhere; the photograph, crop, headline lines,
 * layout and accent are what make each page's CTA its own.
 */
export function CtaBanner({
  id,
  headingId,
  eyebrow,
  headline,
  lead,
  body,
  primary,
  secondary,
  microtext,
  image,
  cols = "5-7",
  accent = "none",
}: CtaBannerProps) {
  const root = useRef<HTMLElement>(null);
  const left = cols === "5-7" ? "lg:col-span-5" : "lg:col-span-6";
  const right = cols === "5-7" ? "lg:col-span-7 lg:pl-8 xl:pl-16" : "lg:col-span-6 lg:pl-6 xl:pl-10";

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 76%";
    fadeUp(el.querySelector("[data-cta-label]"), { trigger: el, start, y: 12 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.14, duration: 1.3 });
    fadeUp(el.querySelectorAll("[data-cta-copy]"), { trigger: el, start: "top 68%", delay: 0.3, stagger: 0.14 });
    const rule = el.querySelector("[data-cta-rule]");
    if (rule) {
      gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.out", delay: 0.5, scrollTrigger: { trigger: el, start: "top 66%", once: true } });
    }
    el.querySelectorAll("[data-cta-accent]").forEach((a, i) => {
      gsap.fromTo(a, { opacity: 0 }, { opacity: 1, duration: 1.4, delay: 0.6 + i * 0.12, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 66%", once: true } });
    });
    if (desktop) {
      gsap.fromTo(el.querySelector("[data-cta-bg]"), { yPercent: -4 }, {
        yPercent: 4,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }
  });

  const copy = (
    <>
      <p className="max-w-[28rem] text-[1.0625rem] font-medium leading-[1.5] text-pure sm:text-lg">{lead}</p>
      {body && <p className="mt-3 max-w-[28rem] text-[1rem] leading-[1.55] text-platinum">{body}</p>}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href={primary.href} variant="solid-light" sweep>{primary.label}</Button>
        <Button href={secondary.href} variant="outline-light" sweep>{secondary.label}</Button>
      </div>
    </>
  );

  return (
    <section
      id={id}
      ref={root}
      aria-labelledby={headingId}
      className="on-dark relative isolate overflow-clip bg-obsidian py-16 text-pure sm:py-20 lg:py-24"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div data-cta-bg className="absolute inset-x-0 -top-[5%] h-[110%] will-change-transform">
          <Image
            src={image.src}
            alt=""
            fill
            sizes="100vw"
            style={{ objectPosition: image.position }}
            className={`object-cover ${image.filter ?? "[filter:saturate(0.6)_brightness(1.2)]"}`}
          />
        </div>
        <div className="absolute inset-0 bg-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/25 max-md:from-obsidian/85 max-md:via-obsidian/80 max-md:to-obsidian/65" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-obsidian to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-obsidian to-transparent" />
      </div>

      {/* accents: fine silver linework, never over the copy */}
      {accent === "ticks" && (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 -z-[5] hidden w-[9%] lg:block">
          {[0, 1, 2].map((i) => (
            <span key={i} data-cta-accent className="absolute inset-y-8 w-px bg-silver/20" style={{ left: `${20 + i * 30}%` }} />
          ))}
        </div>
      )}
      {accent === "corner" && (
        <div aria-hidden className="pointer-events-none absolute right-5 top-24 -z-[5] hidden size-24 sm:right-8 lg:block xl:right-12">
          <span data-cta-accent className="absolute right-0 top-0 h-px w-full bg-silver/35" />
          <span data-cta-accent className="absolute right-0 top-0 h-full w-px bg-silver/35" />
        </div>
      )}

      <div className="container-nx">
        <div className="grid gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className={left}>
            <SectionLabel tone="light" data-anim data-cta-label>{eyebrow}</SectionLabel>
            <MaskedLines id={headingId} lines={headline} className="display-lg mt-5 sm:mt-6" />
          </div>
          <div
            data-anim
            data-cta-copy
            className={`${right} ${accent === "rule" ? "lg:border-l lg:border-white/20" : ""}`}
          >
            {copy}
          </div>
        </div>

        <div data-anim data-cta-copy className="relative mt-10 pt-5 sm:mt-12">
          <span aria-hidden data-cta-rule className="absolute inset-x-0 top-0 h-px origin-left bg-white/15" />
          <p className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.6875rem] text-silver sm:text-xs">
            {microtext.map((t, i) => (
              <span key={t} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden className="text-steel">·</span>}
                {t}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
