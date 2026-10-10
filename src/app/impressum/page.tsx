import type { Metadata } from "next";
import { ImpressumHero } from "@/components/impressum/ImpressumHero";
import { LegalNav } from "@/components/impressum/LegalNav";
import { LegalSections } from "@/components/impressum/LegalSections";

export const metadata: Metadata = {
  title: { absolute: "Impressum | Nexea Holding AG" },
  description:
    "Official legal notice and corporate registration information for Nexea Holding AG, a Swiss investment holding company headquartered in Hergiswil, Nidwalden.",
  // Canonical URL goes here once the production host is confirmed.
  openGraph: {
    title: "Impressum | Nexea Holding AG",
    description: "Corporate Identity. Legal Transparency.",
    type: "website",
    locale: "en_CH",
  },
};

export default function ImpressumPage() {
  return (
    <main id="main">
      <ImpressumHero />
      <div className="bg-pure py-10 text-muted sm:py-12 lg:py-16">
        <div className="container-nx grid grid-cols-[minmax(0,1fr)] gap-y-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-x-16">
          <LegalNav />
          <LegalSections />
        </div>
      </div>
    </main>
  );
}
