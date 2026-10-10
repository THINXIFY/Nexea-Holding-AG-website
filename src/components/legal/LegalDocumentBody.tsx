"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fadeUp } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import type { LegalBlock, LegalDocument } from "@/data/legal-documents";
import { COMPANY } from "@/data/company";

const mailLink = "font-ui font-semibold text-ink underline decoration-silver underline-offset-4 transition-colors hover:text-steel [overflow-wrap:anywhere]";

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-steel" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "email":
      return (
        <p>
          {block.lead}{" "}
          <a href={`mailto:${COMPANY.email}`} className={`inline-flex min-h-11 items-center ${mailLink}`}>{COMPANY.email}</a>
        </p>
      );
    case "details":
      return (
        <div className="border-t border-line pt-5">
          <p className="eyebrow text-[0.625rem] text-steel">{block.heading}</p>
          <address className="mt-3 not-italic leading-[1.55]">
            {block.lines.map((l, i) => (
              <span key={l} className={`block ${i === 0 ? "font-ui font-semibold text-ink" : ""}`}>{l}</span>
            ))}
            {block.email && (
              <span className="mt-2 block">
                Email:{" "}
                <a href={`mailto:${block.email}`} className={`inline-flex min-h-11 items-center ${mailLink}`}>{block.email}</a>
              </span>
            )}
          </address>
        </div>
      );
  }
}

/**
 * Numbered legal sections. Restrained motion only: each section header eases in and its divider
 * draws once; the legal text itself is never hidden or animated.
 */
export function LegalDocumentBody({ doc }: { doc: LegalDocument }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>("[data-lg-section]").forEach((sec) => {
      const trigger = { trigger: sec, start: "top 85%", once: true } as const;
      const head = sec.querySelector("[data-lg-head]");
      if (head) fadeUp(head, { trigger: sec, start: trigger.start, y: 14, duration: 0.7 });
      const rule = sec.querySelector("[data-lg-rule]");
      if (rule) gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out", delay: 0.1, scrollTrigger: trigger });
    });
  });

  return (
    <div ref={root} className="space-y-12 sm:space-y-14 lg:space-y-16">
      {doc.sections.map((s) => (
        <section key={s.id} id={s.id} data-lg-section aria-labelledby={`${s.id}-heading`} className="scroll-mt-32 lg:scroll-mt-28">
          <header data-lg-head>
            <p className="eyebrow flex items-center gap-4 text-[0.6875rem] text-steel">
              {s.number} / {s.nav}
              <span aria-hidden data-lg-rule className="h-px flex-1 origin-left bg-line" />
            </p>
            <h2 id={`${s.id}-heading`} className="display-md mt-3 text-ink">{s.title}</h2>
          </header>
          <div className="mt-5 max-w-[42rem] space-y-4 text-[1.0625rem] leading-[1.65]">
            {s.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}
            {s.number === String(doc.sections.length).padStart(2, "0") && (
              <p className="border-t border-line pt-5 font-ui text-[0.9375rem]">
                <span className="eyebrow mr-2 text-[0.625rem] text-steel">Last updated</span>
                <span className="font-semibold text-ink">{doc.lastUpdated}</span>
              </p>
            )}
          </div>
        </section>
      ))}
      <p className="text-[0.8125rem] leading-[1.5] text-muted">
        This document is provided for information and is subject to review by qualified Swiss legal counsel.
      </p>
    </div>
  );
}
