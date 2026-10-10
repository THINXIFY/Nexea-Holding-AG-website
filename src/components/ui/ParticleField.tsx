"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

const COLOR = "174, 190, 202"; // Arctic Silver
const MAX_DPR = 1.5;

const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * A quiet "global connectivity" layer: sparse silver particles drifting slowly,
 * with faint lines between near neighbours. Particles and links fade out over
 * the left-hand text zone so nothing clutters the copy.
 *
 * Lightweight canvas + requestAnimationFrame. Pauses when off-screen or when
 * the tab is hidden, caps pixel ratio, uses fewer particles on small screens
 * and is skipped entirely for visitors who prefer reduced motion.
 */
export function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let linkDist = 150;
    let raf = 0;
    let last = 0;
    let inView = true;
    let pageVisible = !document.hidden;

    const seed = () => {
      const small = w < 640;
      const count = Math.min(small ? 22 : 64, Math.round((w * h) / (small ? 16000 : 24000)));
      linkDist = small ? 110 : 150;
      particles = Array.from({ length: count }, () => {
        const speed = 0.006 + Math.random() * 0.016; // px per ms (≈ 0.4–1.3 px per frame)
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 0.6 + Math.random() * 1.3,
          a: 0.3 + Math.random() * 0.4,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    // 0.3 over the copy on the left, up to 1 over the architecture on the right
    const zone = (x: number) => 0.3 + 0.7 * smoothstep(0.3, 0.72, x / w);

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(48, t - last || 16);
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const zp = zone(p.x);
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDist * linkDist) continue;
          const k = 1 - Math.sqrt(d2) / linkDist;
          const alpha = k * 0.16 * Math.min(zp, zone(q.x));
          if (alpha < 0.01) continue;
          ctx.strokeStyle = `rgba(${COLOR}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${COLOR}, ${(p.a * 0.7 * zone(p.x)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const update = () => {
      const shouldRun = inView && pageVisible;
      if (shouldRun && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    const onVisibility = () => {
      pageVisible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);
    canvas.dataset.ready = "true";
    update();

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      delete canvas.dataset.ready;
      ctx.clearRect(0, 0, w, h);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none opacity-0 transition-opacity duration-[2500ms] data-[ready=true]:opacity-100 ${className}`}
    />
  );
}
