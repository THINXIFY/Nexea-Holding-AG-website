import { otpConfig, verifyOtp } from "@/lib/documents-access/otp";
import { getOtpStore, type OtpChallenge } from "@/lib/documents-access/store";
import { loadDocuments } from "@/lib/documents-access/documents";
import { isMailConfigured, renderDocumentsEmail, sendMail } from "@/lib/documents-access/mail";
import { clientIp, json, readJson } from "@/lib/documents-access/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Delivers the documents once. Idempotent: a "sent" challenge is never re-sent, and a delivery in progress is not duplicated. */
async function deliver(challenge: OtpChallenge): Promise<"sent" | "failed" | "in_progress"> {
  const store = getOtpStore();
  if (challenge.deliveryStatus === "sent") return "sent";
  if (challenge.deliveryStatus === "sending") return "in_progress";
  await store.setDeliveryStatus(challenge.id, "sending");
  try {
    const docs = await loadDocuments();
    await sendMail({ to: challenge.email, ...renderDocumentsEmail(docs.map((d) => d.filename)), attachments: docs });
    await store.setDeliveryStatus(challenge.id, "sent");
    return "sent";
  } catch {
    await store.setDeliveryStatus(challenge.id, "failed");
    return "failed";
  }
}

export async function POST(req: Request) {
  const parsed = await readJson(req);
  if ("error" in parsed) return parsed.error;
  const { requestId, code } = parsed.body;
  if (typeof requestId !== "string" || typeof code !== "string") return json({ error: "not_found" }, 400);

  const cfg = otpConfig();
  if (!isMailConfigured() || !cfg.secret) return json({ error: "not_configured" }, 503);

  const ip = rateLimit(`docs-verify-ip:${clientIp(req)}`, 30, 60 * 60 * 1000);
  if (!ip.allowed) return json({ error: "rate_limited" }, 429, { "Retry-After": String(ip.retryAfterSec) });

  const store = getOtpStore();
  const challenge = await store.getById(requestId);
  if (!challenge) return json({ error: "not_found" }, 400);

  // Already verified: retry delivery without asking for the code again (supports "Try Again").
  if (challenge.verified) {
    const status = await deliver(challenge);
    return status === "in_progress" ? json({ error: "in_progress" }, 409) : json({ status });
  }
  if (Date.now() > challenge.expiresAt) return json({ error: "expired" }, 400);
  if (challenge.attemptCount >= cfg.maxAttempts) {
    await store.invalidate(challenge.id);
    return json({ error: "too_many_attempts" }, 400);
  }
  if (!/^\d{6}$/.test(code) || !verifyOtp(code, challenge.otpHash, cfg.secret)) {
    const updated = await store.incrementAttempts(challenge.id);
    if (updated.attemptCount >= cfg.maxAttempts) {
      await store.invalidate(challenge.id);
      return json({ error: "too_many_attempts" }, 400);
    }
    return json({ error: "invalid_code", attemptsLeft: cfg.maxAttempts - updated.attemptCount }, 400);
  }

  const verified = await store.markVerified(challenge.id);
  const status = await deliver(verified);
  return status === "in_progress" ? json({ error: "in_progress" }, 409) : json({ status });
}
