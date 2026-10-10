import { gsap, MOTION } from "@/lib/gsap";

/**
 * Reusable GSAP building blocks. Every function must be called inside a
 * `useMotion` setup callback so the resulting tweens / ScrollTriggers are
 * collected by the surrounding gsap context and reverted on unmount or when
 * a media query stops matching.
 *
 * Elements animated here carry `data-anim`, which keeps them hidden (via CSS)
 * between first paint and hydration; each helper sets the visible end-state
 * explicitly with `autoAlpha`.
 */

type Targets = gsap.TweenTarget;

interface TriggerOptions {
  /** Element whose scroll position starts the animation. Omit to play immediately. */
  trigger?: Element | null;
  start?: string;
  delay?: number;
}

const scrollConfig = (o: TriggerOptions) =>
  o.trigger
    ? { trigger: o.trigger, start: o.start ?? MOTION.start, once: true }
    : undefined;

/** Masked headline reveal: each line slides up out of an overflow-hidden mask. */
export function revealLines(
  lines: Targets,
  o: TriggerOptions & { duration?: number; stagger?: number } = {},
) {
  return gsap.fromTo(
    lines,
    { yPercent: 112, autoAlpha: 1 },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: o.duration ?? MOTION.reveal,
      ease: MOTION.ease,
      stagger: o.stagger ?? 0.12,
      delay: o.delay ?? 0,
      scrollTrigger: scrollConfig(o),
    },
  );
}

/** Soft text / block entrance. */
export function fadeUp(
  targets: Targets,
  o: TriggerOptions & { y?: number; duration?: number; stagger?: number } = {},
) {
  return gsap.fromTo(
    targets,
    { y: o.y ?? 28, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: o.duration ?? MOTION.fade,
      ease: MOTION.easeSoft,
      stagger: o.stagger ?? MOTION.stagger,
      delay: o.delay ?? 0,
      scrollTrigger: scrollConfig(o),
    },
  );
}

/** Architectural image reveal: a clip-path mask opens upward while the image settles. */
export function revealImage(
  frame: Element,
  image: Element | null,
  o: TriggerOptions & { duration?: number } = {},
) {
  const duration = o.duration ?? 1.4;
  const tl = gsap.timeline({
    delay: o.delay ?? 0,
    scrollTrigger: scrollConfig({ trigger: o.trigger ?? frame, start: o.start }),
  });
  tl.fromTo(
    frame,
    { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 1 },
    { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration, ease: "power3.inOut" },
  );
  if (image) {
    tl.fromTo(
      image,
      { scale: 1.18 },
      { scale: 1, duration: duration + 0.4, ease: MOTION.ease },
      0,
    );
  }
  return tl;
}

/**
 * Subtle vertical parallax. `el` must be taller than its clipping parent
 * (e.g. `h-[120%] -top-[10%]`) so the travel never exposes an edge.
 */
export function parallax(
  el: Element,
  o: { amount?: number; trigger?: Element | null } = {},
) {
  const amount = o.amount ?? 8;
  return gsap.fromTo(
    el,
    { yPercent: -amount },
    {
      yPercent: amount,
      ease: "none",
      scrollTrigger: {
        trigger: o.trigger ?? el.parentElement ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}

/**
 * Very light pointer-driven 3D tilt. Returns a cleanup function that removes
 * the listeners; return it from the `useMotion` setup callback.
 */
export function tilt(el: HTMLElement, o: { max?: number } = {}) {
  const max = o.max ?? 2.2;
  gsap.set(el, { transformPerspective: 1100, transformOrigin: "50% 50%" });
  const rx = gsap.quickTo(el, "rotationX", { duration: 0.9, ease: "power3.out" });
  const ry = gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power3.out" });

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry(px * max * 2);
    rx(-py * max * 2);
  };
  const onLeave = () => {
    rx(0);
    ry(0);
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
  };
}
