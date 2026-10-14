import Image from "@/components/ui/DeferredImage";
import { ADDRESS_LINES, COMPANY, MAPS_LINK_URL } from "@/data/company";
import { BackToTop } from "@/components/layout/BackToTop";
import { FooterGroup, type FooterLink } from "@/components/layout/FooterNav";
import { Wordmark } from "@/components/ui/Wordmark";

const COMPANY_LINKS: readonly FooterLink[] = [
  { label: "About Nexea", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Our Partners", href: "/partnerships" },
  { label: "Contact", href: "/contact" },
];

const EXPLORE_LINKS: readonly FooterLink[] = [
  { label: "Investments", href: "/investments" },
  { label: "Our Services", href: "/services" },
  { label: "Investment Sectors", href: "/investments#sectors" },
  { label: "Our Approach", href: "/investments#approach" },
];

const LEGAL_LINKS: readonly FooterLink[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative isolate overflow-hidden bg-obsidian text-silver">
      {/* Approved architectural pattern: static, never tiled; shown at 22% opacity. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/footer-pattern.png"
          alt=""
          fill
          sizes="100vw"
          quality={80}
          className="object-cover object-[75%_100%] opacity-[0.22] md:object-[50%_100%]"
        />
      </div>

      <div className="container-nx">
        {/* A. Branding + navigation */}
        <div className="grid gap-x-10 gap-y-9 pb-10 pt-12 sm:pt-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-0 lg:pb-14 lg:pt-16">
          <div className="md:col-span-2 lg:col-span-4 xl:pr-10">
            <Wordmark variant="footer" imageClassName="h-[3.25rem] sm:h-[3.625rem]" />
            <p className="mt-6 max-w-[22rem] text-[1rem] leading-[1.6] text-platinum">
              Swiss investment holding company focused on long-term value creation and international opportunities.
            </p>
            <p className="mt-3 flex items-center gap-3 font-ui text-[0.75rem] font-medium uppercase tracking-[0.16em] text-silver">
              <span aria-hidden className="h-px w-6 bg-silver/60" />
              Hergiswil NW, Switzerland
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:grid md:grid-cols-3 md:gap-x-8 lg:col-span-6">
            <FooterGroup title="Company" links={COMPANY_LINKS} />
            <FooterGroup title="Explore" links={EXPLORE_LINKS} />
            <FooterGroup title="Legal" links={LEGAL_LINKS} />
          </nav>

          <div className="md:col-span-2 lg:col-span-2">
            <h2 className="font-ui text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-silver">Get in Touch</h2>
            <p className="mt-4 md:mt-5">
              <a href={`mailto:${COMPANY.email}`} className="link-underline inline-flex min-h-10 items-center text-[0.9375rem] text-platinum transition-colors duration-300 hover:text-pure [overflow-wrap:anywhere] md:min-h-0">
                {COMPANY.email}
              </a>
            </p>
            <address id="corporate-information" className="mt-4 scroll-mt-28 text-[0.9375rem] not-italic leading-[1.6] text-silver">
              <a
                href={MAPS_LINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-block transition-colors duration-300 hover:text-pure"
              >
                <span className="block font-ui font-semibold text-platinum">{COMPANY.name}</span>
                {ADDRESS_LINES.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
                <span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
            </address>
          </div>
        </div>

        {/* B. Divider */}
        <div aria-hidden className="h-px bg-gradient-to-r from-[#34414c] via-silver/30 to-[#34414c]" />

        {/* C. Copyright bar */}
        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-silver">
            &copy; <span suppressHydrationWarning>{year}</span> Nexea Holding AG. All rights reserved.
          </p>
          <div className="flex items-center justify-between gap-6 sm:justify-end sm:gap-8">
            <p className="eyebrow text-[0.625rem] text-silver">Switzerland · Global Perspective</p>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
