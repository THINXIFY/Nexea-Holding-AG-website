import { generateOtp, hashOtp, otpConfig } from "@/lib/documents-access/otp";
import { getOtpStore } from "@/lib/documents-access/store";
import { isMailConfigured, renderOtpEmail, sendMail } from "@/lib/documents-access/mail";
import { clientIp, json, readJson } from "@/lib/documents-access/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;

export async function POST(req: Request) {
  const parsed = await readJson(req);
  if ("error" in parsed) return parsed.error;
  const requestId = parsed.body.requestId;
  if (typeof requestId !== "string") return json({ error: "not_found" }, 404);

  const cfg = otpConfig();
  if (!isMailConfigured() || !cfg.secret) return json({ error: "not_configured" }, 503);

  const ip = rateLimit(`docs-send-ip:${clientIp(req)}`, 20, HOUR);
  if (!ip.allowed) return json({ error: "rate_limited" }, 429, { "Retry-After": String(ip.retryAfterSec) });

  const store = getOtpStore();
  const challenge = await store.getById(requestId);
  if (!challenge || challenge.verified || Date.now() > challenge.expiresAt) return json({ error: "not_found" }, 404);

  const wait = cfg.resendCooldownMs - (Date.now() - challenge.lastSentAt);
  if (wait > 0) return json({ error: "rate_limited" }, 429, { "Retry-After": String(Math.ceil(wait / 1000)) });

  const byEmail = rateLimit(`docs-send-email:${challenge.email}`, 5, HOUR);
  if (!byEmail.allowed) return json({ error: "rate_limited" }, 429, { "Retry-After": String(byEmail.retryAfterSec) });

  const code = generateOtp();
  const updated = await store.replaceOtp(requestId, hashOtp(code, cfg.secret), cfg.ttlMinutes * 60_000);
  try {
    await sendMail({ to: updated.email, ...renderOtpEmail(code, cfg.ttlMinutes) });
  } catch {
    return json({ error: "mail_failure" }, 502);
  }
  return json({ requestId, cooldownSeconds: Math.round(cfg.resendCooldownMs / 1000) });
}
