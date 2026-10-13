import { JsonLd } from "@/components/seo/JsonLd";
import { PAGES } from "@/data/seo";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalDocumentBody } from "@/components/legal/LegalDocumentBody";
import { LegalNav } from "@/components/impressum/LegalNav";
import { PRIVACY_POLICY as doc } from "@/data/legal-documents";

export const metadata = pageMetadata(PAGES.privacy);

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={pageSchema(PAGES.privacy)} />
      <main id="main">
        <LegalHero eyebrow={doc.eyebrow} headingId={doc.headingId} title={doc.title} description={doc.description} breadcrumb={doc.breadcrumb} />
        <div className="bg-pure py-10 text-muted sm:py-12 lg:py-16">
          <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-x-16">
            <LegalNav sections={doc.sections} />
            <LegalDocumentBody doc={doc} />
          </div>
        </div>
      </main>
    </>
  );
}
