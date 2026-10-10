import { ENQUIRY_TYPES, SECTOR_OPTIONS, isEnquiryId, type EnquiryId } from "@/data/contact";

/** Shared by the browser (instant feedback) and the route handler (the authority). */
export const LIMITS = { name: 120, email: 254, company: 160, country: 100, subject: 160, message: 4000 } as const;

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  country: string;
  type: EnquiryId;
  sector: string;
  subject: string;
  message: string;
  privacy: boolean;
}

export type FieldName = keyof ContactInput;
export type FieldErrors = Partial<Record<FieldName, string>>;

// C0 control characters (newlines are handled separately below) and DEL.
const CONTROL = new RegExp("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]", "g");
// Any kind of line break, including the Unicode line / paragraph separators.
const LINE_BREAKS = new RegExp("[\\r\\n\\u2028\\u2029]+", "g");

/** Single-line values: remove control characters and collapse any line breaks (blocks header injection). */
export const cleanLine = (v: unknown): string =>
  typeof v === "string" ? v.replace(CONTROL, "").replace(LINE_BREAKS, " ").replace(/\s+/g, " ").trim() : "";

/** Multi-line values: remove control characters, normalise newlines, cap blank lines. */
export const cleanText = (v: unknown): string =>
  typeof v === "string" ? v.replace(CONTROL, "").replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim() : "";

const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function sanitize(raw: Record<string, unknown>): ContactInput {
  return {
    name: cleanLine(raw.name),
    email: cleanLine(raw.email).toLowerCase(),
    company: cleanLine(raw.company),
    country: cleanLine(raw.country),
    type: (isEnquiryId(raw.type) ? raw.type : "") as EnquiryId,
    sector: cleanLine(raw.sector),
    subject: cleanLine(raw.subject),
    message: cleanText(raw.message),
    privacy: raw.privacy === true,
  };
}

export function validate(input: ContactInput): FieldErrors {
  const e: FieldErrors = {};
  if (!input.name) e.name = "Please enter your full name.";
  else if (input.name.length > LIMITS.name) e.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (!input.email) e.email = "Please enter your email address.";
  else if (input.email.length > LIMITS.email || !EMAIL.test(input.email)) e.email = "Please enter a valid email address, for example name@company.com.";

  if (input.company.length > LIMITS.company) e.company = `Please keep this under ${LIMITS.company} characters.`;
  if (input.country.length > LIMITS.country) e.country = `Please keep this under ${LIMITS.country} characters.`;

  if (!ENQUIRY_TYPES.some((t) => t.id === input.type)) e.type = "Please choose the type of enquiry.";

  if (input.type === "investment" && input.sector && !SECTOR_OPTIONS.includes(input.sector)) e.sector = "Please choose a sector from the list.";

  if (!input.subject) e.subject = "Please add a short subject.";
  else if (input.subject.length > LIMITS.subject) e.subject = `Please keep the subject under ${LIMITS.subject} characters.`;

  if (!input.message) e.message = "Please tell us how we can help.";
  else if (input.message.length < 10) e.message = "Please add a little more detail (at least 10 characters).";
  else if (input.message.length > LIMITS.message) e.message = `Please keep your message under ${LIMITS.message} characters.`;

  if (!input.privacy) e.privacy = "Please acknowledge the privacy notice to continue.";
  return e;
}
