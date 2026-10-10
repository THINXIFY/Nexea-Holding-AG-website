import { ADDRESS_LINES, COMPANY } from "@/data/company";

/**
 * Website legal documents (Privacy Policy, Terms & Conditions).
 *
 * Wording supplied by Nexea Holding AG; to be reviewed by qualified Swiss legal counsel before
 * public release. Statements about data handling were checked against the implemented site:
 * no analytics, advertising or tracking scripts; no site-set cookies or browser storage; the
 * contact form is delivered by email through a third-party delivery service; the Contact page
 * embeds a Google Maps map. Re-audit this file whenever any of those change.
 */
export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: readonly string[] }
  /** Small run-in heading followed by lines of text (e.g. data-controller details). */
  | { type: "details"; heading: string; lines: readonly string[]; email?: string }
  | { type: "email"; lead: string };

export interface LegalDocSection {
  id: string;
  number: string;
  /** Short label for the section navigation. */
  nav: string;
  /** Section heading. */
  title: string;
  blocks: readonly LegalBlock[];
}

export interface LegalDocument {
  slug: string;
  breadcrumb: string;
  eyebrow: string;
  title: string;
  headingId: string;
  description: string;
  lastUpdated: string;
  sections: readonly LegalDocSection[];
}

const LAST_UPDATED = "10 October 2026";
const contact = (heading: string): LegalBlock => ({
  type: "details",
  heading,
  lines: [COMPANY.name, ...ADDRESS_LINES],
  email: COMPANY.email,
});

export const PRIVACY_POLICY: LegalDocument = {
  slug: "privacy-policy",
  breadcrumb: "Privacy Policy",
  eyebrow: "Nexea / Legal Information",
  title: "Privacy Policy.",
  headingId: "privacy-policy-heading",
  description: "How Nexea Holding AG collects, uses, and protects personal information.",
  lastUpdated: LAST_UPDATED,
  sections: [
    {
      id: "introduction",
      number: "01",
      nav: "Introduction",
      title: "Introduction.",
      blocks: [
        { type: "p", text: "Nexea Holding AG is a Swiss investment holding company with an international business perspective and proposed investment-related consulting capabilities." },
        { type: "p", text: "We respect the privacy of individuals who visit our website or contact us regarding corporate matters, business opportunities, investment proposals, and potential partnerships." },
        { type: "p", text: "This Privacy Policy explains how personal information is processed through our website." },
      ],
    },
    {
      id: "information-we-collect",
      number: "02",
      nav: "Information We Collect",
      title: "Information We Collect.",
      blocks: [
        { type: "p", text: "When you contact us or submit an enquiry, we may collect:" },
        {
          type: "ul",
          items: [
            "Name and contact details.",
            "Company or organization information.",
            "Country or region.",
            "Enquiry subject and message.",
            "Information voluntarily provided about a business or investment opportunity.",
            "Technical information necessary for website operation, security, and performance.",
            "If you request private documents: the email address you provide and a one-time verification code (kept only in a protected, hashed form and only for a limited time).",
          ],
        },
        { type: "p", text: "Please avoid submitting sensitive financial or identity documents through the general contact form." },
      ],
    },
    {
      id: "use-of-information",
      number: "03",
      nav: "Use of Information",
      title: "How We Use Information.",
      blocks: [
        { type: "p", text: "We process personal information for purposes including:" },
        {
          type: "ul",
          items: [
            "Responding to enquiries.",
            "Reviewing potential business and investment opportunities.",
            "Communicating about possible strategic partnerships or proposed consulting engagements.",
            "Verifying your email address and delivering the documents you request.",
            "Operating, maintaining, and securing our website.",
            "Meeting applicable legal obligations.",
          ],
        },
        { type: "p", text: "We process personal information in accordance with applicable Swiss data protection requirements." },
      ],
    },
    {
      id: "sharing-retention",
      number: "04",
      nav: "Sharing & Retention",
      title: "Information Sharing & Retention.",
      blocks: [
        { type: "p", text: "We may share information with service providers where necessary for website hosting, secure communication, technical operations, or other legitimate business purposes." },
        { type: "p", text: "Enquiries submitted through the contact form, and verification codes and requested documents sent to you, are transmitted by email through a third-party email-delivery service." },
        { type: "p", text: "Personal information is retained only for as long as reasonably necessary for the relevant purpose or applicable legal obligations." },
        { type: "p", text: "Information may be processed outside Switzerland where relevant service providers operate, subject to applicable data protection safeguards." },
        { type: "p", text: "We do not sell personal information to advertisers." },
      ],
    },
    {
      id: "cookies-technologies",
      number: "05",
      nav: "Cookies & Technologies",
      title: "Cookies & Website Technologies.",
      blocks: [
        { type: "p", text: "Our website may use essential technologies required for functionality, security, and performance." },
        { type: "p", text: "At the date of this policy, the website does not use analytics, advertising, or tracking technologies of its own and does not present a cookie-consent banner." },
        { type: "p", text: "The Contact page includes an embedded Google Maps map showing our registered address. When the map loads, Google may receive technical information such as your IP address and may use cookies or similar technologies, subject to Google's own privacy terms." },
        { type: "p", text: "Any optional analytics, advertising, or tracking technologies must be disclosed accurately and used only with the consent or other legal basis required by applicable law." },
        { type: "p", text: "Visitors can manage cookies through their browser settings and any consent controls provided on the website." },
      ],
    },
    {
      id: "your-rights",
      number: "06",
      nav: "Your Rights",
      title: "Your Rights.",
      blocks: [
        { type: "p", text: "Subject to applicable law, individuals may request information about their personal data, correction of inaccurate information, or deletion where appropriate." },
        { type: "email", lead: "To submit a privacy-related request, contact:" },
      ],
    },
    {
      id: "updates-contact",
      number: "07",
      nav: "Updates & Contact",
      title: "Policy Updates & Contact.",
      blocks: [
        { type: "p", text: "We may update this Privacy Policy when our services, website technologies, or applicable requirements change." },
        contact("Data Controller / Responsible Company"),
      ],
    },
  ],
};

export const TERMS: LegalDocument = {
  slug: "terms-and-conditions",
  breadcrumb: "Terms & Conditions",
  eyebrow: "Nexea / Website Terms",
  title: "Terms & Conditions.",
  headingId: "terms-heading",
  description: "Important information governing the use of our website and its corporate, investment, and consulting-related content.",
  lastUpdated: LAST_UPDATED,
  sections: [
    {
      id: "general-information",
      number: "01",
      nav: "General Information",
      title: "General Information.",
      blocks: [
        { type: "p", text: "This website is operated by Nexea Holding AG, a legally registered Swiss investment holding company headquartered in Hergiswil, Switzerland." },
        { type: "p", text: "By accessing or using this website, visitors agree to comply with these website terms, subject to applicable law." },
      ],
    },
    {
      id: "investment-consulting",
      number: "02",
      nav: "Investment & Consulting",
      title: "Investment & Consulting Information.",
      blocks: [
        { type: "p", text: "Nexea Holding AG's registered purpose includes acquiring, managing, and disposing of corporate participations for its own account." },
        { type: "p", text: "The website also describes proposed investment-related consulting, corporate strategy, and business development capabilities. These represent areas of potential development, and any consulting engagement would be subject to a separate agreement and applicable requirements." },
      ],
    },
    {
      id: "investment-activities",
      number: "03",
      nav: "Investment Activities",
      title: "Investment Activities & Corporate Opportunities.",
      blocks: [
        { type: "p", text: "Nexea Holding AG is a legally registered Swiss investment holding company with an international investment mandate." },
        { type: "p", text: "The company's activities encompass the acquisition, holding, management, and disposal of corporate participations in domestic and international businesses." },
        { type: "p", text: "Nexea explores investment opportunities across established industries, real assets, emerging technologies, and evolving international markets." },
        { type: "p", text: "The company also identifies investment-related strategic consulting and corporate advisory capabilities as areas for potential business development, subject to applicable requirements." },
        { type: "p", text: "Information on this website is provided for general corporate and informational purposes. Any potential investment or commercial transaction is subject to independent evaluation, applicable requirements, and definitive written agreements." },
      ],
    },
    {
      id: "website-use",
      number: "04",
      nav: "Website Use",
      title: "Website Use.",
      blocks: [
        { type: "p", text: "Visitors agree not to misuse the website, interfere with its security, submit unlawful material, or attempt unauthorized access." },
        { type: "p", text: "Information submitted through enquiry forms should be accurate and relevant to the purpose of the communication." },
        { type: "p", text: "Submitting an investment or partnership enquiry does not establish an advisory relationship or create an obligation for Nexea Holding AG to respond, invest, or enter into negotiations." },
      ],
    },
    {
      id: "intellectual-property",
      number: "05",
      nav: "Intellectual Property",
      title: "Intellectual Property.",
      blocks: [
        { type: "p", text: "Unless otherwise stated, the original content, branding, design, and materials presented on this website are subject to applicable intellectual property rights." },
        { type: "p", text: "Third-party photographs, software, and other licensed content remain subject to their respective rights and licenses." },
      ],
    },
    {
      id: "liability-links",
      number: "06",
      nav: "Liability & Links",
      title: "Accuracy, Liability & External Links.",
      blocks: [
        { type: "p", text: "Nexea Holding AG aims to provide reliable and current corporate information, but website content may change." },
        { type: "p", text: "Visitors should independently assess information relevant to legal, financial, or commercial decisions." },
        { type: "p", text: "The website may contain links to independently operated third-party websites." },
        { type: "p", text: "Nothing in these Terms excludes liability or other obligations that cannot lawfully be excluded." },
      ],
    },
    {
      id: "applicable-law",
      number: "07",
      nav: "Applicable Law & Contact",
      title: "Applicable Law & Contact.",
      blocks: [
        { type: "p", text: "These website terms are governed by applicable Swiss law, subject to mandatory legal provisions." },
        { type: "p", text: "Any dispute arrangements or jurisdiction provisions should be determined in accordance with applicable law and reviewed before publication." },
        contact("Contact"),
      ],
    },
  ],
};
