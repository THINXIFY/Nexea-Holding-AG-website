"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { ADDRESS_LINES, COMPANY, MAPS_LINK_URL } from "@/data/company";
import { ACTIVITIES, COMPANY_DESCRIPTION, DISCLOSURES, PRIVACY_NOTICE, LEGAL_RESOURCES, LEGAL_SECTIONS, LEGAL_STATUS_STATEMENT, REGISTERED_PURPOSE, SIGNATORIES } from "@/data/impressum";
import { CopyAddressButton } from "@/components/contact/CopyAddressButton";
import { CopyValueButton } from "@/components/impressum/CopyValueButton";

const section = (id: string) => LEGAL_SECTIONS.find((s) => s.id === id) ?? LEGAL_SECTIONS[0];

function Head({ id, title, intro }: { id: string; title: string; intro?: string }) {
  const s = section(id);
  return (
    <header data-lg-head>
      <p className="eyebrow flex items-center gap-4 text-[0.6875rem] text-steel">
        {s.eyebrow}
        <span aria-hidden data-lg-rule className="h-px flex-1 origin-left bg-line" />
      </p>
      <h2 id={`${id}-heading`} className="display-md mt-3 text-ink">{title}</h2>
      {intro && <p className="mt-3 max-w-[40rem] text-[1.0625rem] leading-[1.6]">{intro}</p>}
    </header>
  );
}

interface Fact {
  label: string;
  value: React.ReactNode;
  note?: string;
  copy?: { value: string; label: string };
}

function FactGrid({ facts, cols = 2 }: { facts: readonly Fact[]; cols?: 2 | 3 }) {
  return (
    <dl className={`mt-6 grid border-t border-line ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} sm:gap-x-8`}>
      {facts.map((f) => (
        <div key={f.label} className="border-b border-line py-4">
          <dt className="eyebrow text-[0.625rem] text-steel">{f.label}</dt>
          <dd className="mt-1.5 flex items-start justify-between gap-3">
            <span className="min-w-0 font-ui text-[1rem] font-semibold leading-[1.4] text-ink [overflow-wrap:anywhere]">{f.value}</span>
            {f.copy && <CopyValueButton value={f.copy.value} label={f.copy.label} />}
          </dd>
          {f.note && <p className="mt-1 text-[0.875rem] leading-[1.45]">{f.note}</p>}
        </div>
      ))}
    </dl>
  );
}

/**
 * In-section jump links. A collapsed notice is opened first and scrolled to once its
 * content has laid out (the native anchor scroll would be computed too early and stop short).
 * Other targets keep the browser's native anchor behaviour.
 */
function jumpTo(e: MouseEvent<HTMLAnchorElement>) {
  const id = e.currentTarget.getAttribute("href")?.slice(1);
  const el = id ? document.getElementById(id) : null;
  if (!(el instanceof HTMLDetailsElement)) return;
  e.preventDefault();
  el.open = true;
  window.history.replaceState(null, "", `#${el.id}`);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Opening changes the document height, which schedules the site-wide ScrollTrigger refresh (debounced 250ms).
  // A refresh interrupts an in-flight smooth scroll, so wait for it before scrolling.
  window.setTimeout(() => el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 450);
}

export function LegalSections() {
  const root = useRef<HTMLDivElement>(null);

  // Restrained: one entrance per section header, its divider draws; content itself is never hidden.
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

  const identification: Fact[] = [
    { label: "Registered Company", value: COMPANY.name },
    { label: "Legal Form", value: COMPANY.legalForm, note: "Swiss corporation" },
    { label: "Registered Office", value: COMPANY.registeredOffice },
    { label: "Commercial Register Number", value: COMPANY.commercialRegisterNumber, note: `Commercial Register Office: ${COMPANY.commercialRegisterOffice}`, copy: { value: COMPANY.commercialRegisterNumber, label: "commercial register number" } },
    { label: "Company UID", value: COMPANY.uid, note: "Swiss company identification number", copy: { value: COMPANY.uid, label: "company UID" } },
    { label: "Commercial Registration Date", value: COMPANY.registrationDate, note: "Entry in the Commercial Register" },
    { label: "Company Status", value: COMPANY.status },
  ];

  return (
    <div ref={root} className="space-y-14 sm:space-y-16 lg:space-y-20">
      {/* 01 */}
      <section id="identification" data-lg-section aria-labelledby="identification-heading" className="scroll-mt-32 lg:scroll-mt-28">
        <Head id="identification" title="Nexea Holding AG" />
        <div className="mt-4 max-w-[44rem] border-l-2 border-steel pl-5">
          <h3 className="font-ui text-[1.0625rem] font-semibold leading-snug text-ink">{COMPANY_DESCRIPTION.heading}</h3>
          <div className="mt-2 space-y-3 text-[1.0625rem] leading-[1.6]">
            {COMPANY_DESCRIPTION.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <FactGrid facts={identification} />
      </section>

      {/* 02 */}
      <section id="capital" data-lg-section aria-labelledby="capital-heading" className="scroll-mt-32 lg:scroll-mt-28">
        <Head id="capital" title="Registered Capital & Corporate Status." intro="Nexea Holding AG is an active Swiss corporation with registered share capital of CHF 2,000,000." />
        <div className="mt-6 grid border border-line lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="border-b border-line bg-frost p-6 lg:border-b-0 lg:border-r">
            <p className="eyebrow text-[0.625rem] text-steel">Registered Share Capital</p>
            <p className="mt-3 font-display text-[2.25rem] leading-none text-ink sm:text-[2.75rem]">{COMPANY.shareCapital.amount}</p>
            <span aria-hidden className="mt-4 block h-px w-12 bg-steel" />
            <p className="mt-3 text-[0.875rem] leading-[1.5]">{COMPANY.shareCapital.currency}. Share capital as registered in the commercial register.</p>
          </div>
          <div>
            <h3 className="border-b border-line px-5 pb-3 pt-5 font-ui text-[0.9375rem] font-semibold text-ink">Legal Registration & Corporate Status</h3>
            <dl className="grid sm:grid-cols-2">
              {[
                ["Company Status", COMPANY.status],
                ["Legal Form", COMPANY.legalForm],
                ["Registered Since", COMPANY.registrationDate],
                ["Registered Share Capital", COMPANY.shareCapital.amount],
                ["Commercial Register", COMPANY.commercialRegisterOffice],
                ["Registration Number", COMPANY.commercialRegisterNumber],
                ["Company UID", COMPANY.uid],
              ].map(([k, v], i) => (
                <div key={k} className={`border-b border-line px-5 py-3.5 ${i % 2 === 0 ? "sm:border-r" : ""}`}>
                  <dt className="eyebrow text-[0.625rem] text-steel">{k}</dt>
                  <dd className="mt-1 font-ui text-[0.9375rem] font-semibold leading-[1.4] text-ink [overflow-wrap:anywhere]">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="px-5 py-4">
              <h4 className="eyebrow text-[0.625rem] text-steel">Legal Status</h4>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.55]">{LEGAL_STATUS_STATEMENT}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 border-l-2 border-steel bg-frost p-5">
          <h3 className="font-ui text-[1rem] font-semibold text-ink">Registered corporate purpose</h3>
          <p className="mt-2 max-w-[44rem] text-[1rem] leading-[1.6]">{REGISTERED_PURPOSE}</p>
        </div>
        <div data-testid="activities" className="mt-8">
          <h3 className="font-display text-[1.375rem] leading-[1.2] text-ink">{ACTIVITIES.title}</h3>
          <div className="mt-4 grid border-t border-line md:grid-cols-2 md:gap-x-8">
            <div className="border-b border-line py-4 md:border-b-0">
              <p className="eyebrow text-[0.625rem] text-steel">Registered activities</p>
              <p className="mt-2 text-[1rem] leading-[1.6]">{ACTIVITIES.registered}</p>
            </div>
            <div className="border-b border-line py-4 md:border-b-0 md:border-l md:pl-8">
              <p className="eyebrow flex items-center gap-2 text-[0.625rem] text-steel">
                Proposed services
                <span className="border border-steel/50 px-1.5 py-0.5 font-ui text-[0.625rem] tracking-[0.1em] text-steel">Not yet established</span>
              </p>
              <div className="mt-2 space-y-3 text-[1rem] leading-[1.6]">
                {ACTIVITIES.proposed.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 max-w-[44rem] text-[0.875rem] leading-[1.5] text-muted">
          Registered share capital is a legal figure. It does not represent cash on hand, investment
          funding, assets under management, or investment capacity.
        </p>
      </section>

      {/* 03 */}
      <section id="signatories" data-lg-section aria-labelledby="signatories-heading" className="scroll-mt-32 lg:scroll-mt-28">
        <Head id="signatories" title="Management & Signatories." intro="The following individuals are identified in the available commercial-register information as corporate officers or authorized representatives." />
        <ul className="mt-6 grid border-t border-line md:grid-cols-3 md:gap-x-0">
          {SIGNATORIES.map((s, i) => (
            <li key={s.name} className={`border-b border-line py-5 md:border-b-0 md:py-6 ${i > 0 ? "md:border-l md:pl-6" : "md:pr-6"} ${i === 1 ? "md:pr-6" : ""}`}>
              <h3 className="font-display text-[1.375rem] leading-[1.2] text-ink">{s.name}</h3>
              <p className="mt-2 font-ui text-[0.9375rem] font-semibold leading-[1.4] text-ink">{s.position}</p>
              <p className="mt-3 border-t border-line pt-3 text-[0.9375rem] leading-[1.45]">{s.authority}</p>
            </li>
          ))}
        </ul>
        <div className="mt-2 border border-line bg-frost p-5">
          <p className="eyebrow text-[0.625rem] text-steel">Registered Auditor</p>
          <p className="mt-1.5 font-ui text-[1.0625rem] font-semibold text-ink">{COMPANY.auditor.name}</p>
          <p className="text-[0.9375rem]">{COMPANY.auditor.location}</p>
        </div>
      </section>

      {/* 04 */}
      <section id="contact-info" data-lg-section aria-labelledby="contact-info-heading" className="scroll-mt-32 lg:scroll-mt-28">
        <Head id="contact-info" title="Contact & Registered Office." />
        <div className="mt-6 grid gap-y-6 border-t border-line pt-6 sm:grid-cols-2 sm:gap-x-8">
          <div>
            <p className="font-ui text-[1.0625rem] font-semibold text-ink">{COMPANY.name}</p>
            <address className="mt-2 text-[1rem] not-italic leading-[1.55]">
              {ADDRESS_LINES.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="eyebrow text-[0.625rem] text-steel">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${COMPANY.email}`} className="inline-flex min-h-11 items-center font-ui text-[1rem] font-semibold text-ink underline decoration-silver underline-offset-4 transition-colors hover:text-steel [overflow-wrap:anywhere]">{COMPANY.email}</a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.625rem] text-steel">Website</dt>
              <dd className="mt-1">
                <a href={COMPANY.url} className="inline-flex min-h-11 items-center font-ui text-[1rem] font-semibold text-ink underline decoration-silver underline-offset-4 transition-colors hover:text-steel [overflow-wrap:anywhere]">{COMPANY.url}</a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/contact" className="group inline-flex min-h-12 items-center justify-center gap-2.5 border border-obsidian bg-obsidian px-5 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-pure transition-colors duration-500 hover:bg-steel-deep">
            Contact Nexea
            <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </Link>
          <CopyAddressButton />
          <a href={MAPS_LINK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2.5 border border-obsidian/30 px-5 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-500 hover:border-obsidian hover:bg-obsidian hover:text-pure">
            View Location
            <ExternalLink aria-hidden strokeWidth={1.5} className="size-4" />
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </div>
      </section>

      {/* 05 */}
      <section id="disclosures" data-lg-section aria-labelledby="disclosures-heading" className="scroll-mt-32 lg:scroll-mt-28">
        <Head id="disclosures" title="Website Information & Legal Notices." />
        <nav aria-label="Notices in this section" className="mt-4 border-y border-line py-1">
          <ol className="flex flex-wrap gap-x-5">
            {DISCLOSURES.map((d, i) => (
              <li key={d.id}>
                <a href={`#${d.id}`} onClick={jumpTo} className="inline-flex min-h-11 items-center gap-1.5 font-ui text-[0.8125rem] font-semibold text-ink underline decoration-transparent underline-offset-4 transition-colors hover:text-steel hover:decoration-silver">
                  <span aria-hidden className="text-steel">{String(i + 1).padStart(2, "0")}</span>
                  {d.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-2">
          {DISCLOSURES.map((d, i) => {
            const num = String(i + 1).padStart(2, "0");
            const body = (
              <div className="max-w-[42rem] space-y-3 text-[1rem] leading-[1.6]">
                {d.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            );
            if (d.tier === "secondary") {
              return (
                <details key={d.id} id={d.id} data-notice={d.id} className="group scroll-mt-32 border-b border-line lg:scroll-mt-28">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-baseline gap-3">
                      <span aria-hidden className="font-ui text-xs font-semibold tracking-[0.14em] text-steel">{num}</span>
                      <h3 className="font-display text-[1.25rem] leading-[1.25] text-ink">{d.title}</h3>
                    </span>
                    <ChevronDown aria-hidden strokeWidth={1.5} className="size-5 shrink-0 text-ink transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="pb-5 md:pl-[2.6rem]">{body}</div>
                </details>
              );
            }
            const highlight = d.tier === "highlight";
            return (
              <article key={d.id} id={d.id} data-notice={d.id} className={`scroll-mt-32 border-b border-line py-6 lg:scroll-mt-28 ${highlight ? "my-1 border-l-2 border-l-steel bg-frost px-5" : ""}`}>
                <div className="grid gap-x-8 md:grid-cols-[minmax(0,3fr)_minmax(0,8fr)]">
                  <h3 className="flex items-baseline gap-3 font-display text-[1.25rem] leading-[1.25] text-ink">
                    <span aria-hidden className="font-ui text-xs font-semibold tracking-[0.14em] text-steel">{num}</span>
                    {d.title}
                  </h3>
                  <div className="mt-3 md:mt-0">
                    {highlight && <p className="eyebrow mb-2 text-[0.625rem] text-steel">Regulatory information</p>}
                    {body}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-4 text-[0.8125rem] leading-[1.5] text-muted">
          These notices are provided for information and are subject to review by qualified Swiss legal counsel.
        </p>
      </section>

      {/* 06 */}
      <section id="privacy" data-lg-section aria-labelledby="privacy-heading" className="scroll-mt-32 lg:scroll-mt-28">
        <Head id="privacy" title="Privacy & Legal Resources." intro="For information about personal-data processing, cookies, and the use of this website, please consult the Privacy Policy and the Terms & Conditions." />
        <article id="privacy-data" data-notice="privacy-data" className="mt-6 scroll-mt-32 border-t border-line pt-5 lg:scroll-mt-28">
          <h3 className="font-display text-[1.25rem] leading-[1.25] text-ink">{PRIVACY_NOTICE.title}</h3>
          <div className="mt-3 max-w-[42rem] space-y-3 text-[1rem] leading-[1.6]">
            {PRIVACY_NOTICE.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </article>
        <ul className="mt-6 border-t border-line">
          {LEGAL_RESOURCES.map((r) => (
            <li key={r.label} className="border-b border-line">
              {r.href ? (
                <Link href={r.href} className="group flex min-h-14 items-center justify-between gap-4 py-3 font-ui text-[1rem] font-semibold text-ink transition-colors hover:text-steel">
                  {r.label}
                  <ArrowRight aria-hidden strokeWidth={1.4} className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                </Link>
              ) : (
                <p className="flex min-h-14 items-center justify-between gap-4 py-3 font-ui text-[1rem] font-semibold text-muted">
                  {r.label}
                  <span className="font-body text-[0.8125rem] font-normal">Not yet published</span>
                </p>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.9375rem] leading-[1.55]">
          <span className="font-semibold text-ink">{COMPANY.name}</span>
          <br />
          Hergiswil, Switzerland
          <br />
          UID: {COMPANY.uid}
        </p>
      </section>
    </div>
  );
}
