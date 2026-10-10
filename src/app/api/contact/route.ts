import { NextResponse } from "next/server";
import { sanitize, validate } from "@/lib/contact-validation";
import { isMailConfigured, sendEnquiryEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 1_500; // a human needs longer than this to complete the form
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;

const json = (body: Record<string, unknown>, status: number, headers?: Record<string, string>) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

export async function POST(req: Request) {
  // Same-origin only (blocks cross-site form posts).
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json({ ok: false, code: "forbidden" }, 403);
    } catch {
      return json({ ok: false, code: "forbidden" }, 403);
    }
  }
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ ok: false, code: "bad_request" }, 415);

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return json({ ok: false, code: "too_large" }, 413);

  const limit = rateLimit(`contact:${clientIp(req)}`, MAX_PER_WINDOW, WINDOW_MS);
  if (!limit.allowed) return json({ ok: false, code: "rate_limited" }, 429, { "Retry-After": String(limit.retryAfterSec) });

  let raw: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, code: "too_large" }, 413);
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
    raw = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, code: "bad_request" }, 400);
  }

  // Bot traps: the honeypot must be empty and the form must have been open a human-plausible time.
  const startedAt = Number(raw.startedAt);
  const tooFast = !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS;
  if ((typeof raw.website === "string" && raw.website.trim() !== "") || tooFast) {
    // Pretend success to bots; nothing is sent or stored.
    return json({ ok: true }, 200);
  }

  const data = sanitize(raw);
  const errors = validate(data);
  if (Object.keys(errors).length) return json({ ok: false, code: "invalid", errors }, 422);

  if (!isMailConfigured()) {
    console.error("[contact] Email delivery is not configured (RESEND_API_KEY / CONTACT_FROM_EMAIL). Enquiry was NOT sent.");
    return json({ ok: false, code: "not_configured" }, 503);
  }

  const result = await sendEnquiryEmail(data);
  if (!result.ok) {
    console.error("[contact] Delivery provider rejected or failed the request.");
    return json({ ok: false, code: "delivery_failed" }, 502);
  }
  return json({ ok: true }, 200);
}

export function GET() {
  return json({ ok: false, code: "method_not_allowed" }, 405, { Allow: "POST" });
}
