import type { Metadata } from "next";
import { InvestorChallenge } from "@/components/challenge/InvestorChallenge";

const TITLE = "Think Like an Investor | Investor Challenge | Nexea Holding AG";
const DESCRIPTION = "Five questions. One challenge. Test your knowledge of diversification, due diligence, liquidity and more with the Nexea Investor Challenge.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://nexea-holding.com/investor-challenge" },
  openGraph: {
    title: "Think Like an Investor | Nexea Investor Challenge",
    description: DESCRIPTION,
    url: "https://nexea-holding.com/investor-challenge",
    type: "website",
    locale: "en_CH",
    siteName: "Nexea Holding AG",
    images: [{ url: "https://nexea-holding.com/images/slider/slide-2.png", width: 1672, height: 941, alt: "Nexea Holding AG executive office overlooking an international financial district" }],
  },
  twitter: { card: "summary_large_image", title: "Think Like an Investor | Nexea Investor Challenge", description: DESCRIPTION, images: ["https://nexea-holding.com/images/slider/slide-2.png"] },
};

export default function InvestorChallengePage() {
  return (
    <main id="main">
      <InvestorChallenge />
    </main>
  );
}
