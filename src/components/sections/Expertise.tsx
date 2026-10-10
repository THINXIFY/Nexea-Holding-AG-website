"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { EXPERTISE } from "@/data/expertise";
import { Button } from "@/components/ui/Button";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Expertise() {
  const root = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(0);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";

    fadeUp(el.querySelector("[data-exp-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), {
      trigger: el,
      start,
      delay: 0.1,
      stagger: 0.13,
    });
    fadeUp(el.querySelectorAll("[data-exp-copy]"), {
      trigger: el,
      start: "top 72%",
      delay: 0.3,
      stagger: 0.12,
    });
    fadeUp(el.querySelectorAll("[data-exp-row]"), {
      trigger: el.querySelector("[data-exp-list]"),
      start: "top 88%",
      y: 18,
      stagger: 0.08,
      duration: 0.8,
    });
  });

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = EXPERTISE.length - 1;
    const target: Record<string, number> = {
      ArrowDown: i === last ? 0 : i + 1,
      ArrowUp: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (e.key in target) {
      e.preventDefault();
      buttons.current[target[e.key]]?.focus();
    }
  };

  return (
    <section
      id="expertise"
      ref={root}
      aria-labelledby="expertise-heading"
      className="relative bg-pure py-24 text-steel-deep sm:py-28 lg:py-36"
    >
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-16 lg:grid-cols-12 lg:gap-x-16 xl:gap-x-24">
        {/* LEFT — statement */}
        <div className="lg:col-span-5">
          <SectionLabel data-anim data-exp-label>
            Our Expertise
          </SectionLabel>
          <MaskedLines
            id="expertise-heading"
            lines={["Strategic Perspective.", "Beyond Investment."]}
            className="display-md mt-7 text-obsidian sm:mt-9"
          />

          <div className="mt-9 max-w-[34rem] space-y-6 sm:mt-11">
            <p data-anim data-exp-copy className="text-[1.0625rem] leading-[1.6] sm:text-[1.125rem]">
              Investment decisions and business development are shaped by more than capital alone.
              They require insight into markets, corporate structures, commercial opportunities,
              and the forces transforming global industries.
            </p>
            <p data-anim data-exp-copy className="text-[1.0625rem] leading-[1.6] sm:text-[1.125rem]">
              Alongside its investment activities, Nexea is developing a proposed strategic
              consulting offering focused on business evaluation, corporate strategy, transactions,
              and innovation.
            </p>
          </div>

          <div data-anim data-exp-copy className="mt-10 sm:mt-12">
            <Button href="/services" variant="solid-dark">Explore Our Expertise</Button>
          </div>
        </div>

        {/* RIGHT — service index */}
        <div className="lg:col-span-7">
          <p
            data-anim
            data-exp-copy
            className="eyebrow mb-5 flex items-center justify-between text-[0.6875rem] text-steel"
          >
            <span>Proposed consulting offering</span>
            <span aria-hidden>01 &ndash; 06</span>
          </p>

          <ul data-exp-list className="border-t border-obsidian/80">
            {EXPERTISE.map((item, i) => {
              const expanded = open === i;
              const btnId = `expertise-btn-${item.id}`;
              const panelId = `expertise-panel-${item.id}`;
              return (
                <li key={item.id} data-anim data-exp-row className="border-b border-line">
                  <h3>
                    <button
                      ref={(n) => {
                        buttons.current[i] = n;
                      }}
                      id={btnId}
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpen(expanded ? null : i)}
                      onKeyDown={(e) => onKeyDown(e, i)}
                      className="group flex w-full items-center gap-4 py-5 text-left sm:gap-6 sm:py-6"
                    >
                      <span
                        aria-hidden
                        className="w-8 shrink-0 font-ui text-xs font-semibold tracking-[0.16em] text-steel sm:w-9"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex-1 font-ui text-[1.0625rem] font-semibold leading-snug tracking-[-0.005em] transition-colors duration-300 sm:text-[1.125rem] ${
                          expanded ? "text-obsidian" : "text-steel-deep group-hover:text-obsidian"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        aria-hidden
                        className={`grid size-10 shrink-0 place-items-center border transition-colors duration-500 ${
                          expanded
                            ? "border-obsidian bg-obsidian text-pure"
                            : "border-line text-obsidian group-hover:border-obsidian"
                        }`}
                      >
                        <Plus
                          strokeWidth={1.4}
                          className={`size-[1.125rem] transition-transform duration-500 ease-out-expo ${
                            expanded ? "rotate-45" : "rotate-0"
                          }`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className={`grid transition-[grid-template-rows,visibility] duration-500 ease-out-expo ${
                      expanded ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[36rem] pb-7 pl-12 pr-14 text-base leading-[1.6] sm:pl-[3.75rem] sm:pr-16 sm:text-[1.0625rem]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p
            data-anim
            data-exp-copy
            className="mt-10 max-w-[32rem] border-l border-steel/60 pl-5 font-display text-[1.5rem] italic leading-[1.3] text-obsidian sm:text-[1.75rem]"
          >
            Connecting investment thinking with a broader understanding of business and innovation.
          </p>
        </div>
      </div>
    </section>
  );
}
