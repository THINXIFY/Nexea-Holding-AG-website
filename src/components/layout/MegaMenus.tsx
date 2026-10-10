import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
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

/** Investments: dark, typography-led directory of the 15 proposed sectors in four categories. */
export function InvestmentsMega({ id, open, onNavigate }: PanelProps) {
  return (
    <div id={id} inert={!open} className={shell(open)}>
      <div className="on-dark overflow-hidden rounded-2xl border border-silver/20 bg-[#0c1116] text-pure shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
        <div className="grid lg:grid-cols-[minmax(0,3.4fr)_minmax(0,8.6fr)]">
          <div className="flex flex-col justify-between border-b border-white/10 bg-carbon/70 p-7 lg:border-b-0 lg:border-r xl:p-8">
            <div>
              <p className="eyebrow text-[0.625rem] text-silver">Nexea Investment Universe</p>
              <p className="mt-3 font-display text-[2rem] leading-[1.08] text-pure">Invest with Perspective.</p>
              <p className="mt-3 max-w-[18rem] text-[0.9375rem] leading-[1.55] text-platinum">
                Explore the sectors shaping long-term opportunities.
              </p>
              <dl className="mt-6 hidden gap-6 border-t border-white/10 pt-5 xl:flex">
                <div>
                  <dt className="eyebrow text-[0.5625rem] text-silver">Sectors of interest</dt>
                  <dd className="mt-1 font-display text-[1.5rem] leading-none text-pure">15</dd>
                </div>
                <div>
                  <dt className="eyebrow text-[0.5625rem] text-silver">Strategic categories</dt>
                  <dd className="mt-1 font-display text-[1.5rem] leading-none text-pure">Four</dd>
                </div>
              </dl>
            </div>
            <Link
              href="/investments"
              onClick={onNavigate}
              className="group mt-7 inline-flex min-h-11 items-center gap-2 self-start border-b border-silver/40 pb-1 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-pure transition-colors hover:border-pure"
            >
              View All Investments
              <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-x-6 gap-y-7 p-7 sm:grid-cols-2 xl:grid-cols-4 xl:p-8">
            {SECTOR_GROUPS.map((g) => (
              <section key={g.id} aria-labelledby={`${id}-${g.id}`}>
                <h3 id={`${id}-${g.id}`} className="border-b border-white/15 pb-3">
                  <Link href={categoryHref(g.id)} onClick={onNavigate} className="eyebrow inline-flex min-h-8 items-center text-[0.6875rem] text-silver transition-colors hover:text-pure">
                    {g.filterLabel}
                  </Link>
                </h3>
                <ul className="mt-2">
                  {INVESTMENT_SECTORS.filter((s) => s.group === g.id).map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={sectorDeepLink(s.slug)}
                        onClick={onNavigate}
                        className="group/s relative flex min-h-9 items-center py-1 pl-0 font-ui text-[0.875rem] font-medium leading-snug text-platinum transition-[color,padding] duration-300 hover:pl-3 hover:text-pure focus-visible:pl-3"
                      >
                        <span aria-hidden className="absolute left-0 top-1/2 h-px w-0 bg-silver transition-[width] duration-300 group-hover/s:w-2 group-focus-visible/s:w-2" />
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Services: a lighter Frost White editorial directory of the nine proposed areas of expertise. */
export function ServicesMega({ id, open, onNavigate }: PanelProps) {
  return (
    <div id={id} inert={!open} className={shell(open)}>
      <div className="overflow-hidden rounded-2xl border border-line bg-frost text-ink shadow-[0_24px_60px_-28px_rgba(9,13,17,0.55)]">
        <div className="grid lg:grid-cols-[minmax(0,3.6fr)_minmax(0,8.4fr)]">
          <div className="flex flex-col justify-between border-b border-line bg-pure/70 p-7 lg:border-b-0 lg:border-r xl:p-8">
            <div>
              <p className="eyebrow text-[0.625rem] text-steel">Our Services &amp; Expertise</p>
              <p className="mt-3 font-display text-[2rem] leading-[1.08] text-ink">Strategic Expertise.</p>
              <p className="mt-3 max-w-[18rem] text-[0.9375rem] leading-[1.55] text-muted">
                Explore our investment, corporate, and advisory capabilities.
              </p>
            </div>
            <div className="mt-7 flex flex-col items-start gap-1">
              <Link
                href="/services"
                onClick={onNavigate}
                className="group inline-flex min-h-11 items-center gap-2 border-b border-ink/40 pb-1 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
              >
                Explore All Services
                <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/contact" onClick={onNavigate} className="group inline-flex min-h-10 items-center gap-2 font-ui text-[0.8125rem] font-medium text-muted transition-colors hover:text-ink">
                Discuss a requirement
                <ArrowRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <ul className="grid gap-x-8 p-7 sm:grid-cols-2 xl:grid-cols-3 xl:p-8">
            {SERVICE_AREAS.map((s) => (
              <li key={s.slug} className="border-b border-line last:border-b-0 xl:[&:nth-last-child(-n+3)]:border-b-0">
                <Link href={serviceDeepLink(s.slug)} onClick={onNavigate} className="group/s relative block py-3.5">
                  <span aria-hidden className="absolute inset-y-3 -left-3 w-px origin-top scale-y-0 bg-steel transition-transform duration-300 group-hover/s:scale-y-100 group-focus-visible/s:scale-y-100" />
                  <span className="flex items-baseline gap-3">
                    <span aria-hidden className="font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-steel">{s.number}</span>
                    <span className="font-ui text-[0.9375rem] font-semibold leading-snug text-ink transition-colors group-hover/s:text-steel">{s.title}</span>
                  </span>
                  <span className="mt-1 block pl-[1.65rem] text-[0.8125rem] leading-[1.4] text-muted">{s.capabilities.slice(0, 2).join(" · ")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
