"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowUpRight, Download, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { REGISTER_DOCUMENTS, type RegisterDocument } from "@/data/company-register";

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

const btnPrimary =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 border border-platinum bg-platinum px-5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-500 hover:bg-pure";
const btnGhost =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 border border-silver/40 px-5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-pure transition-colors duration-500 hover:border-pure hover:bg-white/[0.06]";

/** Reusable viewer for the company register documents (opened from Contact and Impressum). */
export function CompanyRegisterModal({ onClose }: { onClose: () => void }) {
  const [viewing, setViewing] = useState<RegisterDocument | null>(null);
  // Embedded viewing only where PDFs render reliably (desktop pointers); touch browsers open the PDF in a new tab.
  const canEmbed = useMediaQuery("(hover: hover) and (pointer: fine) and (min-width: 768px)");

  const overlay = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Open: remember the opener, lock page scroll, animate in. Close: restore focus.
  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(card.current, { opacity: 0, y: 16, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    });
    return () => {
      ctx.revert();
      html.style.overflow = prev[0];
      document.body.style.overflow = prev[1];
      opener.current?.focus?.();
    };
  }, []);

  // Each view: soft entrance and focus the first meaningful control.
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(el.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.05, overwrite: "auto" });
    }
    el.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
  }, [viewing]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !card.current) return;
    const nodes = Array.from(card.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.getClientRects().length > 0 && n.tabIndex !== -1);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      ref={overlay}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="on-dark fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-obsidian/65 p-3 backdrop-blur-md sm:p-6"
    >
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cr-heading"
        className={`relative my-auto flex w-full flex-col overflow-hidden rounded-3xl border border-silver/25 bg-[linear-gradient(135deg,rgba(24,33,42,0.82),rgba(9,13,17,0.9))] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-[max-width] duration-500 ease-out motion-reduce:transition-none ${viewing ? "max-w-[64rem]" : "max-w-[44rem]"}`}
      >
        <button type="button" onClick={onClose} aria-label="Close dialog" className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full text-silver transition-colors hover:bg-white/10 hover:text-pure">
          <X aria-hidden strokeWidth={1.5} className="size-5" />
        </button>

        <div ref={body} className="p-6 pt-7 sm:p-9 sm:pt-10">
          {!viewing ? (
            <>
              <p className="eyebrow flex items-center gap-3 text-[0.6875rem] text-silver">
                <span aria-hidden className="h-px w-8 bg-silver/60" />
                Nexea Holding AG
              </p>
              <h2 id="cr-heading" className="mt-3 pr-10 font-display text-[1.875rem] leading-[1.1] text-pure sm:text-[2.25rem]">Company Register Documents</h2>
              <p className="mt-3 text-[0.9375rem] leading-[1.5] text-platinum/90">Explore Nexea Holding AG&rsquo;s corporate registration documents.</p>

              <ul className="mt-6 grid gap-3">
                {REGISTER_DOCUMENTS.map((d, i) => (
                  <li key={d.id} className="group border border-white/15 bg-white/[0.03] p-5 transition-[border-color,background-color] duration-500 hover:border-silver/50 hover:bg-white/[0.05] sm:p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-display text-[1.375rem] leading-[1.15] text-pure sm:text-[1.5rem]">{d.title}</h3>
                      <p className="font-ui text-[0.8125rem] font-semibold text-platinum">
                        {d.source} · <time dateTime={d.dateISO}>{d.dateLabel}</time>
                      </p>
                    </div>
                    <p className="mt-2 text-[0.875rem] leading-[1.5] text-silver/90">{d.description}</p>
                    <p className="mt-1 font-ui text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-silver/60">PDF · German</p>
                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                      {canEmbed ? (
                        <button type="button" data-autofocus={i === 0 ? "" : undefined} onClick={() => setViewing(d)} className={btnPrimary}>
                          View Document
                          <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </button>
                      ) : (
                        <a href={d.file} target="_blank" rel="noopener noreferrer" data-autofocus={i === 0 ? "" : undefined} className={btnPrimary}>
                          View Document
                          <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4" />
                          <span className="sr-only"> (opens the PDF in a new tab)</span>
                        </a>
                      )}
                      <a href={d.file} download={d.downloadName} className={btnGhost}>
                        <Download aria-hidden strokeWidth={1.5} className="size-4" />
                        Download PDF
                      </a>
                    </div>
                  </li>
                ))}
              </ul>

            </>
          ) : (
            <>
              <button type="button" data-autofocus onClick={() => setViewing(null)} className="inline-flex min-h-11 items-center gap-2 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-silver transition-colors hover:text-pure">
                <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4" /> All documents
              </button>
              <h2 id="cr-heading" className="mt-2 pr-10 font-display text-[1.5rem] leading-[1.15] text-pure sm:text-[1.875rem]">{viewing.title}</h2>
              <p className="mt-1 font-ui text-[0.8125rem] font-semibold text-platinum">
                {viewing.source} · <time dateTime={viewing.dateISO}>{viewing.dateLabel}</time>
              </p>

              <div className="mt-5 border border-white/15 bg-white/[0.04]">
                <iframe title={`${viewing.title} (PDF)`} src={`${viewing.file}#view=FitH`} className="block h-[62vh] min-h-[22rem] w-full bg-white" />
              </div>
              <p className="mt-3 text-[0.8125rem] leading-[1.5] text-silver/85">
                If the document does not display in your browser,{" "}
                <a href={viewing.file} target="_blank" rel="noopener noreferrer" className="font-semibold text-pure underline decoration-silver/50 underline-offset-4">
                  open the PDF in a new tab<span className="sr-only"> (opens in a new tab)</span>
                </a>
                .
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <a href={viewing.file} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                  Open in New Tab <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a href={viewing.file} download={viewing.downloadName} className={btnGhost}>
                  <Download aria-hidden strokeWidth={1.5} className="size-4" /> Download PDF
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
