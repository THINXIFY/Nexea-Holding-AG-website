import { abs } from "@/lib/seo";

/**
 * Self-referencing canonical and og:url for the home page, with the preferred trailing slash (`https://nexea-holding.com/`).
 * Next.js's metadata API normalises the root URL to the slash-less form, so these two tags are rendered here; React 19
 * hoists <link> and <meta> into <head>, and the home metadata deliberately omits them so there is never a duplicate.
 */
export function HomeCanonical() {
  return (
    <>
      <link rel="canonical" href={abs("/")} />
      <meta property="og:url" content={abs("/")} />
    </>
  );
}
