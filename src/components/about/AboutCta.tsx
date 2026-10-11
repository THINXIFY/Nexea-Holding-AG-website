import { CtaBanner } from "@/components/sections/CtaBanner";

/** About closing CTA: even 6/6 columns, vertical-tick accent, executive-office window view. */
export function AboutCta() {
  return (
    <CtaBanner
      headingId="ac-heading"
      eyebrow="Connect with Nexea"
      headline={["Let’s Explore", "What’s Next."]}
      lead="Meaningful opportunities begin with the right conversation."
      body="Connect with Nexea Holding AG to introduce a business, discuss a potential investment opportunity, or explore a strategic partnership."
      primary={{ label: "Contact Nexea", href: "/contact" }}
      secondary={{ label: "Explore Partners", href: "/partnerships" }}
      microtext={["Independent Thinking", "Global Perspective"]}
      image={{ src: "/images/ab-cta.jpg", position: "62% 50%", filter: "[filter:grayscale(0.2)_brightness(1.9)_contrast(1.05)]" }}
      cols="6-6"
      accent="ticks"
    />
  );
}
