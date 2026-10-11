import type { Metadata } from "next";
import { SvHero } from "@/components/services/SvHero";
import { SvIntro } from "@/components/services/SvIntro";
import { SvAreas } from "@/components/services/SvAreas";
import { SvNavigator } from "@/components/services/SvNavigator";
import { SvCapabilities } from "@/components/services/SvCapabilities";
import { SvIndustries } from "@/components/services/SvIndustries";
import { SvAudiences } from "@/components/services/SvAudiences";
import { SvApproach } from "@/components/services/SvApproach";
import { SvCta } from "@/components/services/SvCta";

export const metadata: Metadata = {
  title: { absolute: "Services & Expertise | Nexea Holding AG" },
  description:
    "Explore Nexea Holding AG's expertise in investment strategy, corporate transactions, business development, research, and technological innovation.",
  // Canonical URL goes here once the production domain is known.
  openGraph: {
    title: "Services & Expertise | Nexea Holding AG",
    description: "Perspective Beyond Capital.",
    type: "website",
    locale: "en_CH",
  },
};

export default function ServicesPage() {
  return (
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
  );
}
