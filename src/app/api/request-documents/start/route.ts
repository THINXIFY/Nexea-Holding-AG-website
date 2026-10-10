import { generateOtp, hashOtp, otpConfig } from "@/lib/documents-access/otp";
import { getOtpStore } from "@/lib/documents-access/store";
import { documentsAvailable } from "@/lib/documents-access/documents";
import { isMailConfigured, renderOtpEmail, sendMail } from "@/lib/documents-access/mail";
import { clientIp, json, normalizeEmail, readJson } from "@/lib/documents-access/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;

export async function POST(req: Request) {
  const parsed = await readJson(req);
  if ("error" in parsed) return parsed.error;
  const { body } = parsed;

  const email = normalizeEmail(body.email);
  if (!email) return json({ error: "invalid_email" }, 400);

  // Honeypot: bots get a convincing answer, nothing is sent or stored.
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ requestId: "ok" });

  const cfg = otpConfig();
  if (!isMailConfigured() || !cfg.secret) return json({ error: "not_configured" }, 503);
  // Never send a code for documents that cannot then be delivered.
  if (!(await documentsAvailable())) return json({ error: "documents_unavailable" }, 503);

  const byIp = rateLimit(`docs-send-ip:${clientIp(req)}`, 20, HOUR);
  const byEmail = rateLimit(`docs-send-email:${email}`, 5, HOUR);
  if (!byIp.allowed || !byEmail.allowed) {
    return json({ error: "rate_limited" }, 429, { "Retry-After": String(Math.max(byIp.retryAfterSec, byEmail.retryAfterSec)) });
  }

  const store = getOtpStore();
  const code = generateOtp();
  const challenge = await store.create(email, hashOtp(code, cfg.secret), cfg.ttlMinutes * 60_000);
  try {
    await sendMail({ to: email, ...renderOtpEmail(code, cfg.ttlMinutes) });
  } catch {
    await store.invalidate(challenge.id);
    return json({ error: "mail_failure" }, 502);
  }
  return json({ requestId: challenge.id, cooldownSeconds: Math.round(cfg.resendCooldownMs / 1000) });
}
