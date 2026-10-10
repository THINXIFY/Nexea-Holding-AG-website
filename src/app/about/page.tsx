import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { WhoWeAre } from "@/components/about/WhoWeAre";
import { Journey } from "@/components/about/Journey";
import { InvestmentPerspective } from "@/components/about/InvestmentPerspective";
import { Principles } from "@/components/about/Principles";
import { Governance } from "@/components/about/Governance";
import { AboutCta } from "@/components/about/AboutCta";

export const metadata: Metadata = {
  title: { absolute: "About Nexea Holding AG | Swiss Investment Holding Company" },
  description:
    "Nexea Holding AG is a Swiss investment holding company, established in 2004 and headquartered in Hergiswil, with an international investment mandate focused on corporate participations.",
  // Canonical URL and BreadcrumbList structured data need absolute URLs: add them once the production domain is known.
  openGraph: {
    title: "About Nexea Holding AG",
    description: "Independent Thinking. Global Perspective.",
    type: "website",
    locale: "en_CH",
  },
};

export default function AboutPage() {
  return (
    <main id="main">
      <AboutHero />
      <WhoWeAre />
      <Journey />
      <InvestmentPerspective />
      <Principles />
      <Governance />
      <AboutCta />
    </main>
  );
}
