"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LEGAL_SECTIONS } from "@/data/impressum";

/**
 * Legal navigation. Plain in-page anchors (so it works without JavaScript, and
 * native `scroll-margin-top` handles the sticky-header offset); an
 * IntersectionObserver only marks the active section. Desktop: sticky sidebar.
 * Small screens: a compact, accessible table-of-contents disclosure that
 * stays visible under the header and names the current section.
 */
interface NavSection {
  id: string;
  number: string;
  nav: string;
}

export function LegalNav({ sections = LEGAL_SECTIONS }: { sections?: readonly NavSection[] }) {
  const [active, setActive] = useState(sections[0].id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nodes = sections.map((s) => document.getElementById(s.id)).filter((n): n is HTMLElement => !!n);
    // A section becomes active when its top crosses the upper third of the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
        // Scrolled back above the first section (hero area): the first item is the current one.
        else if (nodes[0].getBoundingClientRect().top > window.innerHeight * 0.35) setActive(nodes[0].id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [sections]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current = sections.find((s) => s.id === active) ?? sections[0];

  const items = (onPick?: () => void) =>
    sections.map((s) => {
      const on = s.id === active;
      return (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={on ? "location" : undefined}
            onClick={() => {
              setActive(s.id);
              onPick?.();
            }}
            className={`group flex min-h-12 items-center justify-between gap-3 px-4 py-2.5 transition-colors duration-300 ${
              on ? "bg-obsidian text-pure" : "text-ink hover:bg-frost"
            }`}
          >
            <span>
              <span className={`block font-ui text-[0.6875rem] font-semibold tracking-[0.14em] ${on ? "text-silver" : "text-steel"}`}>{s.number}</span>
              <span className="block font-ui text-[0.9375rem] font-semibold leading-snug">{s.nav}</span>
            </span>
            <ArrowRight aria-hidden strokeWidth={1.4} className={`size-4 shrink-0 transition-all duration-500 ease-out-expo ${on ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`} />
          </a>
        </li>
      );
    });

  return (
    <>
      {/* Small screens: compact table of contents */}
      <div className="sticky top-[4.5rem] z-30 -mx-5 border-b border-line bg-pure/95 backdrop-blur-sm sm:-mx-8 lg:hidden">
        <div className="px-5 sm:px-8">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="legal-toc"
            onClick={() => setOpen((v) => !v)}
            className="flex min-h-12 w-full items-center justify-between gap-3 text-left font-ui"
          >
            <span>
              <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-steel">On this page</span>
              <span className="block text-[0.9375rem] font-semibold text-ink">
                {current.number} · {current.nav}
              </span>
            </span>
            <ChevronDown aria-hidden strokeWidth={1.5} className={`size-5 shrink-0 text-ink transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
        {/* Overlay (absolute), so opening or closing it never shifts the page layout mid-scroll. */}
        <nav id="legal-toc" aria-label="Legal sections" hidden={!open} className="absolute inset-x-0 top-full border-y border-line bg-pure shadow-[0_12px_24px_-12px_rgba(9,13,17,0.18)]">
          <ul>{items(() => setOpen(false))}</ul>
        </nav>
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <nav aria-label="Legal sections" className="border border-line bg-pure">
            <ul className="divide-y divide-line">{items()}</ul>
          </nav>
          <div className="mt-5 border border-line bg-frost p-5">
            <p className="font-ui text-[0.9375rem] font-semibold text-ink">Need to contact us?</p>
            <p className="mt-1.5 text-[0.875rem] leading-[1.5] text-muted">For enquiries, please use our contact form or email us directly.</p>
            <Link href="/contact" className="group mt-4 inline-flex min-h-11 w-full items-center justify-between gap-3 border border-obsidian/30 bg-pure px-4 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-500 hover:border-obsidian hover:bg-obsidian hover:text-pure">
              Contact Us
              <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
