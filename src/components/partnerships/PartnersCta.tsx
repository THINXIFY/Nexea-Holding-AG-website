import { CtaBanner } from "@/components/sections/CtaBanner";

/** Partnerships closing CTA (shared CtaBanner family; city-at-night photograph, corner linework). */
export function PartnersCta() {
  return (
    <CtaBanner
      headingId="partners-cta-heading"
      eyebrow="Connect with Nexea"
      headline={["Let’s Explore What", "We Can Build Together."]}
      lead="Introduce your organization, share a strategic opportunity, or begin a conversation about potential collaboration."
      primary={{ label: "Become a Partner", href: "/contact?type=partnership" }}
      secondary={{ label: "Contact Nexea", href: "/contact" }}
      microtext={["International Perspective", "Strategic Relationships"]}
      image={{ src: "/images/home-cta.webp", position: "50% 30%" }}
      cols="5-7"
      accent="corner"
    />
  );
}
