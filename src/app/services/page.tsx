import { JsonLd } from "@/components/seo/JsonLd";
import { PAGES } from "@/data/seo";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { SvHero } from "@/components/services/SvHero";
import { SvIntro } from "@/components/services/SvIntro";
import { SvAreas } from "@/components/services/SvAreas";
import { SvNavigator } from "@/components/services/SvNavigator";
import { SvCapabilities } from "@/components/services/SvCapabilities";
import { SvIndustries } from "@/components/services/SvIndustries";
import { SvAudiences } from "@/components/services/SvAudiences";
import { SvApproach } from "@/components/services/SvApproach";
import { SvCta } from "@/components/services/SvCta";

export const metadata = pageMetadata(PAGES.services);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={pageSchema(PAGES.services)} />
      <main id="main">
        <SvHero />
        <SvIntro />
        <SvAreas />
        <SvNavigator />
        <SvCapabilities />
        <SvIndustries />
        <SvAudiences />
        <SvApproach />
        <SvCta />
      </main>
    </>
  );
}
