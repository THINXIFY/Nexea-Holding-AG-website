"use client";

import { useRef } from "react";
import Image from "next/image";
import { CalendarDays, Globe2, MapPin, type LucideIcon } from "lucide-react";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Fact {
  value: string;
  label: string;
  icon: LucideIcon;
}

const FACTS: readonly Fact[] = [
  { value: "2004", label: "Incorporated", icon: CalendarDays },
  { value: "Switzerland", label: "Headquarters", icon: MapPin },
  { value: "International", label: "Investment Mandate", icon: Globe2 },
];

export function About() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const frame = el.querySelector<HTMLElement>("[data-about-frame]");
    const img = el.querySelector<HTMLElement>("[data-about-img]");
    const start = "top 78%";

    if (frame) revealImage(frame, null, { trigger: frame, start: "top 90%", duration: 1.5 });
    if (frame && img) {
      // The image drifts inside its frame; always on, but lighter on small screens.
      parallax(img, { amount: desktop ? 7 : 4, trigger: frame });
    }

    fadeUp(el.querySelector("[data-about-label]"), { trigger: el, start, y: 14, delay: 0.1 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.2,
      stagger: 0.13,
    });
    fadeUp(el.querySelectorAll("[data-about-copy]"), {
      trigger: el.querySelector("[data-about-body]"),
      start: "top 88%",
      stagger: 0.14,
    });
    fadeUp(el.querySelectorAll("[data-about-fact]"), {
      trigger: el.querySelector("[data-about-facts]"),
      start: "top 92%",
      stagger: 0.12,
      y: 18,
    });
    fadeUp(el.querySelector("[data-about-cta]"), {
      trigger: el.querySelector("[data-about-cta]"),
      start: "top 96%",
      y: 14,
    });
  });

  return (
    <section
      id="about"
      ref={root}
      aria-labelledby="about-heading"
      className="relative bg-frost text-muted"
    >
      <div className="grid lg:grid-cols-[43fr_57fr]">
        {/* LEFT — full-bleed architecture */}
        <div
          data-anim
          data-about-frame
          className="relative aspect-[4/3] w-full overflow-hidden bg-steel-deep sm:aspect-[16/10] lg:aspect-auto lg:min-h-[40rem]"
        >
          <div
            data-about-img
            className="absolute inset-x-0 -top-[7%] h-[114%] will-change-transform"
          >
            <Image
              src="/images/home-about-img.png"
              alt="Upward view of modern glass office towers against a pale, overcast sky"
              fill
              sizes="(min-width: 1024px) 43vw, 100vw"
              className="object-cover object-[50%_55%] sm:object-[50%_50%] lg:object-[85%_45%]"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/45 via-transparent to-transparent"
          />
          <p
            aria-hidden
            className="on-dark eyebrow absolute bottom-6 left-5 flex items-center gap-4 border-l border-platinum/70 py-1 pl-4 text-[0.6875rem] leading-[1.55] text-pure sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-10"
          >
            <span>
              Swiss Heritage
              <br />
              Global Perspective
            </span>
          </p>
        </div>

        {/* RIGHT — editorial copy */}
        <div className="px-5 py-16 sm:px-8 sm:py-20 lg:flex lg:flex-col lg:justify-center lg:px-14 lg:py-24 xl:px-20 2xl:px-28">
          <div className="max-w-[44rem]">
            <SectionLabel data-anim data-about-label>
              About Nexea
            </SectionLabel>

            <MaskedLines
              id="about-heading"
              lines={["Independent", "Thinking for", "a Global Tomorrow."]}
              className="display-lg mt-6 text-ink sm:mt-8"
            />

            <div
              data-about-body
              className="mt-8 grid max-w-[36rem] gap-6 text-[1.0625rem] leading-[1.6] 2xl:max-w-none sm:mt-10 2xl:grid-cols-2 2xl:gap-10"
            >
              <p data-anim data-about-copy>
                Established in 2004 and headquartered in Hergiswil, Switzerland, Nexea Holding AG
                is a privately held investment company focused on corporate participations across
                domestic and international markets.
              </p>
              <p data-anim data-about-copy>
                With a long-term perspective, Nexea explores opportunities across established
                businesses, real assets, and evolving industries.
              </p>
            </div>

            <ul
              data-about-facts
              aria-label="Corporate facts"
              className="mt-10 grid border-t border-line sm:mt-12 sm:grid-cols-3 sm:border-t-0"
            >
              {FACTS.map(({ value, label, icon: Icon }) => (
                <li
                  key={label}
                  data-anim
                  data-about-fact
                  className="flex items-center gap-4 border-b border-line py-5 sm:flex-col sm:items-start sm:gap-3 sm:border-b-0 sm:border-l sm:px-5 sm:first:border-l-0 sm:first:pl-0 sm:last:pr-0 xl:flex-row xl:items-center xl:gap-4 xl:px-6"
                >
                  <Icon aria-hidden strokeWidth={1.15} className="size-7 shrink-0 text-steel" />
                  <div>
                    <p className="font-display text-[1.625rem] leading-none text-ink">{value}</p>
                    <p className="mt-1.5 font-ui text-[0.8125rem] leading-snug text-muted">
                      {label}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div
              data-anim
              data-about-cta
              className="mt-10 flex items-center gap-8 sm:mt-12"
            >
              <Button href="/about" variant="solid-dark">
                More About Nexea
              </Button>
              <span aria-hidden className="hidden h-px flex-1 bg-line sm:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
