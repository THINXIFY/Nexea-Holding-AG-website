import type { Metadata } from "next";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalDocumentBody } from "@/components/legal/LegalDocumentBody";
import { LegalNav } from "@/components/impressum/LegalNav";
import { TERMS as doc } from "@/data/legal-documents";

export const metadata: Metadata = {
  title: { absolute: "Terms & Conditions | Nexea Holding AG" },
  description:
    "Read the website terms governing access to Nexea Holding AG's corporate, investment, and proposed consulting information.",
  // Canonical URL goes here once the production host is confirmed.
  openGraph: {
    title: "Terms & Conditions | Nexea Holding AG",
    description: doc.description,
    type: "website",
    locale: "en_CH",
  },
};

export default function TermsPage() {
  return (
    <main id="main">
      <LegalHero eyebrow={doc.eyebrow} headingId={doc.headingId} title={doc.title} description={doc.description} breadcrumb={doc.breadcrumb} />
      <div className="bg-pure py-10 text-muted sm:py-12 lg:py-16">
        <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-x-16">
          <LegalNav sections={doc.sections} />
          <LegalDocumentBody doc={doc} />
        </div>
      </div>
    </main>
  );
}
