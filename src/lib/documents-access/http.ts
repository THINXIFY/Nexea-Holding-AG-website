import { NextResponse } from "next/server";

export const MAX_BODY_BYTES = 4_000;

export const json = (body: Record<string, unknown>, status = 200, headers?: Record<string, string>) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  return email.length > 0 && email.length <= 254 && EMAIL_PATTERN.test(email) && !/[\r\n,;<>]/.test(email) ? email : null;
}

/** Same-origin, JSON-only, size-limited request guard. Returns the parsed object or an error response. */
export async function readJson(req: Request): Promise<{ body: Record<string, unknown> } | { error: NextResponse }> {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return { error: json({ error: "forbidden" }, 403) };
    } catch {
      return { error: json({ error: "forbidden" }, 403) };
    }
  }
  if (!req.headers.get("content-type")?.includes("application/json")) return { error: json({ error: "bad_request" }, 415) };
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return { error: json({ error: "too_large" }, 413) };
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
    return { body: parsed as Record<string, unknown> };
  } catch {
    return { error: json({ error: "bad_request" }, 400) };
  }
}
