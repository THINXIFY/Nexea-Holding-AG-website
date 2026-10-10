import { ArrowRight, Mail } from "lucide-react";
import { EMAIL_LINKS_ENABLED, type TeamMember } from "@/data/team";

interface TeamEmailProps {
  member: TeamMember;
  /** `dark` for use on obsidian / carbon surfaces. */
  tone?: "light" | "dark";
  /** Shows a small arrow that nudges on hover (only used where the link is the row's action). */
  arrow?: boolean;
  className?: string;
}

/**
 * The one place a team email is rendered. Long addresses wrap safely at any
 * character, the whole line is a 44px+ touch target, and when links are
 * disabled (or no address exists) it degrades to plain, copyable text / nothing.
 */
export function TeamEmail({ member, tone = "light", arrow = false, className = "" }: TeamEmailProps) {
  const email = member.email;
  if (!email) return null;
  const dark = tone === "dark";
  const icon = dark ? "text-silver group-hover/mail:text-pure" : "text-steel group-hover/mail:text-ink";
  const text = dark ? "text-platinum group-hover/mail:text-pure" : "text-ink group-hover/mail:text-steel";
  const underline = dark ? "group-hover/mail:decoration-silver/70" : "group-hover/mail:decoration-silver";
  const body = (
    <>
      <Mail aria-hidden strokeWidth={1.3} className={`mt-px size-4 shrink-0 transition-colors duration-300 ${icon}`} />
      <span className={`min-w-0 font-body text-[0.875rem] leading-[1.4] transition-colors duration-300 [overflow-wrap:anywhere] underline decoration-transparent decoration-1 underline-offset-4 ${underline} ${text}`}>
        <span className="sr-only">Email {member.name}: </span>
        {email}
      </span>
      {arrow && (
        <ArrowRight
          aria-hidden
          strokeWidth={1.4}
          className={`mt-px size-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover/mail:translate-x-1 ${icon}`}
        />
      )}
    </>
  );
  const base = `group/mail inline-flex min-h-11 items-start gap-2.5 py-2.5 ${className}`;
  return EMAIL_LINKS_ENABLED ? (
    <a href={`mailto:${email}`} className={base}>
      {body}
    </a>
  ) : (
    <span className={`${base} select-all`}>{body}</span>
  );
}
