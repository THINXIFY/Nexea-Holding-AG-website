"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { ArrowRight, Check, FileText, Loader2, Lock, Mail, ShieldCheck, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { COMPANY } from "@/data/company";
import { OtpCodeInput } from "@/components/documents/OtpCodeInput";

type View = "email" | "sending" | "otp" | "verifying" | "success" | "failure" | "retrying" | "unavailable";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const STEPS = [
  { title: "Verify your email", text: "We send a one-time code to your address." },
  { title: "Enter the code", text: "Six digits, valid for a short time." },
  { title: "Receive the documents", text: "Delivered to your inbox as PDF files." },
] as const;

const stepOf = (v: View) => (v === "email" || v === "sending" || v === "unavailable" ? 0 : v === "otp" || v === "verifying" ? 1 : 2);

const VERIFY_ERRORS: Record<string, string> = {
  invalid_code: "That code is not correct. Please check it and try again.",
  expired: "This code has expired. Please request a new one.",
  too_many_attempts: "Too many incorrect attempts. Please start again to receive a new code.",
  rate_limited: "Too many attempts. Please wait a little and try again.",
  not_found: "This request is no longer valid. Please start again.",
};

async function post(path: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/request-documents/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}

export function RequestDocumentsModal({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<View>("email");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [emailError, setEmailError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const overlay = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const busy = view === "sending" || view === "verifying" || view === "retrying";
  const step = stepOf(view);

  // Open: remember the opener, lock page scroll, animate in, focus the first field. Close: restore focus.
  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(card.current, { opacity: 0, y: 18, scale: 0.965 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" });
    });
    return () => {
      ctx.revert();
      html.style.overflow = prev[0];
      document.body.style.overflow = prev[1];
      opener.current?.focus?.();
    };
  }, []);

  // Each view change: soft entrance and focus the first meaningful control.
  useEffect(() => {
    const el = content.current;
    if (!el) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(el.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.05, overwrite: "auto" });
    }
    const target =
      el.querySelector<HTMLElement>("input:not([tabindex='-1'])") ?? el.querySelector<HTMLElement>("[data-autofocus], button:not([disabled]), a[href]");
    target?.focus({ preventScroll: true });
  }, [view]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const close = useCallback(() => {
    if (!busy) onClose();
  }, [busy, onClose]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab" || !card.current) return;
    const nodes = Array.from(card.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.getClientRects().length > 0 && n.tabIndex !== -1);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const submitEmail = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(value) || value.length > 254) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError(null);
    setView("sending");
    try {
      const r = await post("start", { email: value, website });
      if (r.ok && typeof r.data.requestId === "string") {
        setEmail(value);
        setRequestId(r.data.requestId);
        setCode("");
        setCodeError(null);
        setCooldown(Number(r.data.cooldownSeconds) || 60);
        setView("otp");
      } else if (r.status === 503) {
        setView("unavailable");
      } else {
        setEmailError(r.status === 429 ? "Too many requests. Please wait a little and try again." : r.data.error === "invalid_email" ? "Please enter a valid email address." : "We could not send a verification code. Please try again.");
        setView("email");
      }
    } catch {
      setEmailError("We could not reach the server. Please check your connection and try again.");
      setView("email");
    }
  };

  const verify = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!requestId || code.length !== 6 || busy) return;
    setCodeError(null);
    setView("verifying");
    try {
      const r = await post("verify", { requestId, code });
      if (r.ok) setView(r.data.status === "sent" ? "success" : "failure");
      else if (r.status === 503) setView("unavailable");
      else {
        const err = String(r.data.error ?? "");
        setCodeError(VERIFY_ERRORS[err] ?? "Something went wrong. Please try again.");
        if (err === "invalid_code") setCode("");
        setView("otp");
      }
    } catch {
      setCodeError("We could not reach the server. Please try again.");
      setView("otp");
    }
  };

  const retryDelivery = async () => {
    if (!requestId) return;
    setView("retrying");
    try {
      const r = await post("verify", { requestId, code });
      setView(r.ok && r.data.status === "sent" ? "success" : "failure");
    } catch {
      setView("failure");
    }
  };

  const resend = async () => {
    if (!requestId || cooldown > 0 || resending) return;
    setResending(true);
    setNotice(null);
    try {
      const r = await post("resend", { requestId });
      if (r.ok) {
        setCode("");
        setCodeError(null);
        setCooldown(Number(r.data.cooldownSeconds) || 60);
        setNotice("A new code is on its way.");
      } else setCodeError(r.status === 429 ? "Please wait a moment before requesting another code." : "We could not resend the code. Please try again shortly.");
    } catch {
      setCodeError("We could not reach the server. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const changeEmail = () => {
    setView("email");
    setRequestId(null);
    setCode("");
    setCodeError(null);
    setNotice(null);
    setCooldown(0);
  };

  const heading = "text-balance font-display text-[1.875rem] leading-[1.1] text-pure sm:text-[2.25rem]";
  const lead = "mt-3 text-[0.9375rem] leading-[1.6] text-platinum/90";
  const primary =
    "group inline-flex min-h-[3.25rem] w-full items-center justify-center gap-3 rounded-xl border border-platinum bg-platinum px-6 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-300 hover:bg-pure disabled:cursor-not-allowed disabled:opacity-45";
  const ghost =
    "inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl border border-silver/35 px-6 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-pure transition-colors duration-300 hover:border-pure hover:bg-white/[0.06]";

  return createPortal(
    <div
      ref={overlay}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      className="on-dark fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-obsidian/60 p-3 backdrop-blur-md sm:p-6"
    >
      {/* soft ambient light behind the glass */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-1/4 size-[28rem] rounded-full bg-steel/25 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -right-24 bottom-1/4 size-[26rem] rounded-full bg-silver/10 blur-[110px]" />

      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rd-heading"
        className="relative my-auto grid w-full max-w-[56rem] overflow-hidden rounded-3xl border border-silver/25 bg-[linear-gradient(135deg,rgba(24,33,42,0.72),rgba(9,13,17,0.78))] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
      >
        <button
          type="button"
          onClick={close}
          disabled={busy}
          aria-label="Close dialog"
          className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full text-silver transition-colors hover:bg-white/10 hover:text-pure disabled:opacity-40"
        >
          <X aria-hidden strokeWidth={1.5} className="size-5" />
        </button>

        {/* Brand panel */}
        <aside className="relative hidden flex-col justify-between border-r border-white/10 bg-white/[0.03] p-9 md:flex">
          <div>
            <Image src="/images/nexea-holding-logo-on-dark.png" alt="Nexea Holding AG" width={2022} height={537} sizes="180px" className="h-12 w-auto" />
            <p className="eyebrow mt-10 flex items-center gap-3 text-[0.6875rem] text-silver">
              <span aria-hidden className="h-px w-8 bg-silver/60" />
              Private Documents
            </p>
            <p className="mt-4 font-display text-[1.75rem] leading-[1.15] text-pure">Confidential documents, delivered securely.</p>
            <ol className="mt-9 space-y-5">
              {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <li key={s.title} className="flex gap-4" aria-current={active ? "step" : undefined}>
                    <span
                      className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border font-ui text-xs font-semibold transition-colors duration-500 ${
                        done ? "border-platinum bg-platinum text-obsidian" : active ? "border-platinum text-pure" : "border-white/20 text-silver/60"
                      }`}
                    >
                      {done ? <Check aria-hidden strokeWidth={2} className="size-4" /> : i + 1}
                    </span>
                    <span>
                      <span className={`block font-ui text-[0.9375rem] font-semibold transition-colors duration-500 ${active || done ? "text-pure" : "text-silver/70"}`}>{s.title}</span>
                      <span className="mt-0.5 block text-[0.8125rem] leading-[1.5] text-silver/80">{s.text}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="mt-10 flex gap-3 text-[0.75rem] leading-[1.55] text-silver/80">
            <ShieldCheck aria-hidden strokeWidth={1.4} className="mt-0.5 size-4 shrink-0 text-silver" />
            Documents are provided for information only and do not constitute an offer or advice.
          </p>
        </aside>

        {/* Interaction panel */}
        <div className="min-w-0 p-6 pt-7 sm:p-9 md:pt-10">
          {/* Compact brand + progress for small screens */}
          <div className="mb-6 flex items-center justify-between gap-4 pr-10 md:hidden">
            <Image src="/images/nexea-holding-logo-on-dark.png" alt="Nexea Holding AG" width={2022} height={537} sizes="120px" className="h-8 w-auto" />
            <div className="flex items-center gap-1.5" role="img" aria-label={`Step ${step + 1} of 3`}>
              {STEPS.map((s, i) => (
                <span key={s.title} aria-hidden className={`h-1 rounded-full transition-all duration-500 ${i === step ? "w-7 bg-platinum" : i < step ? "w-3 bg-platinum/70" : "w-3 bg-white/20"}`} />
              ))}
            </div>
          </div>

          <div ref={content} aria-live="polite">
            {(view === "email" || view === "sending") && (
              <form onSubmit={submitEmail} noValidate className="contents">
                <p className="eyebrow text-[0.6875rem] text-silver">Step 1 · Secure access</p>
                <h2 id="rd-heading" className={`${heading} mt-3`}>Request Private Documents</h2>
                <p className={lead}>Verify your email address and we will send the requested Nexea Holding AG documents directly to your inbox.</p>

                <div className="mt-7">
                  <label htmlFor="rd-email" className="block font-ui text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-silver">Email address</label>
                  <div className={`mt-2 flex items-center gap-3 rounded-xl border bg-white/[0.05] px-4 transition-[border-color,box-shadow] duration-300 focus-within:border-platinum focus-within:shadow-[0_0_0_3px_rgba(174,190,202,0.18)] ${emailError ? "border-[#e08a8a]/70" : "border-white/15"}`}>
                    <Mail aria-hidden strokeWidth={1.4} className="size-[1.125rem] shrink-0 text-silver" />
                    <input
                      id="rd-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      value={email}
                      maxLength={254}
                      disabled={view === "sending"}
                      aria-invalid={emailError ? true : undefined}
                      aria-describedby={emailError ? "rd-email-error" : undefined}
                      onChange={(e) => setEmail(e.target.value)}
                      className="min-h-[3.25rem] w-full bg-transparent text-[1rem] text-pure outline-none placeholder:text-silver/45 disabled:opacity-60"
                    />
                  </div>
                  {emailError && <p id="rd-email-error" role="alert" className="mt-2 text-[0.8125rem] font-medium text-[#f0a3a3]">{emailError}</p>}
                </div>

                {/* Honeypot: hidden from people and assistive tech */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>Website<input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
                </div>

                <button type="submit" disabled={view === "sending"} aria-busy={view === "sending"} className={`${primary} mt-6`}>
                  {view === "sending" ? (<><Loader2 aria-hidden strokeWidth={1.6} className="size-4 animate-spin motion-reduce:animate-none" />Sending code…</>) : (<>Send verification code<ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-300 group-hover:translate-x-1" /></>)}
                </button>
                <p className="mt-5 flex gap-2.5 text-[0.75rem] leading-[1.55] text-silver/80">
                  <Lock aria-hidden strokeWidth={1.4} className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    Your email address is used only to verify this request and deliver the documents.{" "}
                    <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline decoration-silver/50 underline-offset-4 hover:text-pure">Privacy Policy<span className="sr-only"> (opens in a new tab)</span></Link>
                  </span>
                </p>
              </form>
            )}

            {(view === "otp" || view === "verifying") && (
              <form onSubmit={verify} noValidate className="contents">
                <p className="eyebrow text-[0.6875rem] text-silver">Step 2 · Verification</p>
                <h2 id="rd-heading" className={`${heading} mt-3`}>Enter your verification code</h2>
                <p className={lead}>
                  We sent a six-digit code to <span className="[overflow-wrap:anywhere] font-semibold text-pure">{email}</span>
                </p>

                <div className={`mt-6 ${codeError ? "otp-shake" : ""}`} key={codeError ?? "ok"}>
                  <OtpCodeInput value={code} onChange={setCode} disabled={view === "verifying"} invalid={!!codeError} />
                </div>
                {codeError && <p role="alert" className="mt-3 text-[0.8125rem] font-medium text-[#f0a3a3]">{codeError}</p>}
                {notice && !codeError && <p role="status" className="mt-3 text-[0.8125rem] font-medium text-platinum">{notice}</p>}

                <p className="mt-5 text-[0.8125rem] leading-[1.55] text-silver/85">
                  <span className="font-semibold text-platinum">Not there yet?</span> Check your inbox, then your spam or junk folder. Delivery can take a minute.
                </p>

                <button type="submit" disabled={view === "verifying" || code.length !== 6} aria-busy={view === "verifying"} className={`${primary} mt-6`}>
                  {view === "verifying" ? (<><Loader2 aria-hidden strokeWidth={1.6} className="size-4 animate-spin motion-reduce:animate-none" />Verifying…</>) : (<>Verify and send documents<ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-300 group-hover:translate-x-1" /></>)}
                </button>

                <div className="mt-5 flex items-center justify-between gap-4 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.12em]">
                  <button type="button" onClick={changeEmail} disabled={view === "verifying"} className="min-h-11 text-silver underline-offset-4 transition-colors hover:text-pure hover:underline">Change email</button>
                  <button type="button" onClick={resend} disabled={cooldown > 0 || resending || view === "verifying"} className="min-h-11 text-pure transition-colors disabled:text-silver/50">
                    {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Resending…" : "Resend code"}
                  </button>
                </div>
              </form>
            )}

            {view === "success" && (
              <div className="contents">
                <span className="grid size-16 place-items-center rounded-full border border-platinum/60 bg-platinum/10">
                  <svg viewBox="0 0 24 24" className="size-8" fill="none" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#d6e0e8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="rd-check" />
                  </svg>
                </span>
                <p className="eyebrow mt-6 text-[0.6875rem] text-silver">Step 3 · Complete</p>
                <h2 id="rd-heading" className={`${heading} mt-3`}>Documents sent</h2>
                <p className={lead}>
                  The requested documents have been sent to <span className="[overflow-wrap:anywhere] font-semibold text-pure">{email}</span>.
                </p>
                <p className="mt-3 flex gap-2.5 text-[0.8125rem] leading-[1.55] text-silver/85">
                  <FileText aria-hidden strokeWidth={1.4} className="mt-0.5 size-4 shrink-0" />
                  Please check your inbox first. If you do not see it, look in your spam, junk or promotions folder.
                </p>
                <button type="button" data-autofocus onClick={onClose} className={`${primary} mt-7`}>Close</button>
              </div>
            )}

            {(view === "failure" || view === "retrying") && (
              <div className="contents">
                <h2 id="rd-heading" className={heading}>We could not send the documents</h2>
                <p className={lead}>Your email address was verified, but delivery did not complete. Please try again, or contact us and we will help directly.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button type="button" data-autofocus onClick={retryDelivery} disabled={view === "retrying"} className={primary}>
                    {view === "retrying" ? (<><Loader2 aria-hidden strokeWidth={1.6} className="size-4 animate-spin motion-reduce:animate-none" />Retrying…</>) : "Try again"}
                  </button>
                  <Link href="/contact" onClick={onClose} className={ghost}>Contact Nexea</Link>
                </div>
              </div>
            )}

            {view === "unavailable" && (
              <div className="contents">
                <h2 id="rd-heading" className={heading}>Requests are temporarily unavailable</h2>
                <p className={lead}>
                  We cannot process private document requests online right now. Please contact us at{" "}
                  <a href={`mailto:${COMPANY.email}`} className="[overflow-wrap:anywhere] font-semibold text-pure underline decoration-silver/50 underline-offset-4">{COMPANY.email}</a>{" "}
                  and we will follow up personally.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/contact" onClick={onClose} data-autofocus className={primary}>Contact Nexea</Link>
                  <button type="button" onClick={onClose} className={ghost}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
