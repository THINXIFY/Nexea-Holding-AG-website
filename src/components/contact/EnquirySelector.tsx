"use client";

import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { ENQUIRY_TYPES } from "@/data/contact";
import { useContact } from "@/components/contact/ContactProvider";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function EnquirySelector() {
  const root = useRef<HTMLElement>(null);
  const { type, setType, scrollToForm } = useContact();

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-es-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelector("[data-es-intro]"), { trigger: el, start, delay: 0.25 });
    fadeUp(el.querySelectorAll("[data-es-card]"), { trigger: el.querySelector("[data-es-grid]"), start: "top 90%", y: 22, stagger: 0.1, duration: 0.8 });
  });

  return (
    <section ref={root} aria-labelledby="es-heading" className="relative bg-frost py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx">
        <div className="grid items-end gap-y-5 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-es-label>Get in Touch</SectionLabel>
            <MaskedLines id="es-heading" lines={["How Can We Help You?"]} className="display-md mt-5 text-ink sm:mt-6" />
          </div>
          <p data-anim data-es-intro className="max-w-[34rem] text-[1.0625rem] leading-[1.6] lg:col-span-6 lg:max-w-none lg:border-l lg:border-line lg:pb-1 lg:pl-8">
            Choose the nature of your enquiry, and we&rsquo;ll help direct your message to the
            appropriate contact.
          </p>
        </div>

        <div role="group" aria-labelledby="es-heading" data-es-grid className="mt-9 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-10 lg:grid-cols-4">
          {ENQUIRY_TYPES.map((t) => {
            const selected = t.id === type;
            return (
              <button
                key={t.id}
                type="button"
                data-anim
                data-es-card
                data-enquiry={t.id}
                aria-pressed={selected}
                onClick={() => setType(t.id)}
                className={`group relative flex min-h-[11rem] flex-col border p-5 text-left transition-colors duration-500 sm:p-6 ${
                  selected ? "border-obsidian bg-obsidian text-pure" : "border-line bg-pure text-ink hover:border-steel"
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span aria-hidden className={`font-display text-[1.75rem] leading-none ${selected ? "text-silver" : "text-steel/60"}`}>{t.number}</span>
                  <span
                    aria-hidden
                    className={`grid size-9 shrink-0 place-items-center border transition-colors duration-500 ${
                      selected ? "border-platinum bg-platinum text-obsidian" : "border-line text-ink group-hover:border-obsidian"
                    }`}
                  >
                    <ArrowRight strokeWidth={1.4} className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" />
                  </span>
                </span>
                <span className="mt-5 block font-display text-[1.375rem] leading-[1.2]">{t.title}</span>
                <span className={`mt-2 block text-[0.9375rem] leading-[1.5] ${selected ? "text-platinum" : "text-muted"}`}>{t.description}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={scrollToForm}
            className="group inline-flex min-h-12 items-center gap-2.5 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:text-steel"
          >
            Continue to Form
            <ArrowDown aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
