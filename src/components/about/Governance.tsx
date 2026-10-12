"use client";

import { useRef } from "react";
import Image from "next/image";
import { fadeUp, parallax, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RequestDocumentsButton } from "@/components/documents/RequestDocumentsButton";

/** Descriptive only: no committees, policies, certifications or compliance claims. */
const THEMES = [
  {
    title: "Swiss Corporate Framework",
    description: "Operating within the corporate framework of Swiss law.",
  },
  {
    title: "Registered Governance",
    description: "Registered governance structure recorded in the commercial register.",
  },
  {
    title: "Corporate Oversight",
    description: "A structure that supports accountability for the company’s investment interests.",
  },
] as const;

export function Governance() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    const frame = el.querySelector<HTMLElement>("[data-gov-frame]");
    const img = el.querySelector<HTMLElement>("[data-gov-img]");
    const start = "top 78%";

    fadeUp(el.querySelector("[data-gov-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.13,
    });
    fadeUp(el.querySelectorAll("[data-gov-copy]"), {
      trigger: el.querySelector("[data-gov-body]"),
      start: "top 88%",
      stagger: 0.14,
    });
    if (frame) revealImage(frame, img, { trigger: frame, start: "top 88%", duration: 1.4 });
    if (desktop && frame && img) parallax(img, { amount: 6, trigger: frame });
    fadeUp(el.querySelectorAll("[data-gov-row]"), {
      trigger: el.querySelector("[data-gov-rows]"),
      start: "top 88%",
      stagger: 0.15,
      y: 18,
    });
  });

  return (
    <section
      ref={root}
      aria-labelledby="gov-heading"
      className="relative bg-pure py-20 text-muted sm:py-24 lg:py-28"
    >
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-12 lg:grid-cols-12 lg:items-start lg:gap-x-10 xl:gap-x-12">
        <div className="lg:col-span-5">
          <SectionLabel data-anim data-gov-label>
            Corporate Governance
          </SectionLabel>
          <MaskedLines
            id="gov-heading"
            lines={["A Foundation of", "Corporate Responsibility."]}
            className="display-md mt-6 text-ink sm:mt-8"
          />
          <div data-gov-body className="mt-7 max-w-[34rem] space-y-5 text-[1.0625rem] leading-[1.6]">
            <p data-anim data-gov-copy>
              Nexea Holding AG operates under the Swiss corporate framework, with its registered
              governance structure recorded in the commercial register.
            </p>
            <p data-anim data-gov-copy>
              Our corporate structure provides the foundation for oversight, accountability, and the
              management of the company&rsquo;s investment interests.
            </p>
          </div>
          <div
            data-anim
            data-gov-copy
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <Button href="/team" variant="solid-dark" size="sm" sweep className="w-full sm:w-auto">
              Meet Our Team
            </Button>
            {/* Registered address and UID live in the shared footer. */}
            <Button href="#corporate-information" variant="outline-dark" size="sm" sweep className="w-full sm:w-auto">
              Corporate Information
            </Button>
            <RequestDocumentsButton variant="outline-dark" className="w-full sm:w-auto" />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div
            data-anim
            data-gov-frame
            className="relative aspect-[4/3] overflow-hidden bg-steel-deep sm:aspect-[16/9] lg:aspect-[4/5]"
          >
            <div data-gov-img className="absolute inset-x-0 -top-[7%] h-[114%]">
              <Image
                src="/images/ab-governance.jpg"
                alt="A modern office interior with tables and chairs beside panoramic windows overlooking a city skyline"
                fill
                sizes="(min-width: 1024px) 32vw, 100vw"
                className="object-cover object-[40%_55%] [filter:saturate(0.75)]"
              />
            </div>
          </div>
        </div>

        <ul data-gov-rows aria-label="Governance themes" className="border-t border-line lg:col-span-3">
          {THEMES.map((t) => (
            <li key={t.title} data-anim data-gov-row className="flex gap-4 border-b border-line py-6">
              <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-steel" />
              <div>
                <h3 className="font-ui text-[1.0625rem] font-semibold leading-snug text-ink">{t.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-[1.55]">{t.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
