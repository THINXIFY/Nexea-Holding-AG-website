"use client";

import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_ENQUIRY, parseEnquiryParam, type EnquiryId } from "@/data/contact";

interface ContactState {
  type: EnquiryId;
  setType: (t: EnquiryId) => void;
  scrollToForm: () => void;
}

const Ctx = createContext<ContactState | null>(null);

export function useContact(): ContactState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useContact must be used inside <ContactProvider>");
  return v;
}

/**
 * Applies a valid `?type=` whenever it changes; invalid values are ignored. When the
 * URL also carries #enquiry-form (e.g. the "Explore Partnerships" CTA), the page is
 * brought to the form, because Next does not re-scroll for same-page query changes.
 */
function QuerySync({ onType, onScroll }: { onType: (t: EnquiryId) => void; onScroll: () => void }) {
  const params = useSearchParams();
  const raw = params.get("type");
  useEffect(() => {
    const t = parseEnquiryParam(raw);
    if (t) onType(t);
    if (window.location.hash === "#enquiry-form") {
      const id = window.setTimeout(onScroll, 520); // after the form re-lays out and ScrollTrigger refreshes
      return () => window.clearTimeout(id);
    }
  }, [raw, onType, onScroll]);
  return null;
}

/** One shared source of truth for the enquiry selector (section 02) and the form (section 03). */
export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [type, setTypeState] = useState<EnquiryId>(DEFAULT_ENQUIRY);
  const setType = useCallback((t: EnquiryId) => setTypeState(t), []);
  const scrollToForm = useCallback(() => {
    const el = document.getElementById("enquiry-form");
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);
  const value = useMemo(() => ({ type, setType, scrollToForm }), [type, setType, scrollToForm]);

  return (
    <Ctx.Provider value={value}>
      {/* useSearchParams needs a Suspense boundary; this renders nothing, so server HTML is unaffected. */}
      <Suspense fallback={null}>
        <QuerySync onType={setType} onScroll={scrollToForm} />
      </Suspense>
      {children}
    </Ctx.Provider>
  );
}
