import { JsonLd } from "@/components/seo/JsonLd";
import { PAGES } from "@/data/seo";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { InvHero } from "@/components/investments/InvHero";
import { InvOverview } from "@/components/investments/InvOverview";
import { InvPillars } from "@/components/investments/InvPillars";
import { SectorDirectory } from "@/components/investments/SectorDirectory";
import { InvPhilosophy } from "@/components/investments/InvPhilosophy";
import { InvCriteria } from "@/components/investments/InvCriteria";
import { InvApproach } from "@/components/investments/InvApproach";
import { InvChallenge } from "@/components/investments/InvChallenge";
import { InvCta } from "@/components/investments/InvCta";

export const metadata = pageMetadata(PAGES.investments);

export default function InvestmentsPage() {
  return (
    <>
      <JsonLd data={pageSchema(PAGES.investments)} />
      <main id="main">
        <InvHero />
        <InvOverview />
        <InvPillars />
        <SectorDirectory />
        <InvPhilosophy />
        <InvCriteria />
        <InvChallenge />
        <InvApproach />
        <InvCta />
      </main>
    </>
  );
}
