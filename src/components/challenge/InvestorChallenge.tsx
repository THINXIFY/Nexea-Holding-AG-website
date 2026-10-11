"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Copy, RotateCcw, Share2, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { LEVELS, QUESTIONS, SHARE_PATH, TOTAL, levelFor, scoreOf, shareText, type Level } from "@/data/investor-challenge";

type Phase = "intro" | "play" | "results";
const LETTERS = ["A", "B", "C"] as const;

const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;

/** Quiet upward line graph, drawn once on the opening screen. */
function IntroGraphic() {
  return (
    <svg aria-hidden viewBox="0 0 360 260" fill="none" className="w-full max-w-[26rem]">
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="0" x2="360" y1={40 + i * 48} y2={40 + i * 48} stroke="#aebeca" strokeOpacity="0.14" />
      ))}
      <path className="ic-draw" d="M10 220 L70 190 L120 200 L180 140 L230 150 L290 80 L350 40" stroke="#d6e0e8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      {[[70, 190], [180, 140], [290, 80], [350, 40]].map(([x, y], i) => (
        <circle key={i} className="ic-pop" style={{ animationDelay: `${0.7 + i * 0.25}s` }} cx={x} cy={y} r="3.5" fill="#090d11" stroke="#aebeca" strokeWidth="1.4" />
      ))}
    </svg>
  );
}

/** Badge: concentric hexagon-free rings; one filled ring per achievement tier. Purely decorative. */
function Emblem({ level }: { level: Level }) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" fill="none" className="size-20">
      {[52, 40, 28].map((r, i) => {
        const on = 3 - i <= level.tier;
        return <circle key={r} cx="60" cy="60" r={r} stroke={on ? "#d6e0e8" : "#aebeca"} strokeOpacity={on ? 0.95 : 0.25} strokeWidth={on ? 1.6 : 1} />;
      })}
      <path d="M60 44 L64 56 L76 60 L64 64 L60 76 L56 64 L44 60 L56 56 Z" fill="#d6e0e8" fillOpacity={0.9} />
    </svg>
  );
}

export function InvestorChallenge() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<(number | undefined)[]>(() => Array(TOTAL).fill(undefined));
  const [drawn, setDrawn] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [announce, setAnnounce] = useState("");

  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const moved = useRef(false);

  const q = QUESTIONS[index];
  const picked = picks[index];
  const locked = picked !== undefined;
  const score = scoreOf(picks);
  const level = levelFor(score);

  const choose = useCallback(
    (opt: number) => {
      // A question can be scored only once: later clicks are ignored.
      if (phase !== "play" || picks[index] !== undefined) return;
      setPicks((p) => p.map((v, i) => (i === index ? opt : v)));
      const right = opt === QUESTIONS[index].correct;
      setAnnounce(`${right ? "Correct." : `Not quite. The correct answer is ${LETTERS[QUESTIONS[index].correct]}.`} ${QUESTIONS[index].explanation}`);
      // Move focus to the continue button so Enter proceeds.
      window.setTimeout(() => nextBtn.current?.focus({ preventScroll: true }), 60);
    },
    [phase, picks, index],
  );

  const start = () => {
    moved.current = true;
    setPicks(Array(TOTAL).fill(undefined));
    setIndex(0);
    setDrawn(false);
    setShareMsg("");
    setPhase("play");
    setAnnounce(`Question 1 of ${TOTAL}`);
  };

  const next = () => {
    if (!locked) return;
    moved.current = true;
    if (index + 1 >= TOTAL) {
      setDrawn(false);
      setPhase("results");
      setAnnounce("Challenge complete. Your result is ready.");
    } else {
      setIndex(index + 1);
      setAnnounce(`Question ${index + 2} of ${TOTAL}`);
    }
  };

  const restart = () => {
    moved.current = true;
    setPicks(Array(TOTAL).fill(undefined));
    setIndex(0);
    setDrawn(false);
    setShareMsg("");
    setPhase("intro");
    setAnnounce("Challenge reset.");
  };

  // Answer shortcuts: A / B / C or 1 / 2 / 3.
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (phase !== "play" || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key.toLowerCase();
    const i = ["a", "b", "c"].indexOf(k) >= 0 ? ["a", "b", "c"].indexOf(k) : ["1", "2", "3"].indexOf(k);
    if (i >= 0) {
      e.preventDefault();
      choose(i);
    }
  };

  // Entrance per view (opacity only, so a heading that just received focus is never hidden). Reduced motion: none.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (moved.current) heading.current?.focus({ preventScroll: true });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (phase === "results") setDrawn(true);
        return;
      }
      const items = el.querySelectorAll("[data-ic-in]");
      gsap.killTweensOf(items);
      gsap.fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06, overwrite: "auto", clearProps: "transform" });
      if (phase === "results") gsap.delayedCall(0.35, () => setDrawn(true));
    },
    { scope: root, dependencies: [phase, index] },
  );

  // Safety: if the draw never triggered, show the final ring anyway.
  useEffect(() => {
    if (phase !== "results" || drawn) return;
    const t = window.setTimeout(() => setDrawn(true), 1500);
    return () => window.clearTimeout(t);
  }, [phase, drawn]);

  const share = async () => {
    const url = `${window.location.origin}${SHARE_PATH}`;
    const text = shareText(score);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Nexea Investor Challenge", text, url });
        setShareMsg("Shared.");
        return;
      }
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return; // the visitor closed the share sheet
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareMsg("Result and link copied to your clipboard.");
    } catch {
      setShareMsg(`Copy this to share: ${text} ${url}`);
    }
  };

  const doneCount = phase === "results" ? TOTAL : phase === "play" ? index + (locked ? 1 : 0) : 0;

  return (
    <section
      ref={root}
      aria-labelledby="ic-heading"
      onKeyDown={onKeyDown}
      className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-obsidian pb-14 pt-28 text-pure sm:pt-32 lg:pb-20 lg:pt-36"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_85%_-10%,rgba(36,49,60,0.55),transparent),radial-gradient(40rem_30rem_at_0%_100%,rgba(21,28,35,0.9),transparent)]" />
      <p role="status" aria-live="polite" className="sr-only">{announce}</p>

      {phase !== "intro" && <h1 className="sr-only">Think Like an Investor: the Nexea Investor Challenge</h1>}
      <div className="container-nx flex flex-1 flex-col justify-center">
        {/* ---------- Opening ---------- */}
        {phase === "intro" && (
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p data-ic-in className="eyebrow flex items-center gap-4 text-platinum">
                <span aria-hidden className="h-px w-10 bg-silver/70" />
                Nexea / Investor Challenge
              </p>
              <h1 id="ic-heading" ref={heading} tabIndex={-1} data-ic-in className="display-xl mt-5 outline-none sm:mt-6">
                Think Like an Investor.
              </h1>
              <p data-ic-in className="mt-6 max-w-[32rem] text-[1.0625rem] leading-[1.5] text-platinum/90 sm:text-lg">
                Five questions. One challenge. Discover your investment knowledge.
              </p>
              <div data-ic-in className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <button type="button" onClick={start} className="group inline-flex min-h-14 items-center justify-center gap-3 border border-platinum bg-platinum px-8 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-500 hover:bg-pure">
                  Start the Challenge
                  <ArrowRight aria-hidden strokeWidth={1.5} className="size-[1.1em] transition-transform duration-500 group-hover:translate-x-1" />
                </button>
                <p className="font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-silver">5 questions · about a minute · no sign-up</p>
              </div>
            </div>
            <div data-ic-in className="flex justify-center lg:col-span-5 lg:justify-end">
              <IntroGraphic />
            </div>
          </div>
        )}

        {/* ---------- Questions ---------- */}
        {phase === "play" && (
          <div className="mx-auto w-full max-w-[56rem]">
            <div data-ic-in>
              <div className="flex items-baseline justify-between gap-4 font-ui text-[0.75rem] font-semibold uppercase tracking-[0.14em]">
                <span className="text-platinum">Question {index + 1} of {TOTAL}</span>
                <button type="button" onClick={restart} className="inline-flex min-h-11 items-center gap-2 text-silver transition-colors hover:text-pure">
                  <RotateCcw aria-hidden strokeWidth={1.5} className="size-3.5" /> Restart
                </button>
              </div>
              <div className="mt-1 flex gap-1.5" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={doneCount}>
                {QUESTIONS.map((item, i) => (
                  <span key={item.id} className="relative h-[3px] flex-1 overflow-hidden bg-white/15">
                    <span className={`absolute inset-0 origin-left bg-platinum transition-transform duration-700 ease-out-expo motion-reduce:transition-none ${i < doneCount ? "scale-x-100" : i === index ? "scale-x-[0.35]" : "scale-x-0"}`} />
                  </span>
                ))}
              </div>
            </div>

            <h2 id="ic-heading" ref={heading} tabIndex={-1} data-ic-in className="mt-8 font-display text-[1.875rem] leading-[1.1] text-balance outline-none sm:mt-10 sm:text-[2.5rem] lg:text-[2.875rem]">
              {q.question}
            </h2>

            <div data-ic-in role="group" aria-label="Answer options" className="mt-7 grid gap-3 sm:mt-9">
              {q.options.map((text, i) => {
                const isPicked = picked === i;
                const isCorrect = q.correct === i;
                const state = !locked ? "idle" : isCorrect ? "correct" : isPicked ? "wrong" : "dim";
                return (
                  <button
                    key={text}
                    type="button"
                    aria-disabled={locked}
                    aria-pressed={isPicked}
                    onClick={() => choose(i)}
                    className={`group relative flex min-h-[4.5rem] w-full items-center gap-4 border p-4 text-left transition-[border-color,background-color,opacity,box-shadow] duration-500 sm:p-5 ${
                      state === "idle"
                        ? "border-white/15 bg-white/[0.03] hover:border-silver/60 hover:bg-white/[0.06]"
                        : state === "correct"
                          ? "border-platinum bg-platinum/[0.08] shadow-[inset_3px_0_0_0_#d6e0e8]"
                          : state === "wrong"
                            ? "border-[#b98a8a]/70 bg-[#b98a8a]/[0.07] shadow-[inset_3px_0_0_0_#b98a8a]"
                            : "border-white/10 opacity-50"
                    } ${locked ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span aria-hidden className={`grid size-10 shrink-0 place-items-center border font-ui text-[0.8125rem] font-semibold transition-colors duration-500 ${state === "correct" ? "border-platinum bg-platinum text-obsidian" : state === "wrong" ? "border-[#b98a8a] bg-[#b98a8a] text-obsidian" : "border-white/25 text-silver group-hover:border-silver"}`}>
                      {state === "correct" ? <Check strokeWidth={2.2} className="size-4" /> : state === "wrong" ? <X strokeWidth={2.2} className="size-4" /> : LETTERS[i]}
                    </span>
                    <span className="font-ui text-[1.0625rem] font-semibold leading-[1.3] text-pure sm:text-[1.125rem]">{text}</span>
                    {locked && (isCorrect || isPicked) && <span className="sr-only">{isCorrect ? " (correct answer)" : " (your answer, incorrect)"}</span>}
                  </button>
                );
              })}
            </div>

            {/* Reveal: explanation + takeaway */}
            <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${locked ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`} aria-hidden={!locked}>
              <div className="overflow-hidden">
                <div className="mt-5 border-l-2 border-silver/60 bg-white/[0.03] p-5 sm:p-6">
                  <p className="eyebrow text-[0.6875rem] text-platinum">{picked === q.correct ? "Correct" : `Not quite · the answer is ${LETTERS[q.correct]}`}</p>
                  <p className="mt-2 text-[1rem] leading-[1.55] text-platinum">{q.explanation}</p>
                  <p className="mt-3 text-[0.875rem] leading-[1.5] text-silver"><span className="font-semibold text-pure">Takeaway: </span>{q.takeaway}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="hidden font-ui text-[0.75rem] text-silver/80 sm:block">Tip: press A, B or C to answer.</p>
              <button
                ref={nextBtn}
                type="button"
                onClick={next}
                disabled={!locked}
                className="group ml-auto inline-flex min-h-14 items-center gap-3 border border-platinum bg-platinum px-8 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-500 hover:bg-pure disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/10 disabled:text-silver/60"
              >
                {index + 1 >= TOTAL ? "See My Result" : "Next Question"}
                <ArrowRight aria-hidden strokeWidth={1.5} className="size-[1.1em] transition-transform duration-500 group-enabled:group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* ---------- Results ---------- */}
        {phase === "results" && (
          <div className="mx-auto w-full max-w-[56rem]">
            <p data-ic-in className="eyebrow flex items-center gap-4 text-platinum">
              <span aria-hidden className="h-px w-10 bg-silver/70" />
              Challenge complete
            </p>
            <h2 id="ic-heading" ref={heading} tabIndex={-1} data-ic-in className="mt-4 font-display text-[2rem] leading-[1.08] outline-none sm:text-[2.75rem]">
              Your result
            </h2>

            <div className="mt-8 grid items-center gap-8 border border-white/12 bg-white/[0.03] p-6 sm:p-9 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12">
              <div data-ic-in className="relative mx-auto size-48 sm:size-56" role="img" aria-label={`Score: ${score} out of ${TOTAL}`}>
                <svg viewBox="0 0 120 120" className="size-full -rotate-90" fill="none" aria-hidden>
                  <circle cx="60" cy="60" r={RING_R} stroke="#aebeca" strokeOpacity="0.18" strokeWidth="3" />
                  <circle
                    cx="60"
                    cy="60"
                    r={RING_R}
                    stroke="#d6e0e8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    strokeDashoffset={drawn ? RING_C * (1 - score / TOTAL) : RING_C}
                    style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    className="motion-reduce:!transition-none"
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <p className="font-display leading-none">
                    <span className="text-[4rem] sm:text-[4.75rem]">{score}</span>
                    <span className="text-[2rem] text-silver sm:text-[2.25rem]">/{TOTAL}</span>
                  </p>
                </div>
              </div>

              <div>
                <div data-ic-in className="flex items-center gap-4">
                  <Emblem level={level} />
                  <div>
                    <p className="eyebrow text-[0.6875rem] text-silver">Achievement level</p>
                    <p className="mt-1 font-display text-[1.75rem] leading-[1.1] sm:text-[2.25rem]">{level.name}</p>
                  </div>
                </div>
                <p data-ic-in className="mt-5 max-w-[34rem] text-[1.0625rem] leading-[1.55] text-platinum">{level.message}</p>
                <ul data-ic-in aria-label="Level scale" className="mt-5 flex flex-wrap gap-2">
                  {LEVELS.map((l, i) => (
                    <li key={l.id} className={`border px-3 py-1.5 font-ui text-[0.6875rem] font-semibold uppercase tracking-[0.1em] ${l.id === level.id ? "border-platinum text-pure" : "border-white/15 text-silver/70"}`}>
                      {i === 0 ? "0–2" : i === 1 ? "3–4" : "5"} · {l.name.replace("Investment ", "")}
                    </li>
                  ))}
                </ul>
                <p data-ic-in className="mt-4 text-[0.8125rem] leading-[1.5] text-silver/80">Achievement levels reflect quiz performance only and are not a professional qualification.</p>
              </div>
            </div>

            <div data-ic-in className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={start} className="group inline-flex min-h-14 items-center justify-center gap-3 border border-platinum bg-platinum px-7 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-obsidian transition-colors duration-500 hover:bg-pure">
                <RotateCcw aria-hidden strokeWidth={1.5} className="size-[1.1em]" /> Play Again
              </button>
              <Link href="/investments" className="group inline-flex min-h-14 items-center justify-center gap-3 border border-silver/45 px-7 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-pure transition-colors duration-500 hover:border-pure hover:bg-pure/10">
                Explore Investments <ArrowRight aria-hidden strokeWidth={1.5} className="size-[1.1em] transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <button type="button" onClick={share} className="inline-flex min-h-14 items-center justify-center gap-3 border border-silver/45 px-7 font-ui text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-pure transition-colors duration-500 hover:border-pure hover:bg-pure/10">
                {typeof navigator !== "undefined" && typeof navigator.share === "function" ? <Share2 aria-hidden strokeWidth={1.5} className="size-[1.1em]" /> : <Copy aria-hidden strokeWidth={1.5} className="size-[1.1em]" />}
                Share My Achievement
              </button>
            </div>
            <p role="status" aria-live="polite" className="mt-3 min-h-[1.25rem] break-words text-[0.875rem] text-platinum">{shareMsg}</p>
          </div>
        )}
      </div>
    </section>
  );
}
