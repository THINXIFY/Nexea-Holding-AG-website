"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { NAV_CTA, NAV_ITEMS, NAV_LINKS, categoryHref, sectorDeepLink, serviceDeepLink, type MegaId, type NavItem } from "@/data/navigation";
import { INVESTMENT_SECTORS, SECTOR_GROUPS } from "@/data/investment-sectors";
import { SERVICE_AREAS } from "@/data/services";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { InvestmentsMega, ServicesMega } from "@/components/layout/MegaMenus";

const DESKTOP_NAV_QUERY = "(min-width: 1280px)";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const CLOSE_DELAY = 180;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isActive = (item: NavItem, pathname: string) =>
  item.href === "/" ? pathname === "/" : !!item.href && (pathname === item.href || pathname.startsWith(item.href + "/"));

/** Visible, non-inert focusable elements inside `root`. */
const focusables = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => !n.closest("[inert]") && n.getClientRects().length > 0);

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Open state is tied to the pathname it was opened on, so navigating always closes it without an effect.
  const [megaState, setMegaState] = useState<{ id: MegaId | null; path: string }>({ id: null, path: pathname });
  const [drawerState, setDrawerState] = useState<{ open: boolean; path: string }>({ open: false, path: pathname });
  const [group, setGroup] = useState<MegaId | null>(null);
  const [subGroup, setSubGroup] = useState<string | null>(null);

  const mega = megaState.path === pathname ? megaState.id : null;
  const open = drawerState.open && drawerState.path === pathname;

  const headerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Partial<Record<MegaId, HTMLButtonElement | null>>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hoverOpened = useRef(false);
  const firstRender = useRef(true);

  const setMega = useCallback((id: MegaId | null) => setMegaState({ id, path: pathname }), [pathname]);
  const setOpen = useCallback(
    (v: boolean) => {
      // Each opening starts from a clean, collapsed menu.
      if (v) {
        setGroup(null);
        setSubGroup(null);
      }
      setDrawerState({ open: v, path: pathname });
    },
    [pathname],
  );
  const closeMega = useCallback(() => setMega(null), [setMega]);
  const closeAll = useCallback(() => {
    setMega(null);
    setOpen(false);
  }, [setMega, setOpen]);

  const cancelClose = () => clearTimeout(closeTimer.current);
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      hoverOpened.current = false;
      setMega(null);
    }, CLOSE_DELAY);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Compact glass once the page has moved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mega menu: Escape closes (focus returns to its trigger) and an outside press closes.
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      triggerRefs.current[mega]?.focus();
      hoverOpened.current = false;
      setMega(null);
    };
    const onDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        hoverOpened.current = false;
        setMega(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [mega, setMega]);

  // Drawer open/close animation.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const items = panel.querySelectorAll("[data-menu-item]");
    const instant = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(panel, { autoAlpha: 1 });
        gsap.fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: instant ? 0 : 0.6, ease: "power3.inOut" });
        gsap.fromTo(items, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: instant ? 0 : 0.6, ease: "power3.out", stagger: instant ? 0 : 0.04, delay: instant ? 0 : 0.22 });
      } else {
        gsap.to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: instant ? 0 : 0.45, ease: "power3.inOut", onComplete: () => void gsap.set(panel, { autoAlpha: 0 }) });
      }
    }, panel);
    // Kill, don't revert: reverting would snap the panel shut before the closing tween starts.
    return () => ctx.kill();
  }, [open]);

  // Drawer: scroll lock, focus in, Escape, focus trap, focus restore.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    if (panel) focusables(panel)[0]?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const nodes = [toggleRef.current, ...focusables(panel)].filter((n): n is HTMLElement => !!n);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  // Never leave the drawer or a mega menu open after growing/shrinking across the desktop breakpoint.
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_NAV_QUERY);
    const onChange = () => {
      setDrawerState((s) => ({ ...s, open: false }));
      setMegaState((s) => ({ ...s, id: null }));
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const onTriggerClick = (id: MegaId) => {
    cancelClose();
    if (mega === id && !hoverOpened.current) {
      setMega(null);
    } else {
      hoverOpened.current = false;
      setMega(id);
    }
  };

  const solid = scrolled || open || mega !== null;

  const linkCls = "link-underline relative inline-flex items-center py-2 font-ui text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-300 hover:text-pure";

  return (
    <>
      <a
        href="#main"
        className="on-dark fixed left-4 top-4 z-[70] -translate-y-24 bg-platinum px-4 py-3 font-ui text-sm font-semibold text-obsidian focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 xl:pt-5">
        <div
          ref={headerRef}
          onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
          onPointerEnter={(e) => e.pointerType === "mouse" && cancelClose()}
          className="on-dark relative mx-auto max-w-[78rem]"
        >
          {/* Glass surface is its own layer: a backdrop-filter on an ancestor would break the panels inside. */}
          <div
            aria-hidden
            className={`absolute inset-0 rounded-2xl border backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ${
              solid ? "border-silver/20 bg-obsidian/85 shadow-[0_14px_40px_-20px_rgba(0,0,0,0.75)]" : "border-silver/10 bg-obsidian/40 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.6)]"
            }`}
          />
          <div className={`relative flex items-center justify-between gap-6 px-4 transition-[height] duration-500 sm:px-5 xl:px-6 ${scrolled ? "h-14" : "h-16"}`}>
            <Wordmark imageClassName={scrolled ? "h-8 md:h-9" : "h-9 md:h-10"} />

            <nav aria-label="Primary" className="hidden xl:block">
              <ul className="flex items-center gap-7 2xl:gap-8">
                {NAV_LINKS.map((item) => {
                  const active = isActive(item, pathname);
                  const color = active ? "text-pure" : "text-platinum";
                  if (!item.mega) {
                    return (
                      <li key={item.label} onPointerEnter={(e) => e.pointerType === "mouse" && closeSoon()}>
                        <Link href={item.href!} aria-current={active ? "page" : undefined} data-active={active} className={`${linkCls} ${color}`}>
                          {item.label}
                        </Link>
                      </li>
                    );
                  }
                  const id = item.mega;
                  const isOpen = mega === id;
                  const panelId = `mega-${id}`;
                  return (
                    <li
                      key={item.label}
                      className="flex items-center"
                      onPointerEnter={(e) => {
                        if (e.pointerType !== "mouse") return;
                        cancelClose();
                        if (!isOpen) hoverOpened.current = true;
                        setMega(id);
                      }}
                    >
                      <Link href={item.href!} aria-current={active ? "page" : undefined} data-active={active || isOpen} className={`${linkCls} ${isOpen ? "text-pure" : color}`}>
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        ref={(n) => {
                          triggerRefs.current[id] = n;
                        }}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        aria-label={`${item.label} menu`}
                        onClick={() => onTriggerClick(id)}
                        className="-mr-1 ml-0.5 grid size-8 place-items-center text-silver transition-colors duration-300 hover:text-pure"
                      >
                        <ChevronDown aria-hidden strokeWidth={1.5} className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {id === "investments" ? (
                        <InvestmentsMega id={panelId} open={isOpen} onNavigate={closeMega} />
                      ) : (
                        <ServicesMega id={panelId} open={isOpen} onNavigate={closeMega} />
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden xl:block" onPointerEnter={(e) => e.pointerType === "mouse" && closeSoon()}>
                <Button href={NAV_CTA.href} variant="solid-light" size="sm" arrow={false} sweep current={pathname === NAV_CTA.href} className="min-h-10! rounded-lg px-5!">
                  {NAV_CTA.label}
                </Button>
              </div>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="-mr-2 grid size-11 place-items-center text-pure xl:hidden"
              >
                {open ? <X aria-hidden strokeWidth={1.25} className="size-7" /> : <Menu aria-hidden strokeWidth={1.25} className="size-7" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        inert={!open}
        style={{ visibility: "hidden", clipPath: "inset(0% 0% 100% 0%)" }}
        className="on-dark fixed inset-0 z-40 h-dvh overflow-y-auto overscroll-contain bg-obsidian xl:hidden"
      >
        <div className="container-nx flex min-h-full flex-col pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[6rem]">
          <nav aria-label="Mobile" className="flex-1">
            <ul className="border-t border-white/10">
              {NAV_ITEMS.map((item, i) => {
                const num = (
                  <span aria-hidden className="w-7 shrink-0 font-ui text-xs tracking-[0.18em] text-steel">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                );
                const row = "flex w-full items-baseline gap-5 py-4 text-left font-display text-[1.875rem] leading-none text-pure transition-colors hover:text-platinum sm:py-5 sm:text-[2.25rem]";
                const current = isActive(item, pathname);
                if (!item.mega) {
                  return (
                    <li key={item.label} data-menu-item className="border-b border-white/10">
                      <Link href={item.href!} onClick={closeAll} aria-current={current ? "page" : undefined} className={row}>
                        {num}
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const id = item.mega;
                const expanded = group === id;
                const panelId = `m-${id}`;
                return (
                  <li key={item.label} data-menu-item className="border-b border-white/10">
                    <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setGroup(expanded ? null : id)} className={`${row} items-center`}>
                      {num}
                      <span className="flex-1">{item.label}</span>
                      <ChevronDown aria-hidden strokeWidth={1.4} className={`size-6 shrink-0 self-center text-silver transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                    </button>
                    <div id={panelId} inert={!expanded} className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="min-h-0 overflow-hidden">
                        {id === "investments" ? (
                          <div className="pb-4 pl-12">
                            <Link href="/investments" onClick={closeAll} className="flex min-h-12 items-center font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-pure">
                              View All Investments
                            </Link>
                            {SECTOR_GROUPS.map((g) => {
                              const subOpen = subGroup === g.id;
                              const sid = `m-sub-${g.id}`;
                              return (
                                <div key={g.id} className="border-t border-white/10">
                                  <button type="button" aria-expanded={subOpen} aria-controls={sid} onClick={() => setSubGroup(subOpen ? null : g.id)} className="flex min-h-12 w-full items-center justify-between gap-4 text-left font-ui text-[0.9375rem] font-semibold text-platinum">
                                    {g.filterLabel}
                                    <ChevronDown aria-hidden strokeWidth={1.5} className={`size-4 text-silver transition-transform duration-300 ${subOpen ? "rotate-180" : ""}`} />
                                  </button>
                                  <div id={sid} inert={!expanded || !subOpen} className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${subOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                    <ul className="min-h-0 overflow-hidden">
                                      <li>
                                        <Link href={categoryHref(g.id)} onClick={closeAll} className="flex min-h-11 items-center text-[0.9375rem] text-silver">
                                          All {g.filterLabel}
                                        </Link>
                                      </li>
                                      {INVESTMENT_SECTORS.filter((s) => s.group === g.id).map((s) => (
                                        <li key={s.slug}>
                                          <Link href={sectorDeepLink(s.slug)} onClick={closeAll} className="flex min-h-11 items-center text-[0.9375rem] text-platinum">
                                            {s.title}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <ul className="pb-4 pl-12">
                            <li>
                              <Link href="/services" onClick={closeAll} className="flex min-h-12 items-center font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-pure">
                                View All Services
                              </Link>
                            </li>
                            {SERVICE_AREAS.map((s) => (
                              <li key={s.slug} className="border-t border-white/10">
                                <Link href={serviceDeepLink(s.slug)} onClick={closeAll} className="flex min-h-12 items-center py-1 text-[0.9375rem] leading-snug text-platinum">
                                  {s.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
