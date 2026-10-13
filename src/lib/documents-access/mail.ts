import { readFile } from "node:fs/promises";
import path from "node:path";
import { isMailConfigured } from "@/lib/mailer";

export { isMailConfigured };

const DEFAULT_URL = "https://api.resend.com/emails";
const LOGO_CID = "nexea-logo";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export interface OutgoingAttachment {
  filename: string;
  content: Buffer;
}

/**
 * Sends one message through Resend's REST API (no SDK dependency). The logo is embedded inline (CID) rather than
 * linked, because remote images are blocked by default in most inboxes. Credentials come only from the environment.
 */
export async function sendMail(input: { to: string; subject: string; html: string; text: string; attachments?: OutgoingAttachment[] }): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.DOCUMENTS_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) throw new Error("mail_not_configured");

  const logo = await readFile(/*turbopackIgnore: true*/ path.join(process.cwd(), "public", "images", "logo", "nexea-logo-email.png"));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(process.env.RESEND_API_URL || DEFAULT_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [input.to],
        reply_to: process.env.CONTACT_TO_EMAIL || "info@nexea-holding.com",
        subject: input.subject,
        html: input.html,
        text: input.text,
        attachments: [
          { filename: "nexea-logo.png", content: logo.toString("base64"), content_id: LOGO_CID },
          ...(input.attachments ?? []).map((a) => ({ filename: a.filename, content: a.content.toString("base64") })),
        ],
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`provider_${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------ templates ------------------------------ */

const INK = "#090d11";
const CARBON = "#151c23";
const SILVER = "#aebeca";
const PLATINUM = "#d6e0e8";

function shell(preheader: string, title: string, body: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="dark light" /><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background-color:#eef1f4;font-family:Arial,Helvetica,sans-serif;">
<span style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;color:#eef1f4;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef1f4;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${INK};border:1px solid #24313c;">
<tr><td style="padding:34px 40px 22px;"><img src="cid:${LOGO_CID}" alt="Nexea Holding AG" width="200" style="display:block;border:0;width:200px;height:auto;" /></td></tr>
<tr><td style="padding:0 40px;"><div style="height:1px;background-color:#34414c;line-height:1px;font-size:1px;">&nbsp;</div></td></tr>
${body}
<tr><td style="padding:8px 40px 34px;">
<div style="height:1px;background-color:#34414c;line-height:1px;font-size:1px;margin-bottom:18px;">&nbsp;</div>
<p style="margin:0;font-size:12px;line-height:18px;color:#7f93a3;">Nexea Holding AG · Sonnenbergstrasse 9 · 6052 Hergiswil NW · Switzerland<br />UID CHE-111.982.395 · <a href="mailto:info@nexea-holding.com" style="color:${SILVER};">info@nexea-holding.com</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

export function renderOtpEmail(code: string, ttlMinutes: number) {
  const digits = code
    .split("")
    .map((d) => `<td style="padding:0 4px;"><div style="width:44px;height:56px;line-height:56px;text-align:center;font-size:26px;font-weight:bold;color:#ffffff;background-color:${CARBON};border:1px solid #34414c;">${d}</div></td>`)
    .join("");
  const html = shell(
    "Use this code to request private documents from Nexea Holding AG.",
    "Your Nexea Holding AG verification code",
    `<tr><td style="padding:30px 40px 6px;"><p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${SILVER};">Private Documents · Verification</p></td></tr>
<tr><td style="padding:0 40px 8px;"><h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:30px;line-height:36px;color:#ffffff;">Your verification code</h1></td></tr>
<tr><td style="padding:12px 40px 4px;"><p style="margin:0;font-size:15px;line-height:24px;color:${PLATINUM};">Enter this six-digit code to confirm your email address and receive the documents you requested.</p></td></tr>
<tr><td style="padding:22px 36px 6px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>${digits}</tr></table></td></tr>
<tr><td style="padding:14px 40px 26px;"><p style="margin:0;font-size:13px;line-height:20px;color:#9fb2c0;">The code expires in ${ttlMinutes} minutes. If you did not make this request, you can safely ignore this email; no documents are sent without the code.</p></td></tr>`,
  );
  const text = `Nexea Holding AG - Private Documents\n\nYour verification code: ${code}\n\nEnter this code to confirm your email address and receive the documents you requested. It expires in ${ttlMinutes} minutes.\nIf you did not make this request, ignore this email; no documents are sent without the code.\n\nNexea Holding AG, Sonnenbergstrasse 9, 6052 Hergiswil NW, Switzerland\ninfo@nexea-holding.com`;
  return { subject: "Your Nexea Holding AG verification code", html, text };
}

export function renderDocumentsEmail(filenames: string[]) {
  const list = filenames
    .map((f) => `<tr><td style="padding:9px 0;border-bottom:1px solid #24313c;font-size:14px;line-height:20px;color:${PLATINUM};"><span style="color:${SILVER};">&#9679;</span>&nbsp;&nbsp;${esc(f)}</td></tr>`)
    .join("");
  const html = shell(
    "Your requested documents from Nexea Holding AG are attached.",
    "Your requested Nexea Holding AG documents",
    `<tr><td style="padding:30px 40px 6px;"><p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${SILVER};">Private Documents · Delivered</p></td></tr>
<tr><td style="padding:0 40px 8px;"><h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:30px;line-height:36px;color:#ffffff;">Your documents are attached</h1></td></tr>
<tr><td style="padding:12px 40px 8px;"><p style="margin:0;font-size:15px;line-height:24px;color:${PLATINUM};">Thank you for verifying your email address. The documents you requested from Nexea Holding AG are attached to this message:</p></td></tr>
<tr><td style="padding:10px 40px 6px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #24313c;">${list}</table></td></tr>
<tr><td style="padding:16px 40px 26px;"><p style="margin:0;font-size:13px;line-height:20px;color:#9fb2c0;">These documents are provided for information and are confidential to the recipient. They do not constitute an offer, personalised advice, or a commitment of any kind. If you have questions, simply reply to this email.</p></td></tr>`,
  );
  const text = `Nexea Holding AG - Private Documents\n\nThank you for verifying your email address. The documents you requested are attached:\n\n${filenames.map((f) => `- ${f}`).join("\n")}\n\nThese documents are provided for information and are confidential to the recipient. They do not constitute an offer, personalised advice, or a commitment of any kind. Reply to this email with any questions.\n\nNexea Holding AG, Sonnenbergstrasse 9, 6052 Hergiswil NW, Switzerland\ninfo@nexea-holding.com`;
  return { subject: "Your requested Nexea Holding AG documents", html, text };
}
