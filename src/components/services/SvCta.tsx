import { CtaBanner } from "@/components/sections/CtaBanner";

/** Services closing CTA: even 6/6 columns, corner accent, river skyline at night. */
export function SvCta() {
  return (
    <CtaBanner
      headingId="sctc-heading"
      eyebrow="Connect with Nexea"
      headline={["Let’s Discuss Your", "Next Opportunity."]}
      lead="Every business opportunity begins with understanding the objectives behind it."
      body="Connect with Nexea Holding AG to introduce a strategic proposal, explore a potential collaboration, or discuss opportunities aligned with its investment interests."
      primary={{ label: "Contact Nexea", href: "/contact" }}
      secondary={{ label: "Explore Partnerships", href: "/partnerships" }}
      microtext={["Strategic Perspective", "International Outlook"]}
      image={{ src: "/images/svc-cta.jpg", position: "62% 50%", filter: "[filter:saturate(0.6)_brightness(1.3)]" }}
      cols="6-6"
      accent="corner"
    />
  );
}
