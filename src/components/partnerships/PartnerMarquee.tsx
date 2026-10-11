"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { marqueePartners, PARTNER_PREVIEW_NOTICE, SHOW_PREVIEW_NOTICE, type Partner } from "@/data/partners";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Scroll speed. One full cycle (one set of logos) takes 30-38s, scaling with the number of logos. */
const SPEED_PX_PER_S = 55;
const MIN_CYCLE_S = 30;
const MAX_CYCLE_S = 38;
/** Every logo sits in an identical zone so the loop length is independent of image loading. */
const ZONE = "h-24 w-44 sm:h-28 sm:w-52 lg:w-60 xl:w-64";

function LogoZone({ partner, decorative }: { partner: Partner; decorative: boolean }) {
  const linked = Boolean(partner.website) && partner.approvedForPublication && !partner.isPlaceholder;
  const alt = decorative ? "" : partner.isPlaceholder ? `${partner.name} (placeholder logo)` : partner.name;
  const img = (
    <Image
      src={partner.logo}
      alt={alt}
      width={partner.width ?? 600}
      height={partner.height ?? 164}
      sizes="(min-width: 1024px) 176px, 160px"
      draggable={false}
      // Small files, and the loop must never reveal a logo that has not loaded yet.
      loading="eager"
      className={`h-10 w-auto max-w-full object-contain sm:h-11 lg:h-12 ${partner.keepColor ? "" : "[filter:grayscale(1)] group-hover/logo:[filter:grayscale(0)]"} opacity-90 transition-[opacity,filter,transform] duration-500 ease-out group-hover/logo:scale-[1.04] group-hover/logo:opacity-100 motion-reduce:transition-none`}
    />
  );
  return (
    <li className={`group/logo flex shrink-0 items-center justify-center border-r border-line px-4 ${ZONE}`}>
      {linked ? (
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${partner.name} (opens in a new tab)`}
          className="flex size-full items-center justify-center"
        >
          {img}
        </a>
      ) : (
        img
      )}
    </li>
  );
}

export function PartnerMarquee() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const applyRef = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);
  /** Enough repeated sets that the track is always at least one set wider than the viewport. */
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    pausedRef.current = paused;
    applyRef.current?.();
  }, [paused]);

  useMotion(root, () => {
    const el = root.current;
    const vp = viewport.current;
    const tr = track.current;
    const set = firstSet.current;
    if (!el || !vp || !tr || !set) return;

    const start = "top 80%";
    fadeUp(el.querySelector("[data-pm-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-pm-head]"), { trigger: el, start, delay: 0.25, stagger: 0.1 });
    fadeUp(el.querySelectorAll("[data-pm-strip]"), { trigger: el, start: "top 72%", delay: 0.15, y: 20 });

    let tween: gsap.core.Tween | null = null;
    let hover = false;
    let focus = false;
    let inView = true;
    let lastSet = 0;
    let lastVp = 0;

    const apply = () => {
      if (!tween) return;
      const stop = hover || focus || !inView || pausedRef.current;
      gsap.killTweensOf(tween);
      gsap.to(tween, { timeScale: stop ? 0 : 1, duration: 0.6, ease: "power2.out" });
    };
    applyRef.current = apply;

    const build = () => {
      const w = set.getBoundingClientRect().width;
      const vw = vp.clientWidth;
      if (w < 1 || (Math.abs(w - lastSet) < 0.5 && vw === lastVp && tween)) return;
      lastSet = w;
      lastVp = vw;
      const need = Math.max(2, Math.ceil(vw / w) + 1);
      setCopies((c) => (c === need ? c : need));
      const progress = tween ? tween.progress() : 0;
      const scale = tween ? tween.timeScale() : 1;
      tween?.kill();
      // The second set starts exactly one set-width after the first, so moving the track by -w and
      // restarting at 0 is visually identical: a seamless loop with no pause or snap.
      tween = gsap.fromTo(tr, { x: 0 }, { x: -w, duration: Math.min(MAX_CYCLE_S, Math.max(MIN_CYCLE_S, w / SPEED_PX_PER_S)), ease: "none", repeat: -1 });
      tween.progress(progress).timeScale(scale);
      apply();
    };

    const ro = new ResizeObserver(build);
    ro.observe(vp);
    ro.observe(set);
    const raf = requestAnimationFrame(build);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        apply();
      },
      { threshold: 0 },
    );
    io.observe(vp);

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      hover = true;
      apply();
    };
    const onLeave = () => {
      hover = false;
      apply();
    };
    const onFocusIn = () => {
      focus = true;
      apply();
    };
    const onFocusOut = () => {
      focus = vp.contains(document.activeElement);
      apply();
    };
    vp.addEventListener("pointerenter", onEnter);
    vp.addEventListener("pointerleave", onLeave);
    vp.addEventListener("focusin", onFocusIn);
    vp.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      vp.removeEventListener("pointerenter", onEnter);
      vp.removeEventListener("pointerleave", onLeave);
      vp.removeEventListener("focusin", onFocusIn);
      vp.removeEventListener("focusout", onFocusOut);
      if (tween) gsap.killTweensOf(tween);
      tween?.kill();
      gsap.set(tr, { clearProps: "transform" });
      applyRef.current = null;
    };
  });

  const listLabel = SHOW_PREVIEW_NOTICE ? "Partner logo placeholders (design preview)" : "Partner logos";

  return (
    <section ref={root} id="our-partners" aria-labelledby="pm-heading" className="relative scroll-mt-16 border-y border-line bg-frost py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel data-anim data-pm-label>Our Partner Network</SectionLabel>
            <MaskedLines id="pm-heading" lines={["Relationships That", "Create Possibility."]} className="display-lg mt-5 text-ink sm:mt-6" />
          </div>
          <div className="flex items-center gap-4 lg:pb-2">
            <p data-anim data-pm-head className="eyebrow text-[0.625rem] text-steel sm:text-[0.6875rem]">Our Partners &amp; Business Relationships</p>
            <button
              type="button"
              data-anim
              data-pm-head
              onClick={() => setPaused((v) => !v)}
              aria-pressed={paused}
              className="grid size-11 shrink-0 place-items-center border border-line bg-pure text-ink transition-colors duration-300 hover:border-obsidian hover:bg-obsidian hover:text-pure motion-reduce:hidden"
            >
              {paused ? <Play aria-hidden strokeWidth={1.5} className="size-4" /> : <Pause aria-hidden strokeWidth={1.5} className="size-4" />}
              <span className="sr-only">{paused ? "Resume logo scrolling" : "Pause logo scrolling"}</span>
            </button>
          </div>
        </div>

        <div data-anim data-pm-strip className="mt-8 border border-line bg-pure sm:mt-10">
          <div
            ref={viewport}
            className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none] motion-reduce:[-webkit-mask-image:none]"
          >
            <div ref={track} className="flex w-max will-change-transform">
              {Array.from({ length: copies }, (_, c) => (
                <ul
                  key={c}
                  ref={c === 0 ? firstSet : undefined}
                  aria-label={c === 0 ? listLabel : undefined}
                  aria-hidden={c === 0 ? undefined : true}
                  inert={c === 0 ? undefined : true}
                  className={`flex shrink-0 ${c === 0 ? "" : "motion-reduce:hidden"}`}
                >
                  {marqueePartners.map((p) => (
                    <LogoZone key={p.id} partner={p} decorative={c !== 0} />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>

        {SHOW_PREVIEW_NOTICE && (
          <p className="mt-4 text-[0.8125rem] leading-[1.5] text-muted sm:text-right">{PARTNER_PREVIEW_NOTICE}</p>
        )}
      </div>
    </section>
  );
}
