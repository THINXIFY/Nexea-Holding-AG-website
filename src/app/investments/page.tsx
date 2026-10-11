import type { Metadata } from "next";
import { InvHero } from "@/components/investments/InvHero";
import { InvOverview } from "@/components/investments/InvOverview";
import { InvPillars } from "@/components/investments/InvPillars";
import { SectorDirectory } from "@/components/investments/SectorDirectory";
import { InvPhilosophy } from "@/components/investments/InvPhilosophy";
import { InvCriteria } from "@/components/investments/InvCriteria";
import { InvApproach } from "@/components/investments/InvApproach";
import { InvChallenge } from "@/components/investments/InvChallenge";
import { InvCta } from "@/components/investments/InvCta";

export const metadata: Metadata = {
  title: { absolute: "Investments | Nexea Holding AG" },
  description:
    "Explore Nexea Holding AG's investment interests across real assets, technology, industry, healthcare, energy, and international business opportunities.",
  // Canonical URL goes here once the production domain is known.
  openGraph: {
    title: "Investments | Nexea Holding AG",
    description: "Investing with Perspective.",
    type: "website",
    locale: "en_CH",
  },
};

export default function InvestmentsPage() {
  return (
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
  );
}
