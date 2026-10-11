import type { Metadata } from "next";
import { LegalHero } from "@/components/legal/LegalHero";
import { ServiceNavigator } from "@/components/navigator/ServiceNavigator";

const TITLE = "Which Nexea Service Fits You? | Nexea Holding AG";
const DESCRIPTION = "Answer five short questions and discover which of Nexea Holding AG's areas of expertise best fits your objectives.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://nexea-holding.com/service-navigator" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "https://nexea-holding.com/service-navigator", type: "website", locale: "en_CH", siteName: "Nexea Holding AG" },
};

export default function ServiceNavigatorPage() {
  return (
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
  );
}
