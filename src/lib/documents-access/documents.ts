import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

/** Resend allows 40 MB per message after base64 encoding (~33% larger), so keep the raw total comfortably below. */
export const MAX_TOTAL_BYTES = 28 * 1024 * 1024;

export const documentsDir = () => path.resolve(process.env.DOCUMENTS_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "private", "documents"));

export interface PrivateDocument {
  filename: string;
  bytes: number;
}

/**
 * The PDFs available for delivery: every regular, non-empty, non-hidden `.pdf` file directly inside the private
 * documents folder (sub-folders and other file types are ignored). Never reads outside that folder.
 */
export async function listDocuments(): Promise<PrivateDocument[]> {
  const dir = documentsDir();
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

export async function documentsAvailable(): Promise<boolean> {
  const docs = await listDocuments();
  return docs.length > 0 && docs.reduce((n, d) => n + d.bytes, 0) <= MAX_TOTAL_BYTES;
}

export async function loadDocuments(): Promise<{ filename: string; content: Buffer }[]> {
  const docs = await listDocuments();
  const total = docs.reduce((n, d) => n + d.bytes, 0);
  if (docs.length === 0 || total > MAX_TOTAL_BYTES) throw new Error("documents_unavailable");
  const dir = documentsDir();
  const loaded = await Promise.all(docs.map(async (d) => ({ filename: d.filename, content: await readFile(/*turbopackIgnore: true*/ path.join(dir, d.filename)) })));
  // A file that changed or vanished between listing and reading must never produce a partial delivery.
  if (loaded.some((d) => d.content.byteLength === 0)) throw new Error("documents_unavailable");
  return loaded;
}
