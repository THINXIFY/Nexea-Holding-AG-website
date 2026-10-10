import type { Metadata } from "next";
import { TeamHero } from "@/components/team/TeamHero";
import { TeamIntro } from "@/components/team/TeamIntro";
import { TeamBoard } from "@/components/team/TeamBoard";
import { TeamExecutive } from "@/components/team/TeamExecutive";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: { absolute: "Our Team | Nexea Holding AG" },
  description:
    "Meet the Board of Directors and Executive Management of Nexea Holding AG, a Swiss investment holding company.",
  // Canonical URL goes here once the production domain is known.
  openGraph: {
    title: "Our Team | Nexea Holding AG",
    description: "Leadership with Perspective.",
    type: "website",
    locale: "en_CH",
  },
};

export default function TeamPage() {
  return (
    <main id="main">
      <TeamHero />
      <TeamIntro />
      <TeamBoard />
      <TeamExecutive />
      <CtaBanner
        headingId="team-cta-heading"
        eyebrow="Connect with Nexea"
        headline={["Let’s Start", "a Conversation."]}
        lead="Connect with Nexea Holding AG regarding corporate enquiries, potential business opportunities, or strategic collaborations."
        primary={{ label: "Contact Nexea", href: "/contact" }}
        secondary={{ label: "Explore Partnerships", href: "/partnerships" }}
        microtext={["Leadership", "Governance", "Long-Term Perspective"]}
        image={{ src: "/images/team-cta.jpg", position: "50% 55%", filter: "[filter:saturate(0.7)_brightness(1.25)]" }}
        cols="5-7"
        accent="corner"
      />
    </main>
  );
}
