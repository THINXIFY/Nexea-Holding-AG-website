import type { ElementType } from "react";

interface MaskedLinesProps {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  /** Extra classes for each line's inner span. */
  lineClassName?: string;
  /** Per-line classes, applied after `lineClassName` (index-aligned with `lines`). */
  lineClasses?: readonly string[];
  /** Overrides the mask wrapper classes (e.g. extra descender room for very large type). */
  maskClassName?: string;
  id?: string;
}

/**
 * Headline split into authored lines, each inside an overflow-hidden mask so
 * GSAP can slide it up (`[data-mask-line]`). Mask padding keeps descenders
 * and italic overhangs from being clipped. The accessible text is the full
 * sentence; the per-line spans are presentational.
 */
export function MaskedLines({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
  lineClasses = [],
  maskClassName = "-mb-[0.14em] block overflow-hidden pb-[0.14em]",
  id,
}: MaskedLinesProps) {
  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden className="block">
        {lines.map((line, i) => (
          <span
            key={line}
            className={maskClassName}
          >
            <span data-anim data-mask-line className={`block ${lineClassName} ${lineClasses[i] ?? ""}`}>
              {line}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
