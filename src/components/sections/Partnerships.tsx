"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Lightbulb, Users, type LucideIcon } from "lucide-react";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Pathway {
  title: string;
  description: string;
  icon: LucideIcon;
  /** The contact section is the existing workflow until dedicated pathway pages exist. */
  href: string;
}

const PATHWAYS: readonly Pathway[] = [
  {
    title: "For Business Owners",
    description:
      "Exploring potential investment participation, ownership transitions, and strategic relationships.",
    icon: Building2,
    href: "/contact?type=investment",
  },
  {
    title: "For Entrepreneurs & Innovators",
    description:
      "Considering innovative businesses, technologies, and emerging commercial opportunities.",
    icon: Lightbulb,
    href: "/contact?type=investment",
  },
  {
    title: "For Strategic Partners",
    description:
      "Exploring joint ventures, corporate partnerships, and shared investment opportunities.",
    icon: Users,
    href: "/contact?type=partnership",
  },
];

export function Partnerships() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const frame = el.querySelector<HTMLElement>("[data-partners-frame]");
    const img = el.querySelector<HTMLElement>("[data-partners-img]");
    const start = "top 78%";

    fadeUp(el.querySelector("[data-partners-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.13,
    });
    fadeUp(el.querySelector("[data-partners-intro]"), { trigger: el, start, delay: 0.3 });
    fadeUp(el.querySelectorAll("[data-pathway]"), {
      trigger: el.querySelector("[data-pathways]"),
      start: "top 88%",
      y: 20,
      stagger: 0.12,
    });
    fadeUp(el.querySelectorAll("[data-partners-cta]"), {
      trigger: el.querySelector("[data-partners-cta]"),
      start: "top 96%",
      y: 14,
      stagger: 0.1,
    });
    if (frame) revealImage(frame, null, { trigger: frame, start: "top 88%", duration: 1.5 });
    if (frame && img) parallax(img, { amount: desktop ? 7 : 4, trigger: frame });
  });

  return (
    <section
      id="partnerships"
      ref={root}
      aria-labelledby="partners-heading"
      className="relative bg-frost py-20 text-muted sm:py-24 lg:py-28"
    >
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-12 lg:grid-cols-12 lg:gap-x-14">
        <div className="lg:col-span-7">
          <SectionLabel data-anim data-partners-label>
            Partnerships &amp; Opportunities
          </SectionLabel>
          <MaskedLines
            id="partners-heading"
            lines={["Meaningful Opportunities", "Begin with the Right", "Connections."]}
            className="display-md mt-6 text-ink sm:mt-8"
          />
          <p
            data-anim
            data-partners-intro
            className="mt-6 max-w-[34rem] text-[1.0625rem] leading-[1.6] sm:mt-8 sm:text-[1.125rem]"
          >
            We welcome introductions to businesses, assets, and strategic opportunities that may
            align with Nexea&rsquo;s investment interests.
          </p>

          <ul data-pathways className="mt-10 border-t border-line sm:mt-12">
            {PATHWAYS.map(({ title, description, icon: Icon, href }) => (
              <li key={title} data-anim data-pathway className="border-b border-line">
                <Link
                  href={href}
                  className="group flex items-start gap-5 py-5 transition-colors duration-500 hover:bg-pure sm:gap-6 sm:py-6 sm:pl-3 sm:pr-3"
                >
                  <Icon
                    aria-hidden
                    strokeWidth={1.2}
                    className="mt-0.5 size-6 shrink-0 text-steel transition-colors group-hover:text-ink"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-ui text-[1.0625rem] font-semibold leading-snug text-ink">
                      {title}
                    </span>
                    <span className="mt-1.5 block max-w-[34rem] text-[0.9375rem] leading-[1.55]">
                      {description}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-9 shrink-0 place-items-center border border-line text-ink transition-colors duration-500 group-hover:border-obsidian group-hover:bg-obsidian group-hover:text-pure"
                  >
                    <ArrowRight
                      strokeWidth={1.4}
                      className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-4">
            <div data-anim data-partners-cta className="flex">
              <Button href="/contact?type=investment" variant="solid-dark" className="w-full sm:w-auto">
                Introduce an Opportunity
              </Button>
            </div>
            <div data-anim data-partners-cta className="flex">
              <Button href="/partnerships" variant="outline-dark" className="w-full sm:w-auto">
                Explore Partners
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div
            data-anim
            data-partners-frame
            className="relative aspect-[4/3] w-full overflow-hidden bg-steel-deep sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[34rem]"
          >
            <div
              data-partners-img
              className="absolute inset-x-0 -top-[7%] h-[114%] will-change-transform"
            >
              <Image
                src="/images/partners-architecture.jpg"
                alt="Glass-fronted office building with reflections of the surrounding architecture"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[45%_50%] saturate-[0.8]"
              />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-obsidian/30 via-transparent to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
