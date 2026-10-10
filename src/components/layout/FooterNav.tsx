"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface FooterLink {
  label: string;
  href: string;
}

/**
 * One footer navigation group. From 768px it is a plain column (heading + links). Below that the heading
 * becomes an accordion trigger; collapsed links are inert so they never take keyboard focus.
 */
export function FooterGroup({ title, links }: { title: string; links: readonly FooterLink[] }) {
  const [open, setOpen] = useState(false);
  const wide = useMediaQuery("(min-width: 768px)");
  const uid = useId();
  const panelId = `${uid}-panel`;

  return (
    <div className="border-b border-white/10 md:border-0">
      <h2 className="hidden font-ui text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-silver md:block">{title}</h2>
      <h2 className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-12 w-full items-center justify-between gap-4 text-left font-ui text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-platinum"
        >
          {title}
          <ChevronDown aria-hidden strokeWidth={1.5} className={`size-4 text-silver transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </h2>
      <div
        id={panelId}
        inert={!wide && !open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:grid-rows-[1fr] motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <ul className="min-h-0 space-y-1 overflow-hidden md:mt-5 md:space-y-3 md:overflow-visible">
          {links.map((l) => (
            <li key={l.label} className="first:pt-0.5 last:pb-4 md:last:pb-0">
              <Link href={l.href} className="link-underline inline-flex min-h-10 items-center text-[0.9375rem] text-platinum transition-colors duration-300 hover:text-pure md:min-h-0">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
