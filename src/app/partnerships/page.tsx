import { JsonLd } from "@/components/seo/JsonLd";
import { PAGES } from "@/data/seo";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { PartnersHero } from "@/components/partnerships/PartnersHero";
import { PartnersPerspective } from "@/components/partnerships/PartnersPerspective";
import { PartnerMarquee } from "@/components/partnerships/PartnerMarquee";
import { PartnerPathways } from "@/components/partnerships/PartnerPathways";
import { PartnerCollaborators } from "@/components/partnerships/PartnerCollaborators";
import { PartnerFramework } from "@/components/partnerships/PartnerFramework";
import { PartnersCta } from "@/components/partnerships/PartnersCta";

export const metadata = pageMetadata(PAGES.partnerships);

export default function PartnershipsPage() {
  return (
    <>
      <JsonLd data={pageSchema(PAGES.partnerships)} />
      <main id="main">
        <PartnersHero />
        <PartnersPerspective />
        <PartnerMarquee />
        <PartnerPathways />
        <PartnerCollaborators />
        <PartnerFramework />
        <PartnersCta />
      </main>
    </>
  );
}
