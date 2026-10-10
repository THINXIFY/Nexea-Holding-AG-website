import { CtaBanner } from "@/components/sections/CtaBanner";

/** Investments closing CTA: the master composition (5/7 columns, no extra accent, Chicago river at night). */
export function InvCta() {
  return (
    <CtaBanner
      headingId="ic-heading"
      eyebrow="Explore Opportunities with Nexea"
      headline={["Let’s Discuss", "What’s Possible."]}
      lead="Meaningful investments begin with understanding the right opportunities."
      body="Introduce your business, asset, or investment proposal for potential consideration by Nexea Holding AG."
      primary={{ label: "Submit an Opportunity", href: "/contact?type=investment" }}
      secondary={{ label: "Contact Nexea", href: "/contact" }}
      microtext={["Independent Thinking", "International Perspective"]}
      image={{ src: "/images/inv-cta.jpg", position: "60% 45%" }}
      cols="5-7"
    />
  );
}
