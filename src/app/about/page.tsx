import { JsonLd } from "@/components/seo/JsonLd";
import { PAGES } from "@/data/seo";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { AboutHero } from "@/components/about/AboutHero";
import { WhoWeAre } from "@/components/about/WhoWeAre";
import { Journey } from "@/components/about/Journey";
import { InvestmentPerspective } from "@/components/about/InvestmentPerspective";
import { Principles } from "@/components/about/Principles";
import { Governance } from "@/components/about/Governance";
import { AboutCta } from "@/components/about/AboutCta";

export const metadata = pageMetadata(PAGES.about);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={pageSchema(PAGES.about)} />
      <main id="main">
        <AboutHero />
        <WhoWeAre />
        <Journey />
        <InvestmentPerspective />
        <Principles />
        <Governance />
        <AboutCta />
      </main>
    </>
  );
}
