import { JsonLd } from "@/components/seo/JsonLd";
import { PAGES } from "@/data/seo";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { LegalHero } from "@/components/legal/LegalHero";
import { ServiceNavigator } from "@/components/navigator/ServiceNavigator";

export const metadata = pageMetadata(PAGES.navigator);

export default function ServiceNavigatorPage() {
  return (
    <>
      <JsonLd data={pageSchema(PAGES.navigator)} />
      <main id="main">
        <LegalHero
          eyebrow="Nexea / Service Navigator"
          headingId="navigator-heading"
          title="Which Nexea Service Fits You?"
          description="Five short questions to find the area of Nexea's expertise that best matches your objectives."
          breadcrumb="Service Navigator"
        />
        <section aria-label="Service Navigator" className="bg-frost py-10 text-muted sm:py-12 lg:py-16">
          <div className="container-nx">
            <ServiceNavigator />
          </div>
        </section>
      </main>
    </>
  );
}
