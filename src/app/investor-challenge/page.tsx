import { JsonLd } from "@/components/seo/JsonLd";
import { PAGES } from "@/data/seo";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { InvestorChallenge } from "@/components/challenge/InvestorChallenge";

export const metadata = pageMetadata(PAGES.challenge);

export default function InvestorChallengePage() {
  return (
    <>
      <JsonLd data={pageSchema(PAGES.challenge)} />
      <main id="main">
        <InvestorChallenge />
      </main>
    </>
  );
}
