import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { INVESTMENT_SECTORS, SECTOR_GROUPS } from "@/data/investment-sectors";
import { SERVICE_AREAS } from "@/data/services";
import { categoryHref, sectorDeepLink, serviceDeepLink } from "@/data/navigation";

interface PanelProps {
  id: string;
  open: boolean;
  onNavigate: () => void;
}

/** Shared enter/exit: opacity + a few px of travel. Closed panels are inert so they never take focus. */
const shell = (open: boolean) =>
  `absolute inset-x-0 top-full pt-2 transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none ${
    open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1.5 opacity-0"
  }`;

const pad = (n: number) => String(n).padStart(2, "0");

/** Fine concentric arcs: the same quiet geometry used on the Team page's featured panel. */
function Arcs({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 400 400" fill="none" className={`pointer-events-none absolute -z-10 ${className}`}>
      {[70, 120, 170, 220].map((r) => (
        <circle key={r} cx="0" cy="400" r={r} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}

/** Investments: dark, typography-led directory of the investment sectors in four categories. */
export function InvestmentsMega({ id, open, onNavigate }: PanelProps) {
  return (
    <div id={id} inert={!open} className={shell(open)}>
      <div className="on-dark overflow-hidden rounded-2xl border border-silver/20 bg-[#0c1116] text-pure shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
        <div className="grid lg:grid-cols-[minmax(0,2.9fr)_minmax(0,9.1fr)]">
          {/* Intro */}
          <div className="relative isolate flex flex-col justify-between overflow-hidden border-b border-white/10 bg-carbon/70 p-7 lg:border-b-0 lg:border-r xl:p-8">
            <Arcs className="-bottom-24 -left-28 size-[22rem] text-silver/[0.09]" />
            <div>
              <p className="eyebrow flex items-center gap-3 text-[0.625rem] text-silver">
                <span aria-hidden className="h-px w-6 bg-silver/60" />
                Nexea Investment Universe
              </p>
              <p className="mt-4 font-display text-[2rem] leading-[1.06] text-pure">Invest with Perspective.</p>
              <p className="mt-3 max-w-[17rem] text-[0.9375rem] leading-[1.45] text-platinum/90">Explore the sectors shaping long-term opportunities.</p>
            </div>
            <div className="mt-8 border-t border-white/10 pt-5">
              <dl className="hidden gap-8 lg:flex">
                <div>
                  <dd className="font-display text-[2rem] leading-none text-pure">{INVESTMENT_SECTORS.length}</dd>
                  <dt className="eyebrow mt-2 text-[0.5625rem] text-silver">Sectors of interest</dt>
                </div>
                <div>
                  <dd className="font-display text-[2rem] leading-none text-pure">04</dd>
                  <dt className="eyebrow mt-2 text-[0.5625rem] text-silver">Strategic categories</dt>
                </div>
              </dl>
              <Link href="/investor-challenge" onClick={onNavigate} className="group mt-4 inline-flex min-h-11 items-center gap-2 font-ui text-[0.8125rem] font-semibold text-pure">
                <span className="border-b border-silver/40 pb-0.5 transition-colors group-hover:border-pure">Take the Investor Challenge</span>
                <ArrowRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Directory + footer bar */}
          <div className="flex min-w-0 flex-col">
            <div className="grid flex-1 content-start gap-x-6 gap-y-7 p-7 sm:grid-cols-2 xl:grid-cols-4 xl:p-8">
              {SECTOR_GROUPS.map((g, gi) => {
                const sectors = INVESTMENT_SECTORS.filter((s) => s.group === g.id);
                return (
                  <section key={g.id} aria-labelledby={`${id}-${g.id}`}>
                    <div className="flex min-h-[2.75rem] items-end justify-between gap-3 border-b border-white/15 pb-3">
                      <p id={`${id}-${g.id}`}>
                        <Link href={categoryHref(g.id)} onClick={onNavigate} className="eyebrow inline-flex min-h-8 items-center gap-2.5 text-[0.6875rem] text-silver transition-colors hover:text-pure">
                          <span aria-hidden className="text-steel">{pad(gi + 1)}</span>
                          {g.filterLabel}
                        </Link>
                      </p>
                      <span aria-hidden className="pb-1 font-ui text-[0.6875rem] font-semibold tabular-nums text-silver/60">{pad(sectors.length)}</span>
                    </div>
                    <ul className="mt-2">
                      {sectors.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={sectorDeepLink(s.slug)}
                            onClick={onNavigate}
                            className="group/s relative flex min-h-9 items-center justify-between gap-2 py-1.5 pl-0 font-ui text-[0.875rem] font-medium leading-[1.25] text-platinum transition-[color,padding] duration-300 hover:pl-3 hover:text-pure focus-visible:pl-3"
                          >
                            <span aria-hidden className="absolute left-0 top-1/2 h-px w-0 bg-silver transition-[width] duration-300 group-hover/s:w-2 group-focus-visible/s:w-2" />
                            <span>{s.title}</span>
                            <ArrowUpRight aria-hidden strokeWidth={1.4} className="size-3.5 shrink-0 -translate-x-1 text-silver opacity-0 transition-[opacity,transform] duration-300 group-hover/s:translate-x-0 group-hover/s:opacity-100 group-focus-visible/s:translate-x-0 group-focus-visible/s:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
            <div className="flex items-center justify-between gap-6 border-t border-white/10 bg-white/[0.02] px-7 py-3 xl:px-8">
              <p className="hidden text-[0.75rem] leading-[1.4] text-silver/80 md:block">{INVESTMENT_SECTORS.length} sectors across four strategic categories.</p>
              <Link
                href="/investments"
                onClick={onNavigate}
                className="group ml-auto inline-flex min-h-11 items-center gap-2.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-pure"
              >
                <span className="border-b border-silver/40 pb-0.5 transition-colors group-hover:border-pure">View All Investments</span>
                <span className="grid size-7 place-items-center border border-white/25 transition-colors duration-300 group-hover:border-platinum group-hover:bg-platinum group-hover:text-obsidian">
                  <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Services: a lighter Frost White editorial directory of the nine areas of expertise. */
export function ServicesMega({ id, open, onNavigate }: PanelProps) {
  return (
    <div id={id} inert={!open} className={shell(open)}>
      <div className="overflow-hidden rounded-2xl border border-line bg-frost text-ink shadow-[0_24px_60px_-28px_rgba(9,13,17,0.55)]">
        <div className="grid lg:grid-cols-[minmax(0,2.9fr)_minmax(0,9.1fr)]">
          {/* Intro */}
          <div className="relative isolate flex flex-col justify-between overflow-hidden border-b border-line bg-pure/70 p-7 lg:border-b-0 lg:border-r xl:p-8">
            <Arcs className="-bottom-24 -left-28 size-[22rem] text-steel/[0.12]" />
            <div>
              <p className="eyebrow flex items-center gap-3 text-[0.625rem] text-steel">
                <span aria-hidden className="h-px w-6 bg-steel/60" />
                Our Services &amp; Expertise
              </p>
              <p className="mt-4 font-display text-[2rem] leading-[1.06] text-ink">Strategic Expertise.</p>
              <p className="mt-3 max-w-[17rem] text-[0.9375rem] leading-[1.45] text-muted">Explore our investment, corporate, and advisory capabilities.</p>
            </div>
            <div className="mt-8 border-t border-line pt-5">
              <dl className="hidden lg:block">
                <dd className="font-display text-[2rem] leading-none text-ink">09</dd>
                <dt className="eyebrow mt-2 text-[0.5625rem] text-steel">Areas of expertise</dt>
              </dl>
              <Link href="/service-navigator" onClick={onNavigate} className="group mt-4 inline-flex min-h-11 items-center gap-2 font-ui text-[0.8125rem] font-semibold text-ink">
                <span className="border-b border-ink/40 pb-0.5 transition-colors group-hover:border-ink">Which service fits you?</span>
                <ArrowRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Directory + footer bar */}
          <div className="flex min-w-0 flex-col">
            <ul className="grid flex-1 content-start gap-1 p-3 sm:grid-cols-2 xl:grid-cols-3 xl:p-4">
              {SERVICE_AREAS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={serviceDeepLink(s.slug)}
                    onClick={onNavigate}
                    className="group/s relative block h-full rounded-xl p-4 transition-[background-color,box-shadow] duration-300 hover:bg-pure hover:shadow-[0_10px_28px_-18px_rgba(9,13,17,0.35)] focus-visible:bg-pure"
                  >
                    <span className="flex items-baseline gap-3 pr-5">
                      <span aria-hidden className="font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-steel">{s.number}</span>
                      <span className="font-ui text-[0.9375rem] font-semibold leading-[1.25] text-ink transition-colors group-hover/s:text-steel">{s.title}</span>
                    </span>
                    <span className="mt-1.5 block pl-[1.65rem] text-[0.8125rem] leading-[1.4] text-muted">{s.capabilities.slice(0, 2).join(" · ")}</span>
                    <ArrowUpRight aria-hidden strokeWidth={1.4} className="absolute right-4 top-4 size-4 -translate-x-1 translate-y-1 text-steel opacity-0 transition-[opacity,transform] duration-300 group-hover/s:translate-x-0 group-hover/s:translate-y-0 group-hover/s:opacity-100 group-focus-visible/s:translate-x-0 group-focus-visible/s:translate-y-0 group-focus-visible/s:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-6 border-t border-line bg-pure/60 px-7 py-3 xl:px-8">
              <Link href="/contact" onClick={onNavigate} className="group inline-flex min-h-11 items-center gap-2 font-ui text-[0.8125rem] font-medium text-muted transition-colors hover:text-ink">
                Discuss a requirement
                <ArrowRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/services" onClick={onNavigate} className="group inline-flex min-h-11 items-center gap-2.5 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink">
                <span className="border-b border-ink/40 pb-0.5 transition-colors group-hover:border-ink">Explore All Services</span>
                <span className="grid size-7 place-items-center border border-ink/25 transition-colors duration-300 group-hover:border-obsidian group-hover:bg-obsidian group-hover:text-pure">
                  <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
