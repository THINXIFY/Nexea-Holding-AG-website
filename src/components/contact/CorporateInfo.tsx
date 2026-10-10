"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { ADDRESS_LINES, COMPANY } from "@/data/company";
import { CopyAddressButton } from "@/components/contact/CopyAddressButton";
import { Button } from "@/components/ui/Button";
import { RequestDocumentsButton } from "@/components/documents/RequestDocumentsButton";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Detail {
  label: string;
  value: React.ReactNode;
  wide?: boolean;
}

export function CorporateInfo() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-ci-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-ci-copy]"), { trigger: el, start, delay: 0.25, stagger: 0.12 });
    const list = el.querySelector("[data-ci-list]");
    el.querySelectorAll<HTMLElement>("[data-ci-item]").forEach((item, i) => {
      const line = item.querySelector("[data-ci-line]");
      if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out", delay: (i % 2) * 0.08 + Math.floor(i / 2) * 0.1, scrollTrigger: { trigger: list, start: "top 88%", once: true } });
      fadeUp(item.querySelectorAll("[data-ci-body]"), { trigger: list, start: "top 88%", y: 14, delay: 0.1 + (i % 2) * 0.08 + Math.floor(i / 2) * 0.1, stagger: 0.05, duration: 0.7 });
    });
  });

  const details: Detail[] = [
    { label: "Registered Company", value: COMPANY.name },
    { label: "Legal Form", value: COMPANY.legalForm },
    { label: "Commercial Register Number", value: COMPANY.commercialRegisterNumber },
    { label: "Company UID", value: COMPANY.uid },
    {
      label: "Registered Address",
      value: (
        <address className="not-italic">
          {ADDRESS_LINES.map((l) => (
            <span key={l} className="block">{l}</span>
          ))}
        </address>
      ),
    },
    { label: "Commercial Register Office", value: COMPANY.commercialRegisterOffice },
    {
      label: "Company Email",
      value: (
        <a href={`mailto:${COMPANY.email}`} className="[overflow-wrap:anywhere] underline decoration-silver underline-offset-4 transition-colors hover:text-steel">
          {COMPANY.email}
        </a>
      ),
    },
  ];

  return (
    <section ref={root} aria-labelledby="ci-heading" className="relative bg-frost py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:gap-x-14">
        <div className="lg:col-span-5">
          <SectionLabel data-anim data-ci-label>Corporate Information</SectionLabel>
          <MaskedLines id="ci-heading" lines={["Our Swiss", "Corporate Office."]} className="display-md mt-5 text-ink sm:mt-6" />
          <p data-anim data-ci-copy className="mt-5 max-w-[28rem] text-[1.0625rem] leading-[1.6]">
            Nexea Holding AG is a Swiss-registered investment holding company headquartered in
            Hergiswil, in the canton of Nidwalden.
          </p>
          <div data-anim data-ci-copy className="mt-7 flex flex-wrap items-center gap-3">
            <CopyAddressButton />
            <Button href="/impressum" variant="outline-dark" size="sm" sweep className="min-h-12!">
              View Impressum
            </Button>
            <RequestDocumentsButton variant="solid-dark" />
          </div>
        </div>

        <dl data-ci-list className="grid sm:grid-cols-2 sm:gap-x-10 lg:col-span-7">
          {details.map((d) => (
            <div key={d.label} data-ci-item className="relative py-5 sm:py-6">
              <span aria-hidden data-ci-line className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <dt data-anim data-ci-body className="eyebrow text-[0.625rem] text-steel">{d.label}</dt>
              <dd data-anim data-ci-body className="mt-2 font-ui text-[1rem] font-semibold leading-[1.45] text-ink">{d.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
