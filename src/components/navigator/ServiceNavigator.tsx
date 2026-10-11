"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { gsap } from "@/lib/gsap";
import {
  QUESTIONS,
  consultationHref,
  isComplete,
  optionOf,
  recommend,
  serviceHref,
  validOption,
  type Answers,
  type Recommendation,
  type StepId,
} from "@/data/service-navigator";

const STORAGE_KEY = "nexea-service-navigator:v1";
const COUNT = QUESTIONS.length;
const RESULTS = COUNT;
const LETTERS = "ABCDE";

/** Index of the first unanswered question (COUNT when everything is answered). */
const firstOpen = (a: Answers) => {
  const i = QUESTIONS.findIndex((q) => !validOption(q.id, a[q.id]));
  return i === -1 ? COUNT : i;
};

/** Reads saved progress and re-validates it, so a stale or tampered entry can never produce an invalid flow. */
function restore(): { answers: Answers; step: number } | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { answers?: Record<string, unknown>; step?: unknown };
    const answers: Answers = {};
    for (const q of QUESTIONS) {
      const v = data.answers?.[q.id];
      if (validOption(q.id, v)) answers[q.id] = v;
      else break; // keep only an unbroken run of valid answers from the start
    }
    const max = firstOpen(answers);
    const step = typeof data.step === "number" && Number.isInteger(data.step) ? Math.min(Math.max(data.step, 0), max === COUNT ? RESULTS : max) : max === COUNT ? RESULTS : max;
    return { answers, step };
  } catch {
    return null;
  }
}

function save(answers: Answers, step: number) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
  } catch {
    /* private mode / blocked storage: the tool still works, it just will not survive a refresh */
  }
}

export function ServiceNavigator() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [announce, setAnnounce] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // focus only after the visitor has navigated, never on first load

  // Restore saved progress once, after hydration.
  useEffect(() => {
    // Deferred to a callback so server and first client render match (no hydration mismatch).
    const t = window.setTimeout(() => {
      const saved = restore();
      if (saved) {
        setAnswers(saved.answers);
        setStep(saved.step);
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const go = useCallback((next: number, a: Answers) => {
    moved.current = true;
    setStep(next);
    save(a, next);
    setAnnounce(next === RESULTS ? "Your recommended Nexea service is ready." : `Step ${next + 1} of ${COUNT}: ${QUESTIONS[next].short}`);
  }, []);

  const q = step < COUNT ? QUESTIONS[step] : null;
  const maxReach = firstOpen(answers);
  const result = step === RESULTS && isComplete(answers) ? recommend(answers) : null;

  const choose = (id: StepId, value: string) => {
    const next: Answers = { ...answers, [id]: value };
    // Changing an earlier answer keeps later ones: they are re-validated on the way through.
    setAnswers(next);
    save(next, step);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!q || !validOption(q.id, answers[q.id])) return;
    go(step + 1 >= COUNT ? (isComplete(answers) ? RESULTS : firstOpen(answers)) : step + 1, answers);
  };

  const restart = () => {
    setAnswers({});
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    moved.current = true;
    setStep(0);
    setAnnounce("Started again. Step 1 of 5.");
  };

  // Entrance for each new view; focus moves to the heading after navigation. Reduced motion: no tweens.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (moved.current) heading.current?.focus({ preventScroll: false });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const items = el.querySelectorAll("[data-nv-in]");
      gsap.killTweensOf(items);
      // opacity (not autoAlpha): a visibility:hidden heading would lose the focus moved to it just above
      gsap.fromTo(items, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.05, overwrite: "auto", clearProps: "transform" });
    },
    { scope: root, dependencies: [step] },
  );

  return (
    <div ref={root} className="grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-6">
      <p role="status" aria-live="polite" className="sr-only">{announce}</p>

      {/* Sidebar: steps and the visitor's selections (desktop) */}
      <aside aria-label="Your progress" className="on-dark relative hidden self-start overflow-hidden bg-carbon p-6 text-pure lg:sticky lg:top-28 lg:block">
        <p className="eyebrow flex items-center gap-3 text-[0.6875rem] text-silver">
          <span aria-hidden className="h-px w-8 bg-silver/60" />
          Your selections
        </p>
        <ol className="mt-5">
          {QUESTIONS.map((item, i) => {
            const picked = optionOf(item.id, answers[item.id]);
            const current = i === step;
            const reachable = i <= maxReach;
            return (
              <li key={item.id} className="border-t border-white/10 first:border-t-0">
                <button
                  type="button"
                  disabled={!reachable || current}
                  onClick={() => go(i, answers)}
                  aria-current={current ? "step" : undefined}
                  className="group flex w-full items-start gap-3.5 py-3.5 text-left disabled:cursor-default"
                >
                  <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border font-ui text-[0.6875rem] font-semibold transition-colors duration-500 ${picked ? "border-platinum bg-platinum text-obsidian" : current ? "border-platinum text-pure" : "border-white/20 text-silver/60"}`}>
                    {picked ? <Check aria-hidden strokeWidth={2.2} className="size-3.5" /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={`block font-ui text-[0.8125rem] font-semibold transition-colors ${current || picked ? "text-pure" : "text-silver/70"} ${reachable && !current ? "group-hover:text-platinum" : ""}`}>{item.short}</span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-[1.35] text-silver/85">{picked ? picked.label : current ? "In progress" : "—"}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 border-t border-white/10 pt-4 text-[0.75rem] leading-[1.5] text-silver/75">
          Your selections stay in your browser. We never ask for personal or financial details here.
        </p>
      </aside>

      {/* Main panel */}
      <div className="min-w-0 border border-line bg-pure p-5 sm:p-8 lg:p-10">
        {/* Progress */}
        <div data-nv-in>
          <div className="flex items-baseline justify-between gap-4 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em]">
            <span className="text-steel">{result ? "Complete" : `Step ${step + 1} of ${COUNT}`}</span>
            <span className="text-muted">{result ? "Your match" : q?.short}</span>
          </div>
          <div className="mt-3 flex gap-1.5" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={COUNT} aria-valuenow={Math.min(step, COUNT)}>
            {QUESTIONS.map((item, i) => (
              <span key={item.id} className="relative h-[3px] flex-1 overflow-hidden bg-line">
                <span className={`absolute inset-0 origin-left bg-obsidian transition-transform duration-700 ease-out-expo motion-reduce:transition-none ${i < step || result ? "scale-x-100" : i === step ? "scale-x-50" : "scale-x-0"}`} />
              </span>
            ))}
          </div>
        </div>

        {q && (
          <form onSubmit={onSubmit} noValidate className="mt-8 sm:mt-10">
            <h2 ref={heading} tabIndex={-1} data-nv-in className="font-display text-[1.875rem] leading-[1.1] text-ink outline-none sm:text-[2.375rem]">
              {q.question}
            </h2>
            <p data-nv-in className="mt-2 text-[1rem] leading-[1.45] text-muted">{q.hint}</p>

            <fieldset data-nv-in className="mt-7 border-0 p-0">
              <legend className="sr-only">{q.question}</legend>
              <div role="radiogroup" aria-label={q.question} className={`grid gap-3 ${q.options.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
                {q.options.map((o, i) => {
                  const on = answers[q.id] === o.id;
                  return (
                    <label
                      key={o.id}
                      className={`group relative flex min-h-[4.25rem] cursor-pointer items-center gap-4 border p-4 transition-[border-color,background-color,box-shadow] duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-steel ${
                        on ? "border-obsidian bg-frost shadow-[inset_3px_0_0_0_#090d11]" : "border-line hover:border-steel hover:bg-frost/60"
                      } ${q.options.length % 2 === 1 && i === q.options.length - 1 ? "sm:col-span-2" : ""}`}
                    >
                      <input type="radio" name={`nv-${q.id}`} value={o.id} checked={on} onChange={() => choose(q.id, o.id)} className="sr-only" />
                      <span aria-hidden className={`grid size-9 shrink-0 place-items-center border font-ui text-[0.75rem] font-semibold transition-colors duration-300 ${on ? "border-obsidian bg-obsidian text-pure" : "border-line text-steel group-hover:border-steel"}`}>
                        {on ? <Check strokeWidth={2.2} className="size-4" /> : LETTERS[i]}
                      </span>
                      <span className="font-ui text-[1rem] font-semibold leading-[1.3] text-ink">{o.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div data-nv-in className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(step - 1, answers)}
                  disabled={step === 0}
                  className="inline-flex min-h-12 items-center gap-2 border border-line px-5 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-obsidian disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line"
                >
                  <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4" /> Back
                </button>
                <button type="button" onClick={restart} className="inline-flex min-h-12 items-center gap-2 px-3 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink">
                  <RotateCcw aria-hidden strokeWidth={1.5} className="size-4" /> Restart
                </button>
              </div>
              <button
                type="submit"
                disabled={!validOption(q.id, answers[q.id])}
                className="group inline-flex min-h-12 items-center gap-3 border border-obsidian bg-obsidian px-7 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-pure transition-colors duration-300 hover:bg-steel-deep disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-muted"
              >
                {step === COUNT - 1 ? "See my recommendation" : "Continue"}
                <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-enabled:group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        )}

        {result && isComplete(answers) && (
          <Results result={result} answers={answers} headingRef={heading} onRestart={restart} onEdit={() => go(COUNT - 1, answers)} />
        )}
      </div>
    </div>
  );
}

function Capabilities({ items, tone }: { items: readonly string[]; tone: "dark" | "light" }) {
  return (
    <ul className={`mt-4 grid gap-x-6 border-t sm:grid-cols-2 ${tone === "dark" ? "border-white/15" : "border-line"}`}>
      {items.map((c) => (
        <li key={c} className={`flex items-center gap-3 border-b py-2.5 font-ui text-[0.875rem] font-semibold ${tone === "dark" ? "border-white/10 text-platinum" : "border-line text-ink"}`}>
          <span aria-hidden className={`h-px w-4 ${tone === "dark" ? "bg-silver" : "bg-steel"}`} />
          {c}
        </li>
      ))}
    </ul>
  );
}

function Results({
  result,
  answers,
  headingRef,
  onRestart,
  onEdit,
}: {
  result: NonNullable<ReturnType<typeof recommend>>;
  answers: Record<StepId, string>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
  onEdit: () => void;
}) {
  const { primary, complementary, steps, summary } = result;
  const primaryService = primary.service;
  return (
    <div className="mt-8 sm:mt-10">
      <p data-nv-in className="eyebrow flex items-center gap-4 text-[0.6875rem] text-steel">
        <span aria-hidden className="h-px w-8 bg-steel/60" />
        Based on your answers
      </p>
      <h2 ref={headingRef} tabIndex={-1} data-nv-in className="mt-3 font-display text-[1.875rem] leading-[1.1] text-ink outline-none sm:text-[2.375rem]">
        Your Recommended Nexea Service
      </h2>

      <ul data-nv-in className="mt-4 flex flex-wrap gap-2" aria-label="Your answers">
        {summary.map((s) => (
          <li key={s.label} className="border border-line bg-frost px-3 py-1.5 font-ui text-[0.75rem] font-semibold text-ink">
            <span className="mr-1.5 text-steel">{s.label}</span>
            {s.value}
          </li>
        ))}
      </ul>

      {/* Primary */}
      <article data-nv-in aria-labelledby="nv-primary" className="on-dark relative isolate mt-7 overflow-hidden bg-carbon p-6 text-pure sm:p-9">
        <svg aria-hidden viewBox="0 0 400 400" fill="none" className="pointer-events-none absolute -bottom-28 -right-24 -z-10 size-[26rem] text-silver/[0.09]">
          {[60, 110, 160, 210].map((r) => (
            <circle key={r} cx="400" cy="400" r={r} stroke="currentColor" strokeWidth="1" />
          ))}
        </svg>
        <span aria-hidden className="absolute inset-y-8 left-0 w-px bg-silver/70" />
        <p className="eyebrow flex items-center gap-3 text-[0.6875rem] text-silver">
          <span aria-hidden>{primaryService.number}</span>
          <span aria-hidden className="h-px w-8 bg-silver/50" />
          Primary match
        </p>
        <h3 id="nv-primary" className="mt-4 max-w-[34rem] font-display text-[1.875rem] leading-[1.08] sm:text-[2.5rem]">{primaryService.title}</h3>
        <p className="mt-4 max-w-[40rem] text-[1.0625rem] leading-[1.5] text-platinum">{primary.why}</p>
        <p className="mt-3 max-w-[40rem] text-[0.9375rem] leading-[1.5] text-silver/90">{primaryService.description}</p>
        <Capabilities items={primaryService.capabilities} tone="dark" />
        {primaryService.note && <p className="mt-4 text-[0.875rem] leading-[1.5] text-silver/90">{primaryService.note}</p>}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href={serviceHref(primaryService.slug)} className="group inline-flex min-h-14 items-center justify-center gap-3 border border-silver/45 px-7 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-pure transition-colors duration-500 hover:border-pure hover:bg-pure/10">
            Explore Service <ArrowRight aria-hidden strokeWidth={1.5} className="size-[1.1em] transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <Link href={result.consultationHref} className="group inline-flex min-h-14 items-center justify-center gap-3 border border-platinum bg-platinum px-7 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-500 hover:bg-pure">
            Request Consultation <ArrowRight aria-hidden strokeWidth={1.5} className="size-[1.1em] transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <button type="button" onClick={onRestart} className="inline-flex min-h-14 items-center justify-center gap-2.5 px-4 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-silver transition-colors hover:text-pure">
            <RotateCcw aria-hidden strokeWidth={1.5} className="size-4" /> Start Again
          </button>
        </div>
      </article>

      {/* Complementary */}
      {complementary.length > 0 && (
        <section data-nv-in aria-labelledby="nv-comp" className="mt-8">
          <h3 id="nv-comp" className="font-display text-[1.5rem] leading-[1.15] text-ink">Complementary services</h3>
          <p className="mt-1 text-[0.9375rem] text-muted">These services pair well with your main match.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {complementary.map((c) => (
              <ComplementCard key={c.service.slug} rec={c} answers={answers} />
            ))}
          </div>
        </section>
      )}

      {/* Next steps */}
      <section data-nv-in aria-labelledby="nv-next" className="mt-8 border-t border-line pt-6">
        <h3 id="nv-next" className="font-display text-[1.5rem] leading-[1.15] text-ink">Relevant next steps</h3>
        <ul className="mt-3">
          {steps.map((s) => (
            <li key={s.href} className="border-b border-line">
              <Link href={s.href} className="group flex min-h-14 items-center justify-between gap-4 py-3">
                <span>
                  <span className="block font-ui text-[0.9375rem] font-semibold text-ink">{s.label}</span>
                  <span className="mt-0.5 block text-[0.875rem] leading-[1.4] text-muted">{s.description}</span>
                </span>
                <ArrowRight aria-hidden strokeWidth={1.4} className="size-5 shrink-0 text-steel transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" onClick={onEdit} className="mt-4 inline-flex min-h-11 items-center gap-2 font-ui text-[0.8125rem] font-semibold text-steel underline decoration-silver underline-offset-4 transition-colors hover:text-ink">
          <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4" /> Change my answers
        </button>
      </section>
    </div>
  );
}

function ComplementCard({ rec, answers }: { rec: Recommendation; answers: Record<StepId, string> }) {
  const s = rec.service;
  return (
    <article aria-labelledby={`nv-c-${s.slug}`} className="flex flex-col border border-line bg-frost p-5 sm:p-6">
      <p className="eyebrow text-[0.625rem] text-steel">{s.number}</p>
      <h4 id={`nv-c-${s.slug}`} className="mt-2 font-display text-[1.375rem] leading-[1.15] text-ink">{s.title}</h4>
      <p className="mt-2 text-[0.9375rem] leading-[1.5] text-muted">{rec.why}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {s.capabilities.slice(0, 3).map((c) => (
          <li key={c} className="border border-line bg-pure px-2.5 py-1 font-ui text-[0.75rem] font-semibold text-ink">{c}</li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 pt-4">
        <Link href={serviceHref(s.slug)} className="group inline-flex min-h-11 items-center gap-2 font-ui text-[0.8125rem] font-semibold text-ink">
          Explore <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
        <Link href={consultationHref(s.slug, answers)} className="inline-flex min-h-11 items-center font-ui text-[0.8125rem] font-semibold text-steel underline decoration-silver underline-offset-4 transition-colors hover:text-ink">
          Discuss this service
        </Link>
      </div>
    </article>
  );
}
