"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { MaskedLines } from "@/components/ui/MaskedLines";

export function ContactHero() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    if (!el) return;
    // Scale originates at the right edge so the NEXEA wordmark never drifts out of frame.
    gsap.fromTo("[data-ch-zoom]", { scale: 1.06 }, { scale: 1, duration: 2.6, ease: "power2.out", transformOrigin: "100% 40%" });
    fadeUp(el.querySelector("[data-ch-crumb]"), { delay: 0.1, y: 10, duration: 0.7 });
    fadeUp(el.querySelector("[data-ch-eyebrow]"), { delay: 0.2, y: 12, duration: 0.8 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { delay: 0.35, stagger: 0.14, duration: 1.3 });
    fadeUp(el.querySelectorAll("[data-ch-copy]"), { delay: 0.9, y: 18, stagger: 0.12 });
    fadeUp(el.querySelector("[data-ch-cue]"), { delay: 1.5, y: 0, duration: 1 });
    if (desktop) {
      gsap.to("[data-ch-parallax]", {
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }
  });

  return (
    <section ref={root} aria-labelledby="contact-hero-heading" className="on-dark relative isolate flex min-h-[32rem] flex-col overflow-hidden bg-obsidian text-pure md:min-h-[64svh]">
      <div data-ch-parallax aria-hidden className="absolute inset-x-0 -top-[6%] -z-20 h-[112%] will-change-transform">
        <div data-ch-zoom className="absolute inset-0 will-change-transform">
          <Image
            src="/images/contact-us.png"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[78%_50%] md:object-[100%_50%]"
          />
        </div>
      </div>
      {/* Overlay only behind the copy: the right 40% (with the wordmark) stays clear on desktop. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/95 via-obsidian/65 via-45% to-transparent to-65% max-md:from-obsidian/85 max-md:via-obsidian/70 max-md:to-obsidian/55" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-obsidian/90 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-obsidian/85 to-transparent" />

      <div className="container-nx relative flex flex-1 flex-col justify-end pb-8 pt-28 sm:pb-10 lg:pt-28">
        <nav data-anim data-ch-crumb aria-label="Breadcrumb" className="mb-5 font-ui text-[0.8125rem] tracking-[0.04em] text-silver sm:mb-6">
          <ol className="flex items-center gap-2.5">
            <li>
              <Link href="/" className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-pure">Home</Link>
            </li>
            <li aria-hidden className="text-steel">/</li>
            <li aria-current="page" className="text-pure">Contact</li>
          </ol>
        </nav>

        <p data-anim data-ch-eyebrow className="eyebrow mb-5 flex items-center gap-4 text-platinum">
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/70" />
          Nexea / Contact
        </p>

        <MaskedLines id="contact-hero-heading" as="h1" lines={["Let’s Start", "a Conversation."]} className="display-xl" />

        <div data-anim data-ch-copy className="mt-5 max-w-[30rem] space-y-3 text-[1.0625rem] leading-[1.55] text-platinum/90 sm:mt-6 sm:text-lg">
          <p className="font-medium text-pure">Meaningful opportunities begin with the right connection.</p>
          <p className="text-[1rem]">
            Whether you&rsquo;re introducing a business opportunity, exploring a strategic
            partnership, or making a corporate enquiry, we welcome relevant conversations.
          </p>
        </div>

        <p data-anim data-ch-copy className="eyebrow mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.6875rem] text-silver sm:mt-7 sm:text-xs">
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/50" />
          <span>Swiss Foundations</span>
          <span aria-hidden className="text-steel">·</span>
          <span>International Perspective</span>
        </p>

        <div data-anim data-ch-cue aria-hidden className="absolute bottom-10 right-5 hidden flex-col items-center gap-4 lg:flex xl:right-8">
          <span className="eyebrow text-[0.6875rem] text-silver [writing-mode:vertical-rl]">Scroll</span>
          <span className="relative block h-14 w-px overflow-hidden bg-silver/25">
            <span className="scroll-cue-run absolute inset-0 bg-platinum" />
          </span>
        </div>
      </div>
    </section>
  );
}
