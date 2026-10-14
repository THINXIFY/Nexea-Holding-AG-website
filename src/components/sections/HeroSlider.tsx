"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { HERO_DURATION_MS, HERO_SLIDES, type HeroSlide } from "@/data/hero-slides";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/Button";

type TextState = "active" | "leaving" | "idle";

/** Image layers stay fully visible underneath until the incoming one has finished fading in. */
const TRAIL_MS = 1400;
const COUNT = HERO_SLIDES.length;
const pad = (n: number) => String(n).padStart(2, "0");

const EASE = "ease-out-expo";

/** First-load stagger. Compressed against the slide-to-slide stagger so the hero is fully revealed in ~1.2s, not ~2.5s. */
const introDelay = (slideDelayMs: number) => Math.round((slideDelayMs - 300) * 0.4);

/** Content of one slide. Only the active slide is exposed to assistive technology and the tab order. */
function SlideCopy({ slide, index, state, intro }: { slide: HeroSlide; index: number; state: TextState; intro: boolean }) {
  const active = state === "active";
  const shown = state !== "idle";
  const first = intro && index === 0;
  // Staged entrance: eyebrow, headline lines, description, buttons. Transitions only run while active.
  const rise = (delayMs: number, introClass = "hero-intro-rise") => ({
    className: `${shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} ${active ? `transition-[opacity,transform] duration-[800ms] ${EASE} motion-reduce:transition-none` : ""} ${first ? introClass : ""}`,
    style: { ...(active ? { transitionDelay: `${delayMs}ms` } : null), ...(first ? { "--hero-delay": `${introDelay(delayMs)}ms` } : null) } as CSSProperties,
  });

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${COUNT}: ${slide.label}`}
      aria-hidden={!active}
      inert={!active}
      className={`[grid-area:1/1] ${state === "leaving" ? "-translate-y-5 opacity-0 transition-[opacity,transform] duration-[450ms] ease-in motion-reduce:transition-none" : ""} ${state === "idle" ? "pointer-events-none opacity-0" : ""}`}
    >
      <p {...rise(350)} className={`eyebrow flex items-center gap-4 text-platinum ${rise(350).className}`}>
        <span aria-hidden className="h-px w-10 shrink-0 bg-silver/70" />
        {slide.eyebrow}
      </p>

      <h2 className="mt-5 max-w-[64rem] font-display text-[clamp(2.5rem,11vw,3.6rem)] sm:text-[clamp(2.5rem,1.1rem+5.2vw,6.75rem)] leading-[1.02] tracking-[-0.012em] text-balance text-pure sm:mt-7">
        {slide.headline.map((line, i) => {
          const d = 480 + i * 130;
          return (
            <span key={line} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
              <span
                className={`block ${shown ? "translate-y-0" : "translate-y-[112%]"} ${active ? `transition-transform duration-[1000ms] ${EASE} motion-reduce:transition-none` : ""} ${first ? "hero-intro-line" : ""}`}
                style={{ ...(active ? { transitionDelay: `${d}ms` } : null), ...(first ? { "--hero-delay": `${introDelay(d)}ms` } : null) } as CSSProperties}
              >
                {line}
              </span>
            </span>
          );
        })}
      </h2>

      <p
        {...rise(980)}
        className={`mt-7 max-w-[34rem] border-l border-silver/45 pl-5 text-[1rem] leading-[1.6] text-platinum/90 sm:mt-9 sm:pl-6 sm:text-[1.0625rem] ${rise(980).className}`}
      >
        {slide.description}
      </p>

      <div {...rise(1120)} className={`mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4 ${rise(1120).className}`}>
        <Button href={slide.primary.href} variant="solid-light" arrowIcon="up-right" sweep className="w-full sm:w-auto">
          {slide.primary.label}
        </Button>
        <Button href={slide.secondary.href} variant="outline-light" sweep className="w-full sm:w-auto">
          {slide.secondary.label}
        </Button>
      </div>
    </div>
  );
}

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  /** Recently left slides, most recent first. Their images stay painted until the new image has faded in. */
  const [trail, setTrail] = useState<number[]>([]);
  const [prev, setPrev] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);
  const [intro, setIntro] = useState(true);
  const [armed, setArmed] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [userPaused, setUserPaused] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [offscreen, setOffscreen] = useState(false);

  const root = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const playing = !reduced && !userPaused;
  // The slider keeps moving whatever the pointer does. It only holds still for the visitor's own Pause, keyboard focus
  // inside it (a changing slide would pull focus from a button), a hidden tab, or when it is scrolled out of view.
  const paused = !playing || focusIn || hidden || offscreen;

  useEffect(() => () => clearTimeout(timer.current), []);

  // Load the other two photographs a few seconds after the page has loaded (autoplay reaches slide 2 at 7s), so they never
  // compete with the first photograph and the headline for bandwidth. A visitor who navigates sooner arms them instantly.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const arm = () => {
      t = setTimeout(() => setArmed(true), 3000);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", arm);
    };
  }, []);

  // No sliding while the tab is hidden or the hero is off screen.
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    const el = root.current;
    const io = el ? new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { threshold: 0.25 }) : null;
    if (el) io?.observe(el);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  const goTo = useCallback(
    (next: number, manual: boolean) => {
      const target = (next + COUNT) % COUNT;
      if (target === index) return;
      clearTimeout(timer.current);
      setIntro(false);
      setArmed(true);
      setTrail((t) => [index, ...t.filter((n) => n !== index && n !== target)].slice(0, COUNT - 1));
      setPrev(index);
      setIndex(target);
      setCycle((c) => c + 1);
      if (manual) setAnnounce(`Slide ${target + 1} of ${COUNT}: ${HERO_SLIDES[target].label}`);
      timer.current = setTimeout(() => {
        setTrail([]);
        setPrev(null);
      }, TRAIL_MS);
    },
    [index],
  );

  const next = useCallback((manual = true) => goTo(index + 1, manual), [goTo, index]);
  const previous = useCallback(() => goTo(index - 1, true), [goTo, index]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      previous();
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    // Only a clearly horizontal swipe changes the slide; vertical page scrolling is untouched.
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.6) (dx < 0 ? next : previous)();
  };

  const stateOf = (i: number): TextState => (i === index ? "active" : i === prev ? "leaving" : "idle");
  const visibleLayers = new Set([index, ...trail]);

  return (
    <section
      id="top"
      ref={root}
      aria-roledescription="carousel"
      aria-label="Featured"
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      // Keyboard focus only: a mouse click on a control must never freeze the slider.
      onFocus={(e) => setFocusIn((e.target as HTMLElement).matches(":focus-visible"))}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setFocusIn(false)}
      className="on-dark relative isolate flex min-h-[max(36rem,100svh)] flex-col overflow-hidden bg-obsidian text-pure [touch-action:pan-y]"
    >
      <h1 className="sr-only">Nexea Holding AG: Investing Beyond Boundaries.</h1>

      {/* Photographs: the new image fades in over the previous one (which stays painted underneath). */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-obsidian">
        {HERO_SLIDES.map((s, i) => {
          if (i !== 0 && !armed && !visibleLayers.has(i)) return null;
          const isActive = i === index;
          const inTrail = trail.indexOf(i);
          const z = isActive ? 30 : inTrail >= 0 ? 20 - inTrail : 0;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 ${isActive ? `opacity-100 transition-opacity duration-[1100ms] ease-in-out motion-reduce:transition-none` : inTrail >= 0 ? "opacity-100" : "opacity-0"}`}
              style={{ zIndex: z }}
            >
              <div
                className={`absolute inset-0 ${isActive ? `scale-100 transition-transform duration-[1800ms] ${EASE} motion-reduce:transition-none` : "scale-[1.04]"} ${intro && i === 0 ? "hero-intro-zoom" : ""} will-change-transform`}
                style={{ "--pm": s.image.position.mobile, "--pt": s.image.position.tablet, "--pd": s.image.position.desktop } as CSSProperties}
              >
                <Image
                  src={s.image.src}
                  alt=""
                  fill
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : "low"}
                  sizes="100vw"
                  quality={80}
                  className="object-cover [object-position:var(--pm)] md:[object-position:var(--pt)] lg:[object-position:var(--pd)]"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Art-directed Obsidian overlay: strongest behind the headline, light over the subject. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/85 via-obsidian/55 via-45% to-obsidian/5 max-md:from-obsidian/65 max-md:via-obsidian/50 max-md:to-obsidian/40" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-obsidian/70 to-transparent" />

      <div className="container-nx relative flex flex-1 flex-col pt-28 sm:pt-32 lg:pt-36">
        <div className="grid flex-1 content-center pb-8 sm:pb-10">
          {HERO_SLIDES.map((s, i) => (
            <SlideCopy key={s.id} slide={s} index={i} state={stateOf(i)} intro={intro} />
          ))}
        </div>

        {/* Controls */}
        <div className="border-t border-white/15 pb-5 pt-4 sm:pb-7 sm:pt-5">
          <div className="flex items-end gap-6 lg:gap-12">
            <ol className="grid flex-1 grid-cols-3 gap-2 md:gap-5 lg:gap-8">
              {HERO_SLIDES.map((s, i) => {
                const active = i === index;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i, true)}
                      aria-label={`Slide ${i + 1} of ${COUNT}: ${s.label}`}
                      aria-current={active ? "true" : undefined}
                      className="group flex w-full flex-col gap-3 py-2 text-left"
                    >
                      <span className={`hidden items-baseline gap-3 font-ui transition-colors duration-500 md:flex ${active ? "text-pure" : "text-silver/70 group-hover:text-platinum"}`}>
                        <span className="text-[0.6875rem] font-semibold tracking-[0.16em]">{pad(i + 1)}</span>
                        <span className="text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-transform duration-500 group-hover:translate-x-0.5">{s.label}</span>
                      </span>
                      <span aria-hidden className="relative block h-[2px] w-full overflow-hidden bg-white/20">
                        {active && (
                          <span
                            key={cycle}
                            className="hero-progress-fill absolute inset-0 bg-platinum"
                            style={{ "--hero-duration": `${HERO_DURATION_MS}ms`, animationPlayState: paused ? "paused" : "running" } as CSSProperties}
                            onAnimationEnd={(e) => {
                              if (e.animationName === "hero-progress" && playing) next(false);
                            }}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="flex items-center gap-2 sm:gap-3">
              <p aria-hidden className="mr-1 hidden font-ui text-[0.75rem] font-semibold tracking-[0.16em] text-silver sm:block">
                <span className="text-pure">{pad(index + 1)}</span> / {pad(COUNT)}
              </p>
              <button type="button" onClick={previous} aria-label="Previous slide" className="grid size-11 place-items-center border border-white/25 text-pure transition-colors duration-300 hover:border-pure hover:bg-white/10">
                <ArrowLeft aria-hidden strokeWidth={1.4} className="size-[1.125rem]" />
              </button>
              <button type="button" onClick={() => next()} aria-label="Next slide" className="grid size-11 place-items-center border border-white/25 text-pure transition-colors duration-300 hover:border-pure hover:bg-white/10">
                <ArrowRight aria-hidden strokeWidth={1.4} className="size-[1.125rem]" />
              </button>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setUserPaused((v) => !v)}
                  aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                  aria-pressed={userPaused}
                  className="grid size-11 place-items-center border border-white/25 text-pure transition-colors duration-300 hover:border-pure hover:bg-white/10"
                >
                  {userPaused ? <Play aria-hidden strokeWidth={1.4} className="size-4" /> : <Pause aria-hidden strokeWidth={1.4} className="size-4" />}
                </button>
              )}
            </div>
          </div>
          <p aria-hidden className="mt-3 font-ui text-[0.6875rem] font-semibold tracking-[0.16em] text-silver sm:hidden">
            <span className="text-pure">{pad(index + 1)}</span> / {pad(COUNT)} · {HERO_SLIDES[index].label}
          </p>
        </div>
      </div>

      {/* Announced only after a manual change, never during autoplay. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </section>
  );
}
