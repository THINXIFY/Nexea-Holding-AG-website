"use client";

import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { ADDRESS_LINES, MAPS_EMBED_URL, MAPS_LINK_URL } from "@/data/company";
import { CopyAddressButton } from "@/components/contact/CopyAddressButton";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Location() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-lo-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-lo-copy]"), { trigger: el, start, delay: 0.25, stagger: 0.12 });
    const frame = el.querySelector("[data-lo-map]");
    if (frame) gsap.fromTo(frame, { clipPath: "inset(10% 0% 0% 0%)", autoAlpha: 1 }, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: frame, start: "top 88%", once: true } });
  });

  return (
    <section ref={root} aria-labelledby="lo-heading" className="relative bg-pure py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:items-center lg:gap-x-14">
        <div className="lg:col-span-5">
          <SectionLabel data-anim data-lo-label>Our Location</SectionLabel>
          <MaskedLines id="lo-heading" lines={["Rooted in", "Switzerland."]} className="display-md mt-5 text-ink sm:mt-6" />
          <p data-anim data-lo-copy className="mt-5 max-w-[30rem] text-[1.0625rem] leading-[1.6]">
            Located in Hergiswil, Nidwalden, Nexea Holding AG maintains its registered address
            within Switzerland&rsquo;s established corporate environment.
          </p>
          <address data-anim data-lo-copy className="mt-6 border-l border-steel/60 pl-5 font-ui text-[1rem] font-semibold not-italic leading-[1.55] text-ink">
            {ADDRESS_LINES.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <div data-anim data-lo-copy className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={MAPS_LINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 border border-obsidian bg-obsidian px-5 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-pure transition-colors duration-500 hover:bg-steel-deep"
            >
              View on Google Maps
              <ExternalLink aria-hidden strokeWidth={1.5} className="size-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <CopyAddressButton />
          </div>
          <p data-anim data-lo-copy className="mt-5 max-w-[28rem] text-[0.8125rem] leading-[1.5] text-muted">
            This is the company&rsquo;s registered address.
          </p>
        </div>

        <div data-anim data-lo-map className="lg:col-span-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-frost sm:aspect-[16/10]">
            <iframe
              title="Map showing the registered address of Nexea Holding AG, Sonnenbergstrasse 9, 6052 Hergiswil NW, Switzerland"
              src={MAPS_EMBED_URL}
              loading="lazy"
              // The map is supplementary (the address and a "View on Google Maps" link are provided), and the embed
              // has many internal tab stops: keep it out of the keyboard tab order so it can never trap focus.
              tabIndex={-1}
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
