"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { ADDRESS_LINES } from "@/data/company";

type Variant = "outline-dark" | "solid-dark";

/** Copies the registered address (one line per row) and announces the result to assistive tech. */
export function CopyAddressButton({ variant = "outline-dark", className = "" }: { variant?: Variant; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const text = ADDRESS_LINES.join("\n");
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      // Fallback for insecure contexts / older browsers.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(ta);
    }
    setState(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2600);
  };

  const styles =
    variant === "solid-dark"
      ? "border-obsidian bg-obsidian text-pure hover:bg-steel-deep"
      : "border-obsidian/30 text-obsidian hover:border-obsidian hover:bg-obsidian hover:text-pure";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex min-h-12 items-center justify-center gap-2.5 border px-5 font-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-500 ${styles} ${className}`}
      >
        {state === "copied" ? <Check aria-hidden strokeWidth={1.6} className="size-4" /> : <Copy aria-hidden strokeWidth={1.5} className="size-4" />}
        {state === "copied" ? "Copied" : "Copy Address"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "Registered address copied to the clipboard." : state === "failed" ? "The address could not be copied. Please select it manually." : ""}
      </span>
    </>
  );
}
