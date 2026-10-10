import { randomBytes } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type DeliveryStatus = "pending" | "sending" | "sent" | "failed";

export interface OtpChallenge {
  id: string;
  email: string;
  otpHash: string;
  createdAt: number;
  expiresAt: number;
  attemptCount: number;
  resendCount: number;
  lastSentAt: number;
  verified: boolean;
  verifiedAt: number | null;
  deliveryStatus: DeliveryStatus;
}

// Expired challenges are kept briefly (so a retry after a delivery failure still works), then pruned on every write.
const EXPIRED_RETENTION_MS = 60 * 60 * 1000;

/**
 * File-backed challenge store for a single running Node process. All mutations are synchronous read-modify-write
 * steps on cached objects (no `await` between read and write), and file writes are serialised and atomic
 * (temp file + rename). Only the OTP *hash* is ever stored, never the code.
 *
 * It is not shared between multiple instances: on serverless or multi-instance hosting, replace this class with
 * a shared store (Redis, a database) behind the same methods.
 */
export class FileOtpStore {
  private cache: Map<string, OtpChallenge> | null = null;
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  private async load(): Promise<Map<string, OtpChallenge>> {
    if (this.cache) return this.cache;
    try {
      const entries = JSON.parse(await readFile(/*turbopackIgnore: true*/ this.filePath, "utf8")) as OtpChallenge[];
      this.cache = new Map(entries.map((e) => [e.id, e]));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
      this.cache = new Map();
    }
    return this.cache;
  }

  private async persist(): Promise<void> {
    const map = await this.load();
    const now = Date.now();
    for (const [id, c] of map) if (c.expiresAt + EXPIRED_RETENTION_MS < now) map.delete(id);
    const data = JSON.stringify([...map.values()]);
    const tmp = `${this.filePath}.${process.pid}.${now}.tmp`;
    const attempt = this.queue.catch(() => {}).then(async () => {
      await mkdir(/*turbopackIgnore: true*/ path.dirname(this.filePath), { recursive: true });
      await writeFile(/*turbopackIgnore: true*/ tmp, data, "utf8");
      await rename(/*turbopackIgnore: true*/ tmp, /*turbopackIgnore: true*/ this.filePath);
    });
    this.queue = attempt.catch(() => {});
    await attempt;
  }

  async create(email: string, otpHash: string, ttlMs: number): Promise<OtpChallenge> {
    const map = await this.load();
    const now = Date.now();
    const c: OtpChallenge = {
      id: randomBytes(18).toString("base64url"),
      email,
      otpHash,
      createdAt: now,
      expiresAt: now + ttlMs,
      attemptCount: 0,
      resendCount: 0,
      lastSentAt: now,
      verified: false,
      verifiedAt: null,
      deliveryStatus: "pending",
    };
    map.set(c.id, c);
    await this.persist();
    return c;
  }

  async getById(id: string): Promise<OtpChallenge | undefined> {
    return (await this.load()).get(id);
  }

  private async must(id: string): Promise<OtpChallenge> {
    const c = await this.getById(id);
    if (!c) throw new Error("challenge_not_found");
    return c;
  }

  async replaceOtp(id: string, otpHash: string, ttlMs: number): Promise<OtpChallenge> {
    const c = await this.must(id);
    const now = Date.now();
    c.otpHash = otpHash;
    c.expiresAt = now + ttlMs;
    c.attemptCount = 0;
    c.resendCount += 1;
    c.lastSentAt = now;
    await this.persist();
    return c;
  }

  async incrementAttempts(id: string): Promise<OtpChallenge> {
    const c = await this.must(id);
    c.attemptCount += 1;
    await this.persist();
    return c;
  }

  async markVerified(id: string): Promise<OtpChallenge> {
    const c = await this.must(id);
    c.verified = true;
    c.verifiedAt = Date.now();
    await this.persist();
    return c;
  }

  async setDeliveryStatus(id: string, status: DeliveryStatus): Promise<OtpChallenge> {
    const c = await this.must(id);
    c.deliveryStatus = status;
    await this.persist();
    return c;
  }

  async invalidate(id: string): Promise<void> {
    (await this.load()).delete(id);
    await this.persist();
  }
}

const g = globalThis as unknown as { __nexeaOtpStore?: FileOtpStore };

/** One store per process (and per file), shared by every route handler, surviving dev hot reloads. */
export function getOtpStore(): FileOtpStore {
  if (!g.__nexeaOtpStore) {
    const file = process.env.OTP_STORE_PATH || path.join(/*turbopackIgnore: true*/ process.cwd(), ".data", "otp-challenges.json");
    g.__nexeaOtpStore = new FileOtpStore(path.resolve(file));
  }
  return g.__nexeaOtpStore;
}
