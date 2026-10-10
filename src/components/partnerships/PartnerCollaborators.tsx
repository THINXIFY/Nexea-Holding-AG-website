"use client";

import { useRef } from "react";
import Image from "next/image";
import { BarChart3, Briefcase, Lightbulb, Users } from "lucide-react";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

const GROUPS = [
  { icon: Briefcase, title: "Established Businesses", text: "Companies exploring strategic investment relationships, corporate development, or potential collaboration." },
  { icon: BarChart3, title: "Entrepreneurs & Growing Ventures", text: "Emerging businesses seeking to introduce commercially promising opportunities." },
  { icon: Users, title: "Investors & Corporate Groups", text: "Organizations interested in exploring shared investment interests and strategic relationships." },
  { icon: Lightbulb, title: "Technology & Industry Innovators", text: "Businesses developing solutions in established sectors and emerging technologies." },
] as const;

export function PartnerCollaborators() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-pc-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-pc-copy]"), { trigger: el, start, delay: 0.3, stagger: 0.12 });
    const frame = el.querySelector("[data-pc-frame]");
    const img = el.querySelector("[data-pc-img]");
    if (frame) revealImage(frame, img, { trigger: frame, start: "top 85%" });
    if (img && desktop) parallax(img, { amount: 5, trigger: frame });
    const list = el.querySelector("[data-pc-list]");
    el.querySelectorAll<HTMLElement>("[data-pc-row]").forEach((row, i) => {
      const st = { trigger: list, start: "top 88%", once: true } as const;
      gsap.fromTo(row.querySelector("[data-pc-line]"), { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, autoAlpha: 1, duration: 1, ease: "expo.out", delay: i * 0.1, scrollTrigger: st });
      fadeUp(row.querySelectorAll("[data-pc-body]"), { trigger: list, start: "top 88%", y: 14, delay: 0.1 + i * 0.1, stagger: 0.05, duration: 0.7 });
    });
  });

  return (
    <section ref={root} id="collaborators" aria-labelledby="pc-heading" className="relative border-t border-line bg-frost py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 md:grid-cols-2 md:gap-x-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,3.4fr)_minmax(0,4.6fr)] lg:gap-x-10 xl:gap-x-14">
        <div className="md:col-span-2 lg:col-span-1">
          <SectionLabel data-anim data-pc-label>Potential Collaborators</SectionLabel>
          <MaskedLines id="pc-heading" lines={["Working Across", "Business Ecosystems."]} className="display-lg mt-5 text-ink sm:mt-6" />
          <p data-anim data-pc-copy className="mt-5 max-w-[28rem] text-[1.0625rem] leading-[1.6]">
            Our proposed partnership interests extend across different stages of business development and commercial activity.
          </p>
          <div data-anim data-pc-copy className="mt-7 flex">
            <Button href="/contact?type=partnership#enquiry-form" variant="solid-dark" sweep className="w-full sm:w-auto">
              Introduce Your Organization
            </Button>
          </div>
        </div>

        <div
          data-anim
          data-pc-frame
          className="relative aspect-[4/5] w-full overflow-hidden bg-steel-deep md:aspect-auto md:min-h-[26rem] lg:min-h-[32rem]"
        >
          <div data-pc-img className="absolute inset-x-0 -top-[5%] h-[110%] will-change-transform">
            <Image
              src="/images/home-about.webp"
              alt="Glass corporate tower at dusk"
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
              className="object-cover object-[50%_40%] saturate-[0.85]"
            />
          </div>
        </div>

        <ul data-pc-list className="self-center border-b border-line">
          {GROUPS.map(({ icon: Icon, title, text }) => (
            <li key={title} data-pc-row className="relative flex gap-4 py-5 first:pt-6 last:pb-6 sm:gap-5">
              <span aria-hidden data-pc-line className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <span data-anim data-pc-body aria-hidden className="grid size-12 shrink-0 place-items-center border border-line bg-pure text-ink">
                <Icon strokeWidth={1.3} className="size-5" />
              </span>
              <div>
                <h3 data-anim data-pc-body className="font-ui text-[1rem] font-semibold leading-snug text-ink">{title}</h3>
                <p data-anim data-pc-body className="mt-1.5 text-[0.9375rem] leading-[1.55]">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
