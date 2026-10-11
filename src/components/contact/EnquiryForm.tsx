"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Loader2, Lock } from "lucide-react";
import { fadeUp, revealLines } from "@/lib/animations";
import { useMotion } from "@/hooks/useMotion";
import { COMPANY } from "@/data/company";
import { ENQUIRY_TYPES, SECTOR_OPTIONS, enquiryById, isEnquiryId } from "@/data/contact";
import { LIMITS, sanitize, validate, type FieldErrors, type FieldName } from "@/lib/contact-validation";
import { useContact } from "@/components/contact/ContactProvider";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Values {
  name: string;
  email: string;
  company: string;
  country: string;
  sector: string;
  subject: string;
  message: string;
  privacy: boolean;
}
const EMPTY: Values = { name: "", email: "", company: "", country: "", sector: "", subject: "", message: "", privacy: false };

type Status = "idle" | "submitting" | "success" | "error";

const inputBase =
  "block w-full min-h-12 border bg-pure px-3.5 font-body text-[1rem] text-ink placeholder:text-muted/60 transition-colors duration-300 hover:border-steel focus-visible:border-obsidian";
const border = (bad: boolean) => (bad ? "border-[#9f2d2d]" : "border-line");

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: (a: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; "aria-required"?: boolean }) => ReactNode;
}
function Field({ id, label, required, error, hint, children }: FieldProps) {
  const describedBy = [error ? `${id}-error` : "", hint ? `${id}-hint` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-ui text-[0.8125rem] font-semibold text-ink">
        {label}
        {required ? (
          <>
            <span aria-hidden className="ml-0.5 text-[#9f2d2d]">*</span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="ml-1.5 font-normal text-muted">(optional)</span>
        )}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy, "aria-required": required || undefined })}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] leading-[1.4] text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.8125rem] font-medium leading-[1.4] text-[#9f2d2d]">
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm() {
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number>(0);
  const uid = useId().replace(/:/g, "");
  const { type, setType, draft } = useContact();

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState<string>("");
  const [website, setWebsite] = useState(""); // honeypot: real visitors never see or fill it

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // A consultation request from the Service Navigator suggests a subject and message. It only fills empty fields,
  // so anything the visitor has already typed is never overwritten.
  const [appliedDraft, setAppliedDraft] = useState<typeof draft>(null);
  if (draft && draft !== appliedDraft) {
    // Adjusting state while rendering (React's supported pattern for state derived from props/context).
    setAppliedDraft(draft);
    setValues((p) => ({ ...p, subject: p.subject.trim() ? p.subject : draft.subject, message: p.message.trim() ? p.message : draft.message }));
  }

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const start = "top 80%";
    fadeUp(el.querySelector("[data-ef-label]"), { trigger: el, start, y: 14 });
    revealLines(el.querySelectorAll("[data-mask-line]"), { trigger: el, start, delay: 0.1, stagger: 0.13 });
    fadeUp(el.querySelectorAll("[data-ef-copy]"), { trigger: el, start, delay: 0.25, stagger: 0.12 });
    // Only the panel surface eases in: individual fields are never animated or hidden.
    fadeUp(el.querySelector("[data-ef-panel]"), { trigger: el.querySelector("[data-ef-panel]"), start: "top 90%", y: 18, duration: 0.8 });
  });

  const selected = enquiryById(type);
  const id = (n: string) => `${uid}-${n}`;

  const setField = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((p) => ({ ...p, [k]: v }));
    // After a failed attempt, clear a field's error as soon as the visitor edits it.
    if (errors[k as FieldName]) setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const onText = (k: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setField(k, e.target.value as never);

  const payload = () => ({ ...values, type });

  const focusFirstError = (errs: FieldErrors) => {
    const order: FieldName[] = ["name", "email", "company", "country", "type", "sector", "subject", "message", "privacy"];
    const first = order.find((k) => errs[k]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`#${id(first)}`);
    el?.focus();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    const data = sanitize(payload());
    const errs = validate(data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setBanner("Please correct the highlighted fields and try again.");
      setStatus("idle");
      requestAnimationFrame(() => focusFirstError(errs));
      return;
    }
    setErrors({});
    setBanner("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload(), website, startedAt: startedAt.current }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: FieldErrors };
      if (res.ok && body.ok) {
        setStatus("success");
        setValues(EMPTY);
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }
      if (res.status === 422 && body.errors) {
        setErrors(body.errors);
        setBanner("Please correct the highlighted fields and try again.");
        setStatus("idle");
        requestAnimationFrame(() => focusFirstError(body.errors as FieldErrors));
        return;
      }
      setStatus("error"); // data is preserved: `values` is untouched
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setBanner("");
    startedAt.current = Date.now();
  };

  const submitting = status === "submitting";

  return (
    <section id="enquiry-form" ref={root} aria-labelledby="ef-heading" className="relative scroll-mt-20 bg-pure py-14 text-muted sm:py-16 lg:py-20">
      <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:gap-x-12">
        {/* Left: introduction + selected summary */}
        <div className="lg:col-span-4">
          <SectionLabel data-anim data-ef-label>Send an Enquiry</SectionLabel>
          <MaskedLines id="ef-heading" lines={["Tell Us About", "Your Enquiry."]} className="display-md mt-5 text-ink sm:mt-6" />
          <p data-anim data-ef-copy className="mt-5 max-w-[26rem] text-[1.0625rem] leading-[1.6]">
            Share a few details about your enquiry, and our team can review your message and
            determine the appropriate next step.
          </p>
          <div data-anim data-ef-copy aria-live="polite" className="mt-7 border border-line bg-frost p-5">
            <p className="eyebrow text-[0.625rem] text-steel">Selected enquiry type</p>
            <p data-testid="selected-title" className="mt-2 font-display text-[1.375rem] leading-[1.2] text-ink">{selected.title}</p>
            <p className="mt-1.5 text-[0.875rem] leading-[1.5]">You can change the enquiry type above or in the form at any time.</p>
          </div>
        </div>

        {/* Right: form panel */}
        <div data-anim data-ef-panel className="border border-line bg-pure p-5 sm:p-8 lg:col-span-8">
          {status === "success" ? (
            <div ref={successRef} tabIndex={-1} role="status" data-testid="success" className="py-6 outline-none sm:py-10">
              <CheckCircle2 aria-hidden strokeWidth={1.2} className="size-10 text-steel" />
              <h3 className="mt-5 font-display text-[1.75rem] leading-[1.2] text-ink">Thank you for contacting Nexea Holding AG.</h3>
              <p className="mt-3 max-w-[34rem] text-[1.0625rem] leading-[1.6]">
                Your enquiry has been received. If a response is appropriate, a representative may
                contact you using the details provided.
              </p>
              <button type="button" onClick={reset} className="mt-7 inline-flex min-h-12 items-center border border-obsidian/30 px-5 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-500 hover:border-obsidian hover:bg-obsidian hover:text-pure">
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-form-desc`} data-testid="enquiry-form">
              <h3 className="font-display text-[1.75rem] leading-[1.2] text-ink">Your Enquiry</h3>
              <p id={`${uid}-form-desc`} className="mt-1.5 text-[0.9375rem] leading-[1.5]">
                Please provide accurate contact details and a concise description of your request.
              </p>

              {banner && (
                <p role="alert" className="mt-5 border-l-2 border-[#9f2d2d] bg-frost px-4 py-3 text-[0.9375rem] font-medium leading-[1.45] text-ink">
                  {banner}
                </p>
              )}
              {status === "error" && (
                <p role="alert" data-testid="submit-error" className="mt-5 border-l-2 border-[#9f2d2d] bg-frost px-4 py-3 text-[0.9375rem] leading-[1.5] text-ink">
                  We couldn&rsquo;t submit your enquiry at this time. Please try again or contact us
                  directly at{" "}
                  <a href={`mailto:${COMPANY.email}`} className="font-semibold underline underline-offset-4 hover:text-steel">
                    {COMPANY.email}
                  </a>
                  .
                </p>
              )}

              {/* Honeypot: visually hidden, skipped by keyboard and assistive tech */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor={id("website")}>Website</label>
                <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <fieldset className="mt-6 min-w-0 border-0 p-0">
                <legend className="sr-only">Contact information</legend>
                <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                  <Field id={id("name")} label="Full Name" required error={errors.name}>
                    {(a) => <input {...a} name="name" type="text" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={onText("name")} placeholder="Your full name" className={`${inputBase} ${border(a["aria-invalid"])}`} />}
                  </Field>
                  <Field id={id("email")} label="Email Address" required error={errors.email}>
                    {(a) => <input {...a} name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={onText("email")} placeholder="name@company.com" className={`${inputBase} ${border(a["aria-invalid"])}`} />}
                  </Field>
                  <Field id={id("company")} label="Company / Organization" error={errors.company}>
                    {(a) => <input {...a} name="company" type="text" autoComplete="organization" maxLength={LIMITS.company} value={values.company} onChange={onText("company")} placeholder="Company name" className={`${inputBase} ${border(a["aria-invalid"])}`} />}
                  </Field>
                  <Field id={id("country")} label="Country / Region" error={errors.country}>
                    {(a) => <input {...a} name="country" type="text" autoComplete="country-name" maxLength={LIMITS.country} value={values.country} onChange={onText("country")} placeholder="e.g. Switzerland" className={`${inputBase} ${border(a["aria-invalid"])}`} />}
                  </Field>
                </div>
              </fieldset>

              <fieldset className="mt-5 min-w-0 border-0 p-0">
                <legend className="sr-only">Enquiry information</legend>
                <div className="space-y-5">
                  <Field id={id("type")} label="Enquiry Type" required error={errors.type}>
                    {(a) => (
                      <div className="relative">
                        <select
                          {...a}
                          name="type"
                          value={type}
                          onChange={(e) => {
                            if (isEnquiryId(e.target.value)) setType(e.target.value);
                            if (errors.type) setErrors((p) => ({ ...p, type: undefined }));
                          }}
                          className={`${inputBase} ${border(a["aria-invalid"])} appearance-none pr-10`}
                        >
                          {ENQUIRY_TYPES.map((t) => (
                            <option key={t.id} value={t.id}>{t.formLabel}</option>
                          ))}
                        </select>
                        <ChevronDown aria-hidden strokeWidth={1.4} className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-steel" />
                      </div>
                    )}
                  </Field>

                  {type === "investment" && (
                    <Field id={id("sector")} label="Investment Sector" error={errors.sector} hint="Optional. Choose the sector closest to your proposal.">
                      {(a) => (
                        <div className="relative">
                          <select {...a} name="sector" value={values.sector} onChange={onText("sector")} className={`${inputBase} ${border(a["aria-invalid"])} appearance-none pr-10`}>
                            <option value="">Select a sector (optional)</option>
                            {SECTOR_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown aria-hidden strokeWidth={1.4} className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-steel" />
                        </div>
                      )}
                    </Field>
                  )}

                  <Field id={id("subject")} label="Subject" required error={errors.subject}>
                    {(a) => <input {...a} name="subject" type="text" maxLength={LIMITS.subject} value={values.subject} onChange={onText("subject")} placeholder="Briefly describe your enquiry" className={`${inputBase} ${border(a["aria-invalid"])}`} />}
                  </Field>

                  <Field id={id("message")} label="Your Message" required error={errors.message} hint={`${values.message.length} / ${LIMITS.message} characters`}>
                    {(a) => <textarea {...a} name="message" rows={6} maxLength={LIMITS.message} value={values.message} onChange={onText("message")} placeholder="Tell us how we can help…" className={`${inputBase} ${border(a["aria-invalid"])} resize-y py-3 leading-[1.5]`} />}
                  </Field>
                </div>
              </fieldset>

              <div className="mt-5">
                <div className="flex items-start gap-3">
                  <input
                    id={id("privacy")}
                    name="privacy"
                    type="checkbox"
                    checked={values.privacy}
                    onChange={(e) => setField("privacy", e.target.checked)}
                    aria-required="true"
                    aria-invalid={Boolean(errors.privacy)}
                    aria-describedby={errors.privacy ? id("privacy-error") : undefined}
                    className="mt-0.5 size-5 shrink-0 cursor-pointer accent-obsidian"
                  />
                  <label htmlFor={id("privacy")} className="cursor-pointer text-[0.9375rem] leading-[1.5] text-ink">
                    I acknowledge that my information will be handled in accordance with the
                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline decoration-silver underline-offset-4 transition-colors hover:text-steel">Nexea Holding AG Privacy Policy<span className="sr-only"> (opens in a new tab)</span></a>.<span aria-hidden className="ml-0.5 text-[#9f2d2d]">*</span>
                    <span className="sr-only"> (required)</span>
                  </label>
                </div>
                {errors.privacy && <p id={id("privacy-error")} className="mt-1.5 pl-8 text-[0.8125rem] font-medium text-[#9f2d2d]">{errors.privacy}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="group mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3 border border-obsidian bg-obsidian px-6 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-pure transition-colors duration-500 hover:bg-steel-deep disabled:cursor-wait disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 aria-hidden strokeWidth={1.6} className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <ArrowRight aria-hidden strokeWidth={1.5} className="size-[1.1em] transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                  </>
                )}
              </button>
              <p className="mt-4 flex items-start gap-2.5 text-[0.8125rem] leading-[1.45] text-muted">
                <Lock aria-hidden strokeWidth={1.4} className="mt-0.5 size-3.5 shrink-0" />
                Your information will be used to review and respond to your enquiry.
              </p>
              <span role="status" aria-live="polite" className="sr-only">{submitting ? "Sending your enquiry." : ""}</span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
