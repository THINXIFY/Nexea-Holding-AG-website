"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealImage, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { SERVICE_AREAS, serviceHref } from "@/data/services";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Opens the service named by ?service=<slug> (from the header mega menu). Invalid values are ignored. */
function DeepLink({ onOpen }: { onOpen: (i: number) => void }) {
  const slug = useSearchParams().get("service");
  useEffect(() => {
    const i = SERVICE_AREAS.findIndex((s) => s.slug === slug);
    if (i >= 0) onOpen(i);
  }, [slug, onOpen]);
  return null;
}

export function SvAreas() {
  const root = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  // Keeps showing the last opened area while the panel animates closed.
  const [shown, setShown] = useState(0);
  const prevSelected = useRef<number | null>(null);

  const openFromLink = useCallback((i: number) => {
    setShown(i);
    setSelected(i);
  }, []);

  const area = SERVICE_AREAS[shown];
  const open = selected !== null;

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-sa-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelector("[data-sa-intro]"), { trigger: el, start, delay: 0.3 });
    el.querySelectorAll<HTMLElement>("[data-sa-panel]").forEach((panel, i) => {
      const delay = (i % 3) * 0.1;
      const frame = panel.querySelector<HTMLElement>("[data-sa-frame]");
      if (frame) revealImage(frame, panel.querySelector("[data-sa-img]"), { trigger: panel, start: "top 90%", duration: 1.1, delay });
      fadeUp(panel.querySelectorAll("[data-sa-text]"), { trigger: panel, start: "top 90%", delay: delay + 0.45, y: 12, duration: 0.7, stagger: 0.07 });
    });
  });

  /* Detail content swap + scroll into view + focus handling */
  useGSAP(
    () => {
      const prev = prevSelected.current;
      prevSelected.current = selected;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (selected !== null) {
        if (!reduce) {
          gsap.fromTo(
            "[data-sa-detail-item]",
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.07, delay: 0.1, overwrite: "auto" },
          );
        }
        const t = setTimeout(() => {
          detailRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
          headingRef.current?.focus({ preventScroll: true });
        }, 60);
        return () => clearTimeout(t);
      } else if (prev !== null) {
        buttons.current[prev]?.focus({ preventScroll: true });
      }
    },
    { scope: root, dependencies: [selected] },
  );

  // Escape closes the open detail panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const href = serviceHref(area.slug);

  return (
    <section id="services-list" ref={root} aria-labelledby="sa-heading" className="relative scroll-mt-20 bg-pure py-20 text-muted sm:py-24 lg:py-28">
      <Suspense fallback={null}>
        <DeepLink onOpen={openFromLink} />
      </Suspense>
      <div className="container-nx">
        <div className="grid items-end gap-y-5 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-sa-label>Our Services</SectionLabel>
            <MaskedLines id="sa-heading" lines={["Our Services & Expertise."]} className="display-md mt-5 text-ink sm:mt-6" />
          </div>
          <p data-anim data-sa-intro className="max-w-[34rem] text-[1.0625rem] leading-[1.6] lg:col-span-6 lg:max-w-none lg:border-l lg:border-line lg:pb-1 lg:pl-8">
            Explore Nexea&rsquo;s proposed investment-related and strategic advisory capabilities
            across corporate investment, business development, transactions, and emerging
            technologies.
          </p>
        </div>

        <ul className="mt-10 grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-y-5">
          {SERVICE_AREAS.map((s, i) => {
            const active = selected === i;
            return (
              <li
                key={s.slug}
                data-sa-panel
                className={`group relative flex flex-col border bg-pure transition-colors duration-500 ${active ? "border-obsidian bg-frost" : "border-line hover:border-steel"}`}
              >
                <div data-sa-frame className="relative aspect-[16/10] overflow-hidden bg-steel-deep">
                  <div data-sa-img className="absolute inset-0">
                    <Image
                      src={s.image.src}
                      alt={s.image.alt}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                      style={{ objectPosition: s.image.position }}
                      className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <div aria-hidden className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-obsidian/45 to-transparent" />
                  <p data-sa-text aria-hidden className="absolute left-5 top-4 font-ui text-sm font-semibold tracking-[0.14em] text-pure">
                    {s.number}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 data-sa-text className="font-display text-[1.375rem] leading-[1.25] text-ink">
                    {s.title}
                  </h3>
                  <p data-sa-text className="mt-2.5 text-[0.9375rem] leading-[1.55]">{s.summary}</p>
                  <div data-sa-text className="mt-auto pt-5">
                    <button
                      ref={(n) => {
                        buttons.current[i] = n;
                      }}
                      type="button"
                      aria-expanded={active}
                      aria-controls="sa-detail"
                      onClick={() => {
                        if (!active) setShown(i);
                        setSelected(active ? null : i);
                      }}
                      className="inline-flex min-h-11 items-center gap-2.5 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink after:absolute after:inset-0 after:content-['']"
                    >
                      {active ? "Hide details" : "View details"}
                      <span
                        aria-hidden
                        className={`grid size-7 place-items-center border transition-colors duration-500 ${
                          active ? "border-obsidian bg-obsidian text-pure" : "border-line group-hover:border-obsidian"
                        }`}
                      >
                        <Plus strokeWidth={1.5} className={`size-3.5 transition-transform duration-500 ease-out-expo ${active ? "rotate-45" : ""}`} />
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Inline detail panel */}
        <div
          id="sa-detail"
          ref={detailRef}
          role="region"
          aria-labelledby="sa-detail-heading"
          inert={!open}
          className={`scroll-mt-24 grid transition-[grid-template-rows,margin] duration-500 ease-out-expo ${open ? "mt-4 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            <div className="grid border border-line bg-frost lg:grid-cols-[2fr_3fr]">
              <div className="relative hidden min-h-[18rem] bg-steel-deep lg:block">
                <Image src={area.image.src} alt="" aria-hidden fill sizes="30vw" style={{ objectPosition: area.image.position }} className="object-cover" />
              </div>
              <div className="p-6 sm:p-9">
                <div className="flex items-start justify-between gap-6">
                  <p data-sa-detail-item className="eyebrow text-[0.6875rem] text-steel">
                    Proposed area of expertise · {area.number}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="-mr-2 -mt-2 inline-flex min-h-11 items-center gap-2 px-2 font-ui text-[0.8125rem] font-semibold text-ink transition-colors hover:text-steel"
                  >
                    Close <X aria-hidden strokeWidth={1.5} className="size-[1.125rem]" />
                  </button>
                </div>
                <h3 id="sa-detail-heading" ref={headingRef} tabIndex={-1} data-sa-detail-item className="mt-3 font-display text-[1.75rem] leading-[1.2] text-ink outline-none sm:text-[2rem]">
                  {area.title}
                </h3>
                <p data-sa-detail-item className="mt-4 max-w-[38rem] text-[1.0625rem] leading-[1.6]">{area.description}</p>
                <ul data-sa-detail-item aria-label={`${area.title} capabilities`} className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
                  {area.capabilities.map((c) => (
                    <li key={c} className="flex items-center gap-3 border-b border-line py-3.5 font-ui text-[0.9375rem] font-semibold text-ink">
                      <span aria-hidden className="h-px w-4 bg-steel" />
                      {c}
                    </li>
                  ))}
                </ul>
                <p data-sa-detail-item className="mt-6 max-w-[40rem] text-sm leading-[1.55] text-muted">
                  {area.note && <span className="mb-2 block font-semibold text-ink">{area.note}</span>}
                  A proposed area of expertise. It is not presented as an established, authorised, or
                  regulated service.
                </p>
                {href && (
                  <Link data-sa-detail-item href={href} className="mt-5 inline-flex min-h-11 items-center gap-2 font-ui text-sm font-semibold text-ink">
                    View full page <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
