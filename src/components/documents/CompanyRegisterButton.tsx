"use client";

import { useState } from "react";
import { CompanyRegisterModal } from "@/components/documents/CompanyRegisterModal";

/** "Company Register Documents": opens the shared register-document viewer. Used on Contact and Impressum. */
export function CompanyRegisterButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`group inline-flex min-h-12 items-center justify-center gap-2.5 border border-obsidian/30 px-5 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-500 hover:border-obsidian hover:bg-obsidian hover:text-pure ${className}`}
      >
        Company Register Documents
      </button>
      {open && <CompanyRegisterModal onClose={() => setOpen(false)} />}
    </>
  );
}
