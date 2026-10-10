/**
 * Small in-memory sliding-window limiter. It protects a single server process.
 * On serverless / multi-instance hosting each instance keeps its own counters, so
 * put a shared store (e.g. Redis) behind this function if you need a global limit.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): { allowed: boolean; retryAfterSec: number } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000)) };
  }
  recent.push(now);
  hits.set(key, recent);
  // opportunistic cleanup so the map cannot grow without bound
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  return { allowed: true, retryAfterSec: 0 };
}
