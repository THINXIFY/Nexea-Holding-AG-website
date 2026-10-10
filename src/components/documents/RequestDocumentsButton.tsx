"use client";

import { useState } from "react";
import { FileLock2 } from "lucide-react";
import { RequestDocumentsModal } from "@/components/documents/RequestDocumentsModal";

type Variant = "outline-dark" | "solid-dark" | "outline-light" | "solid-light";

const STYLES: Record<Variant, string> = {
  "outline-dark": "border-obsidian/30 text-obsidian hover:border-obsidian hover:bg-obsidian hover:text-pure",
  "solid-dark": "border-obsidian bg-obsidian text-pure hover:bg-steel-deep",
  "outline-light": "border-silver/45 text-pure hover:border-pure hover:bg-pure/10",
  "solid-light": "border-platinum bg-platinum text-obsidian hover:bg-pure",
};

/** "Request Private Documents": opens the OTP-verified document request dialog. */
export function RequestDocumentsButton({ variant = "outline-dark", className = "" }: { variant?: Variant; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`group inline-flex min-h-12 items-center justify-center gap-2.5 border px-5 font-ui text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-500 ${STYLES[variant]} ${className}`}
      >
        <FileLock2 aria-hidden strokeWidth={1.5} className="size-4" />
        Request Private Documents
      </button>
      {open && <RequestDocumentsModal onClose={() => setOpen(false)} />}
    </>
  );
}
