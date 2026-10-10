interface SectionLabelProps {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
  /** Spread onto the root, e.g. `data-anim` for GSAP. */
  [key: `data-${string}`]: string | boolean | undefined;
}

/** Small uppercase label preceded by a fine rule. */
export function SectionLabel({
  children,
  tone = "dark",
  className = "",
  ...rest
}: SectionLabelProps) {
  const color = tone === "dark" ? "text-steel" : "text-silver";
  const rule = tone === "dark" ? "bg-steel/60" : "bg-silver/60";
  return (
    <p className={`eyebrow flex items-center gap-4 ${color} ${className}`} {...rest}>
      <span aria-hidden className={`h-px w-10 shrink-0 ${rule}`} />
      {children}
    </p>
  );
}
