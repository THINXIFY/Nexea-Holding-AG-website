import type { Metadata } from "next";
import { ContactProvider } from "@/components/contact/ContactProvider";
import { ContactHero } from "@/components/contact/ContactHero";
import { EnquirySelector } from "@/components/contact/EnquirySelector";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { CorporateInfo } from "@/components/contact/CorporateInfo";
import { Location } from "@/components/contact/Location";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: { absolute: "Contact Nexea Holding AG | Switzerland" },
  description:
    "Contact Nexea Holding AG in Hergiswil, Switzerland, regarding corporate enquiries, potential investment opportunities, and strategic partnerships.",
  // Set `alternates.canonical` to https://nexea-holding.com/contact once that is confirmed as the production host.
  openGraph: {
    title: "Contact Nexea Holding AG | Switzerland",
    description: "Let’s Start a Conversation.",
    type: "website",
    locale: "en_CH",
  },
};

export default function ContactPage() {
  return (
    <ContactProvider>
      <main id="main">
        <ContactHero />
        <EnquirySelector />
        <EnquiryForm />
        <CorporateInfo />
        <Location />
        <CtaBanner
          headingId="contact-cta-heading"
          eyebrow="Partnerships & Opportunities"
          headline={["Have an Opportunity", "in Mind?"]}
          lead="Explore potential collaborations, business opportunities, and corporate partnerships aligned with Nexea's investment interests."
          primary={{ label: "Explore Partners", href: "/partnerships" }}
          secondary={{ label: "Submit an Enquiry", href: "#enquiry-form" }}
          microtext={["Swiss Foundations", "International Perspective"]}
          image={{ src: "/images/contact-cta.jpg", position: "50% 45%", filter: "[filter:saturate(0.7)_brightness(1.3)]" }}
          cols="5-7"
          accent="ticks"
        />
      </main>
    </ContactProvider>
  );
}
