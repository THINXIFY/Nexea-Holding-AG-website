import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

/** Resend allows 40 MB per message after base64 encoding (~33% larger), so keep the raw total comfortably below. */
export const MAX_TOTAL_BYTES = 28 * 1024 * 1024;

/** The documents folder that ships with the repository (`private/documents`, outside `public/`, so it is never web-served). */
const bundledDir = () => path.resolve(path.join(/*turbopackIgnore: true*/ process.cwd(), "private", "documents"));

/**
 * Folders searched for PDFs, in order: an explicit DOCUMENTS_DIR override first, then the bundled folder. The first
 * folder that actually contains PDFs wins, so a leftover or empty override can never disable document delivery.
 */
const candidateDirs = (): string[] => {
  const override = process.env.DOCUMENTS_DIR?.trim();
  return [...new Set([...(override ? [path.resolve(override)] : []), bundledDir()])];
};

export interface PrivateDocument {
  filename: string;
  bytes: number;
}

async function listIn(dir: string): Promise<PrivateDocument[]> {
  let names: string[];
  try {
    names = await readdir(/*turbopackIgnore: true*/ dir);
  } catch {
    return [];
  }
  const out: PrivateDocument[] = [];
  for (const name of names.sort()) {
    if (name.startsWith(".") || path.extname(name).toLowerCase() !== ".pdf" || name !== path.basename(name)) continue;
    try {
      const s = await stat(/*turbopackIgnore: true*/ path.join(dir, name));
      if (s.isFile() && s.size > 0) out.push({ filename: name, bytes: s.size });
    } catch {
      /* unreadable file: skipped */
    }
  }
  return out;
}

/**
 * The PDFs available for delivery: every regular, non-empty, non-hidden `.pdf` file directly inside the first
 * candidate folder that has any (sub-folders and other file types are ignored). Never reads outside those folders.
 */
async function resolveDocuments(): Promise<{ dir: string; docs: PrivateDocument[] }> {
  for (const dir of candidateDirs()) {
    const docs = await listIn(dir);
    if (docs.length > 0) return { dir, docs };
  }
  return { dir: bundledDir(), docs: [] };
}

export async function listDocuments(): Promise<PrivateDocument[]> {
  return (await resolveDocuments()).docs;
}

export async function documentsAvailable(): Promise<boolean> {
  const docs = await listDocuments();
  return docs.length > 0 && docs.reduce((n, d) => n + d.bytes, 0) <= MAX_TOTAL_BYTES;
}

export async function loadDocuments(): Promise<{ filename: string; content: Buffer }[]> {
  const { dir, docs } = await resolveDocuments();
  const total = docs.reduce((n, d) => n + d.bytes, 0);
  if (docs.length === 0 || total > MAX_TOTAL_BYTES) throw new Error("documents_unavailable");
  const loaded = await Promise.all(docs.map(async (d) => ({ filename: d.filename, content: await readFile(/*turbopackIgnore: true*/ path.join(dir, d.filename)) })));
  // A file that changed or vanished between listing and reading must never produce a partial delivery.
  if (loaded.some((d) => d.content.byteLength === 0)) throw new Error("documents_unavailable");
  return loaded;
}
