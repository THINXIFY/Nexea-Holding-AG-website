"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

interface OtpCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  length?: number;
}

/** Six segmented digit boxes: auto-advance, backspace/arrow navigation, paste of a full code, OTP autofill. */
export function OtpCodeInput({ value, onChange, disabled = false, invalid = false, length = 6 }: OtpCodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const setDigit = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join("").slice(0, length));
  };

  const onInput = (i: number, raw: string) => {
    const clean = raw.replace(/\D/g, "");
    if (clean.length > 1) {
      // Autofill / multi-character input: spread across the boxes.
      onChange(clean.slice(0, length));
      refs.current[Math.min(clean.length, length) - 1]?.focus();
      return;
    }
    setDigit(i, clean);
    if (clean && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
      setDigit(i - 1, "");
    } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted.slice(0, length));
    refs.current[Math.max(Math.min(pasted.length, length) - 1, 0)]?.focus();
  };

  return (
    <div role="group" aria-label="Six-digit verification code" className="flex gap-1.5 min-[400px]:gap-2 sm:gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-otp-digit={i}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          maxLength={i === 0 ? length : 1}
          value={d}
          disabled={disabled}
          onChange={(e) => onInput(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
          className={`h-14 w-0 min-w-0 flex-1 rounded-xl border bg-white/[0.05] text-center font-ui text-[1.5rem] font-semibold text-pure caret-platinum outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-silver/30 focus:border-platinum focus:bg-white/[0.09] focus:shadow-[0_0_0_3px_rgba(174,190,202,0.18)] disabled:opacity-50 sm:h-16 ${
            invalid ? "border-[#e08a8a]/70" : d ? "border-silver/50" : "border-white/15"
          }`}
        />
      ))}
    </div>
  );
}
