"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import {
  INVESTMENT_SECTORS,
  SECTOR_GROUPS,
  countByGroup,
  sectorHref,
  type SectorGroupId,
} from "@/data/investment-sectors";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

type Filter = SectorGroupId | "all";

const FILTERS: readonly { id: Filter; label: string }[] = [
  { id: "all", label: "All Sectors" },
  ...SECTOR_GROUPS.map((g) => ({ id: g.id as Filter, label: g.filterLabel })),
];

/** Applies ?category=<group> or ?sector=<slug> (from the header mega menu). Invalid values are ignored. */
function DeepLink({ onApply }: { onApply: (filter: Filter, slug: string | null) => void }) {
  const params = useSearchParams();
  const category = params.get("category");
  const sector = params.get("sector");
  useEffect(() => {
    const s = INVESTMENT_SECTORS.find((x) => x.slug === sector);
    const g = SECTOR_GROUPS.find((x) => x.id === category);
    if (s) onApply(s.group, s.slug);
    else if (g) onApply(g.id, null);
  }, [category, sector, onApply]);
  return null;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function SectorDirectory() {
  const root = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const lockedHeight = useRef<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const first = useRef(true);
  const [target, setTarget] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  const applyDeepLink = useCallback((f: Filter, slug: string | null) => {
    setFilter(f);
    setTarget(slug);
  }, []);

  // Bring a deep-linked sector into view once the filtered grid has rendered and the hash scroll has settled.
  useEffect(() => {
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => {
      document.getElementById(`sector-${target}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      setHighlight(target);
    }, 700);
    const h = window.setTimeout(() => setHighlight(null), 3600);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(h);
    };
  }, [target]);

  const visible = INVESTMENT_SECTORS.filter((s) => filter === "all" || s.group === filter);
  const groupLabel = (id: SectorGroupId) => SECTOR_GROUPS.find((g) => g.id === id)?.filterLabel ?? "";

  const select = (id: Filter) => {
    if (id === filter) return;
    // Remember the current height so the grid can tween to its new height instead of jumping.
    lockedHeight.current = gridRef.current?.offsetHeight ?? null;
    setFilter(id);
  };

  /* Entrance */
  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-sd-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-sd-intro]"), { trigger: el, start, delay: 0.3, stagger: 0.1 });
    fadeUp(el.querySelector("[data-sd-toolbar]"), { trigger: el.querySelector("[data-sd-toolbar]"), start: "top 92%", y: 12 });
    fadeUp(el.querySelectorAll("[data-sd-item]"), {
      trigger: el.querySelector("[data-sd-grid]"),
      start: "top 88%",
      y: 18,
      duration: 0.7,
      stagger: 0.04,
    });
  });

  /* Filter transition: runs after React has rendered the new set. The first render is handled by the entrance above. */
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      const grid = gridRef.current;
      const items = root.current?.querySelectorAll("[data-sd-item]");
      if (!grid || !items?.length) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const from = lockedHeight.current;
      lockedHeight.current = null;
      if (reduce) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.03, overwrite: "auto" },
      );
      const to = grid.offsetHeight;
      if (from && Math.abs(from - to) > 2) {
        gsap.fromTo(
          grid,
          { height: from, overflow: "hidden" },
          { height: to, duration: 0.5, ease: "power2.inOut", clearProps: "height,overflow" },
        );
      }
    },
    { scope: root, dependencies: [filter] },
  );

  return (
    <section
      id="sectors"
      ref={root}
      aria-labelledby="sd-heading"
      className="relative scroll-mt-20 bg-frost py-20 text-muted sm:py-24 lg:py-28"
    >
      <Suspense fallback={null}>
        <DeepLink onApply={applyDeepLink} />
      </Suspense>
      <div className="container-nx">
        <div className="grid items-end gap-y-5 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <SectionLabel data-anim data-sd-label>Sectors of Interest</SectionLabel>
            <MaskedLines id="sd-heading" lines={["Opportunity Across Industries."]} className="display-md mt-5 text-ink sm:mt-6" />
          </div>
          <p
            data-anim
            data-sd-intro
            className="max-w-[34rem] text-[1.0625rem] leading-[1.6] lg:col-span-6 lg:max-w-none lg:border-l lg:border-line lg:pb-1 lg:pl-8"
          >
            Our investment interests encompass a broad range of industries shaping economic
            activity, technological advancement, and evolving global needs.
          </p>
        </div>

        <div
          data-anim
          data-sd-toolbar
          className="mt-9 flex flex-col gap-4 border-y border-line py-4 sm:mt-11 lg:flex-row lg:items-center lg:justify-between"
        >
          <div role="group" aria-label="Filter sectors by category" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => select(f.id)}
                  className={`inline-flex min-h-11 items-center gap-2 border px-4 font-ui text-[0.8125rem] font-semibold transition-colors duration-300 ${
                    active ? "border-obsidian bg-obsidian text-pure" : "border-line bg-pure text-ink hover:border-obsidian"
                  }`}
                >
                  {f.label}{" "}
                  <span className={`font-normal tabular-nums ${active ? "text-silver" : "text-muted"}`}>({countByGroup(f.id)})</span>
                </button>
              );
            })}
          </div>
          <p role="status" aria-live="polite" className="font-ui text-[0.8125rem] text-muted">
            Showing <span className="font-semibold text-ink">{visible.length}</span> of {INVESTMENT_SECTORS.length} sectors
          </p>
        </div>

        <ul
          ref={gridRef}
          data-sd-grid
          className="mt-3 grid gap-x-5 sm:mt-8 sm:grid-cols-2 sm:gap-y-9 lg:grid-cols-3 min-[1400px]:grid-cols-4"
        >
          {visible.map((s) => {
            const href = sectorHref(s.slug);
            const num = pad(INVESTMENT_SECTORS.indexOf(s) + 1);
            const body = (
              <>
                <span className="relative block aspect-square w-24 shrink-0 overflow-hidden bg-steel-deep sm:aspect-[3/2] sm:w-auto">
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    sizes="(min-width: 1400px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 96px"
                    style={{ objectPosition: s.image.position }}
                    className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.05]"
                  />
                </span>
                <span className="mt-0 block min-w-0 flex-1 border-line sm:mt-0 sm:flex-none sm:border-t sm:pt-4 sm:transition-colors sm:duration-500 sm:group-hover:border-obsidian">
                  <span className="flex items-center justify-between gap-3">
                    <span className="eyebrow text-[0.625rem] text-steel">{groupLabel(s.group)}</span>
                    <span aria-hidden className="font-ui text-[0.6875rem] font-semibold tracking-[0.12em] text-muted/70">{num}</span>
                  </span>
                  <span className="mt-1.5 flex items-start justify-between gap-3 sm:mt-2">
                    <span className="font-display text-[1.125rem] leading-[1.25] text-ink sm:text-[1.3125rem]">{s.title}</span>
                    {href && <ArrowUpRight aria-hidden strokeWidth={1.4} className="mt-1 size-5 shrink-0 text-steel transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-[0.875rem] leading-[1.5] sm:mt-2 sm:line-clamp-3 sm:text-[0.9375rem]">{s.description}</span>
                </span>
              </>
            );
            const cls = "group flex gap-4 sm:block";
            return (
              <li key={s.slug} id={`sector-${s.slug}`} data-anim data-sd-item className={`scroll-mt-28 border-b border-line py-4 transition-[box-shadow,background-color] duration-700 sm:border-b-0 sm:py-0 ${highlight === s.slug ? "bg-pure shadow-[0_0_0_6px_var(--color-pure),0_0_0_7px_var(--color-steel)]" : ""}`}>
                {href ? <Link href={href} className={cls}>{body}</Link> : <div className={cls}>{body}</div>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
