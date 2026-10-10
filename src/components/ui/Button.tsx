import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { UNAVAILABLE_HINT } from "@/data/navigation";

type Variant = "solid-light" | "outline-light" | "solid-dark" | "outline-dark";
type Size = "md" | "sm";

const VARIANTS: Record<Variant, { base: string; hover: string }> = {
  // For dark (obsidian) backgrounds
  "solid-light": {
    base: "bg-platinum text-obsidian border-platinum",
    hover: "hover:bg-pure hover:border-pure",
  },
  "outline-light": {
    base: "text-pure border-silver/45",
    hover: "hover:border-pure hover:bg-pure/10",
  },
  // For light backgrounds
  "solid-dark": {
    base: "bg-obsidian text-pure border-obsidian",
    hover: "hover:bg-steel-deep hover:border-steel-deep",
  },
  "outline-dark": {
    base: "text-obsidian border-obsidian/30",
    hover: "hover:bg-obsidian hover:text-pure hover:border-obsidian",
  },
};

const SWEEP: Record<Variant, string> = {
  "solid-light": "bg-pure",
  "outline-light": "bg-pure/12",
  "solid-dark": "bg-steel-deep",
  "outline-dark": "bg-obsidian/6",
};

const SIZES: Record<Size, string> = {
  md: "min-h-14 px-7 py-3.5 text-[0.8125rem]",
  sm: "min-h-11 px-5 py-2.5 text-xs",
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Omit while the destination page does not exist yet; renders an inert, labelled button. */
  href?: string;
  arrow?: boolean;
  /** Direction of the trailing arrow. */
  arrowIcon?: "right" | "up-right";
  className?: string;
  onDark?: boolean;
  /** Opt-in hover: a tinted layer slides across the button. */
  sweep?: boolean;
  /** Marks the button as the current page for assistive technology. */
  current?: boolean;
}

export function Button({
  children,
  variant = "solid-dark",
  size = "md",
  href,
  arrow = true,
  arrowIcon = "right",
  className = "",
  onDark,
  sweep = false,
  current = false,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const dark = onDark ?? variant.endsWith("light");
  const common = `group relative isolate overflow-hidden inline-flex items-center justify-center gap-3 border font-ui font-semibold uppercase leading-snug tracking-[0.12em] text-center transition-colors duration-500 ${SIZES[size]} ${v.base} ${dark ? "on-dark" : ""} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow &&
        (arrowIcon === "up-right" ? (
          <ArrowUpRight
            aria-hidden
            strokeWidth={1.5}
            className="size-[1.1em] shrink-0 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        ) : (
          <ArrowRight
            aria-hidden
            strokeWidth={1.5}
            className="size-[1.1em] shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
          />
        ))}
    </>
  );

  if (!href) {
    return (
      <button
        type="button"
        disabled
        title={UNAVAILABLE_HINT}
        className={`${common} cursor-not-allowed opacity-55`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`${common} ${v.hover}`}>
      {sweep && (
        <span
          aria-hidden
          className={`absolute inset-0 -z-10 -translate-x-full transition-transform duration-700 ease-out-expo group-hover:translate-x-0 ${SWEEP[variant]}`}
        />
      )}
      {content}
    </Link>
  );
}
