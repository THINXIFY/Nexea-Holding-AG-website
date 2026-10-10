"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <button
      type="button"
      onClick={toTop}
      className="group on-dark inline-flex items-center gap-3 whitespace-nowrap font-ui text-xs font-semibold uppercase tracking-[0.18em] text-silver transition-colors duration-300 hover:text-pure"
    >
      Back to top
      <span
        aria-hidden
        className="grid size-10 place-items-center border border-white/25 transition-colors duration-500 group-hover:border-platinum group-hover:bg-platinum group-hover:text-obsidian"
      >
        <ArrowUp strokeWidth={1.4} className="size-[1.125rem] transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
