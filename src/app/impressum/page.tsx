import { JsonLd } from "@/components/seo/JsonLd";
import { PAGES } from "@/data/seo";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { ImpressumHero } from "@/components/impressum/ImpressumHero";
import { LegalNav } from "@/components/impressum/LegalNav";
import { LegalSections } from "@/components/impressum/LegalSections";

export const metadata = pageMetadata(PAGES.impressum);

export default function ImpressumPage() {
  return (
    <>
      <JsonLd data={pageSchema(PAGES.impressum)} />
      <main id="main">
        <ImpressumHero />
        <div className="bg-pure py-10 text-muted sm:py-12 lg:py-16">
          <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-x-16">
            <LegalNav />
            <LegalSections />
          </div>
        </div>
      </main>
    </>
  );
}
