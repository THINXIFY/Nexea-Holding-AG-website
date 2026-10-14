import { HomeCanonical } from "@/components/seo/HomeCanonical";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAGES } from "@/data/seo";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { About } from "@/components/sections/About";
import { InvestmentUniverse } from "@/components/sections/InvestmentUniverse";
import { FeaturedSectors } from "@/components/sections/FeaturedSectors";
import { Philosophy } from "@/components/sections/Philosophy";
import { Expertise } from "@/components/sections/Expertise";
import { Approach } from "@/components/sections/Approach";
import { GlobalPerspective } from "@/components/sections/GlobalPerspective";
import { Partnerships } from "@/components/sections/Partnerships";
import { ContactCta } from "@/components/sections/ContactCta";

export const metadata = pageMetadata(PAGES.home);

export default function HomePage() {
  return (
    <>
      <HomeCanonical />
      <JsonLd data={pageSchema(PAGES.home)} />
      <main id="main">
        <HeroSlider />
        <About />
        <InvestmentUniverse />
        <FeaturedSectors />
        <Philosophy />
        <Expertise />
        <Approach />
        <GlobalPerspective />
        <Partnerships />
        <ContactCta />
      </main>
    </>
  );
}
