import { enquiryById } from "@/data/contact";
import type { ContactInput } from "@/lib/contact-validation";

/**
 * Server-only email delivery for enquiries. Provider: Resend's REST API (plain
 * fetch, no extra dependency). Everything sensitive comes from environment
 * variables; nothing is hardcoded and nothing reaches the browser.
 *
 *   RESEND_API_KEY       required. API key from the delivery provider.
 *   CONTACT_FROM_EMAIL   required. A sender on a domain verified with the provider,
 *                        e.g. "Nexea Website <website@nexea-holding.com>".
 *   CONTACT_TO_EMAIL     optional. Defaults to info@nexea-holding.com.
 *   RESEND_API_URL       optional. Override of the provider endpoint (testing only).
 */
export type MailResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

const DEFAULT_TO = "info@nexea-holding.com";
const DEFAULT_URL = "https://api.resend.com/emails";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL);
}

export function buildEnquiryEmail(data: ContactInput, submittedAt: Date) {
  const type = enquiryById(data.type).formLabel;
  const when = submittedAt.toISOString();
  const rows: [string, string][] = [
    ["Full name", data.name],
    ["Email", data.email],
    ["Company", data.company || "(not provided)"],
    ["Country / Region", data.country || "(not provided)"],
    ["Enquiry type", type],
  ];
  if (data.type === "investment") rows.push(["Investment sector", data.sector || "(not specified)"]);
  rows.push(["Subject", data.subject], ["Submitted", `${when} (UTC)`]);

  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${data.message}\n`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#10171e;line-height:1.5">
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#52616d;vertical-align:top;white-space:nowrap">${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="margin:18px 0 6px;color:#52616d">Message</p>
<div style="white-space:pre-wrap;border-left:3px solid #aebeca;padding-left:12px">${esc(data.message)}</div></div>`;
  return { subject: `NEXEA — New Contact Enquiry: ${type}`, text, html };
}

export async function sendEnquiryEmail(data: ContactInput): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) return { ok: false, reason: "not_configured" };

  const { subject, text, html } = buildEnquiryEmail(data, new Date());
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(process.env.RESEND_API_URL || DEFAULT_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
        reply_to: data.email,
        subject,
        text,
        html,
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    return res.ok ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  } finally {
    clearTimeout(timer);
  }
}
