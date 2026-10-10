import { CtaBanner } from "@/components/sections/CtaBanner";

/** Homepage closing CTA: 5/7 columns, vertical rule accent, New York dusk skyline. */
export function ContactCta() {
  return (
    <CtaBanner
      id="contact"
      headingId="contact-heading"
      eyebrow="Connect with Nexea"
      headline={["Let’s Explore", "What Comes Next."]}
      lead="Meaningful opportunities begin with an informed conversation."
      body="Connect with Nexea Holding AG to introduce a business, discuss a partnership, or share an opportunity for consideration."
      primary={{ label: "Contact Nexea", href: "/contact" }}
      secondary={{ label: "Explore Partnerships", href: "/partnerships" }}
      microtext={["Swiss Foundations", "International Perspective"]}
      image={{ src: "/images/home-cta.webp", position: "50% 40%", filter: "[filter:saturate(0.8)_brightness(1.7)_contrast(1.05)]" }}
      cols="5-7"
      accent="rule"
    />
  );
}
