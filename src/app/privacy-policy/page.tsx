import type { Metadata } from "next";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalDocumentBody } from "@/components/legal/LegalDocumentBody";
import { LegalNav } from "@/components/impressum/LegalNav";
import { PRIVACY_POLICY as doc } from "@/data/legal-documents";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | Nexea Holding AG" },
  description:
    "Learn how Nexea Holding AG handles personal information submitted through its corporate, investment-related, and business enquiry channels.",
  // Canonical URL goes here once the production host is confirmed.
  openGraph: {
    title: "Privacy Policy | Nexea Holding AG",
    description: doc.description,
    type: "website",
    locale: "en_CH",
  },
};

export default function PrivacyPolicyPage() {
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
