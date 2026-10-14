import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

// Next.js serves this with a real 404 status and a noindex directive; it is spelled out here so the intent is explicit.
export const metadata: Metadata = {
  title: { absolute: "Page not found | Nexea Holding AG" },
  robots: { index: false, follow: true },
};

/** Branded 404: a clear message plus links back into the main sections, so neither visitors nor crawlers hit a dead end. */
export default function NotFound() {
  return (
    <main id="main" className="on-dark relative isolate flex min-h-[72svh] flex-col justify-center overflow-hidden bg-obsidian text-pure">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_85%_0%,rgba(174,190,202,0.14),transparent_60%)]" />
      <div className="container-nx py-36 sm:py-40">
        <p className="eyebrow flex items-center gap-4 text-platinum">
          <span aria-hidden className="h-px w-10 shrink-0 bg-silver/70" />
          404 / Page not found
        </p>
        <h1 className="mt-6 max-w-[40rem] font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.05] tracking-[-0.012em] text-pure">
          This page could not be found.
        </h1>
        <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-[1.6] text-platinum/90">
          The page may have moved or no longer exists. Continue to the Nexea Holding AG homepage, or choose one of the sections below.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Button href="/" variant="solid-light" className="w-full sm:w-auto">Nexea Holding AG Home</Button>
          <Button href="/about" variant="outline-light" className="w-full sm:w-auto">About Us</Button>
          <Button href="/investments" variant="outline-light" className="w-full sm:w-auto">Investments</Button>
          <Button href="/services" variant="outline-light" className="w-full sm:w-auto">Services</Button>
          <Button href="/contact" variant="outline-light" className="w-full sm:w-auto">Contact</Button>
        </div>
      </div>
    </main>
  );
}
