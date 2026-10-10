import type { Metadata } from "next";
import { PartnersHero } from "@/components/partnerships/PartnersHero";
import { PartnersPerspective } from "@/components/partnerships/PartnersPerspective";
import { PartnerMarquee } from "@/components/partnerships/PartnerMarquee";
import { PartnerPathways } from "@/components/partnerships/PartnerPathways";
import { PartnerCollaborators } from "@/components/partnerships/PartnerCollaborators";
import { PartnerFramework } from "@/components/partnerships/PartnerFramework";
import { PartnersCta } from "@/components/partnerships/PartnersCta";

const TITLE = "Partnerships & Our Partners | Nexea Holding AG";
const DESCRIPTION =
  "Explore Nexea Holding AG's approach to investment partnerships, strategic business alliances, international collaboration, and corporate opportunities.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://nexea-holding.com/partnerships" },
  openGraph: {
    title: TITLE,
    description: "Stronger Connections. Broader Opportunities.",
    url: "https://nexea-holding.com/partnerships",
    type: "website",
    locale: "en_CH",
    siteName: "Nexea Holding AG",
    images: [{ url: "https://nexea-holding.com/images/partnerships-hero.webp", width: 1672, height: 941, alt: "Executive boardroom overlooking a Swiss lake at twilight" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["https://nexea-holding.com/images/partnerships-hero.webp"],
  },
};

export default function PartnershipsPage() {
  return (
    <main id="main">
      <PartnersHero />
      <PartnersPerspective />
      <PartnerMarquee />
      <PartnerPathways />
      <PartnerCollaborators />
      <PartnerFramework />
      <PartnersCta />
    </main>
  );
}
