"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  value: string;
  /** Human name used in the accessible label, e.g. "Commercial register number". */
  label: string;
}

/** Small icon button that copies one identifier and announces the result. */
export function CopyValueButton({ value, label }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0";
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
    timer.current = setTimeout(() => setState("idle"), 2400);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 font-ui text-xs font-semibold text-steel transition-colors duration-300 hover:text-ink"
      >
        {state === "copied" ? <Check aria-hidden strokeWidth={1.6} className="size-4" /> : <Copy aria-hidden strokeWidth={1.4} className="size-4" />}
        <span aria-hidden className="hidden sm:inline">{state === "copied" ? "Copied" : "Copy"}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? `${label} copied to the clipboard.` : state === "failed" ? `Could not copy ${label}. Please select it manually.` : ""}
      </span>
    </>
  );
}
