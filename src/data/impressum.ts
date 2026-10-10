/**
 * Impressum content. Legal and corporate facts only: registered positions and
 * signing authorities below are taken from the supplied commercial-register
 * information and are intentionally separate from the website's Team roster.
 * All wording must be reviewed by counsel before publication.
 */

export interface LegalSection {
  id: string;
  number: string;
  /** Sidebar label. */
  nav: string;
  /** Section eyebrow. */
  eyebrow: string;
}

export const LEGAL_SECTIONS: readonly LegalSection[] = [
  { id: "identification", number: "01", nav: "Company Identification", eyebrow: "01 / Company Identification" },
  { id: "capital", number: "02", nav: "Capital & Legal Status", eyebrow: "02 / Capital & Legal Status" },
  { id: "signatories", number: "03", nav: "Management & Signatories", eyebrow: "03 / Authorized Representation" },
  { id: "contact-info", number: "04", nav: "Contact Information", eyebrow: "04 / Contact Information" },
  { id: "disclosures", number: "05", nav: "Legal Disclosures", eyebrow: "05 / Legal Disclosures" },
  { id: "privacy", number: "06", nav: "Privacy & Related Pages", eyebrow: "06 / Privacy & Related Information" },
];

export interface Signatory {
  name: string;
  position: string;
  authority: string;
}

/** Registered representatives only. Do not add anyone without current registry documentation. */
export const SIGNATORIES: readonly Signatory[] = [
  { name: "Hans Rudolf Paul Schöpfer", position: "President of the Board of Directors", authority: "Individual signing authority" },
  { name: "Dr. Marcel Beat Rüegg", position: "Member of the Board of Directors", authority: "Joint signing authority (two signatures)" },
  { name: "Alain Girardet", position: "Managing Director", authority: "Individual signing authority" },
];

export const COMPANY_DESCRIPTION = {
  heading: "Nexea Holding AG \u2014 Swiss Investment Holding Company",
  paragraphs: [
    "Nexea Holding AG is a legally registered Swiss investment holding company headquartered in Hergiswil, Nidwalden, Switzerland.",
    "Established in 2004, the company operates under the Swiss corporate legal framework, with a registered purpose encompassing the acquisition, management, and disposal of participations in domestic and international companies.",
  ],
} as const;

export const LEGAL_STATUS_STATEMENT =
  "Nexea Holding AG is an active, legally registered Swiss corporation operating within its registered corporate purpose and subject to applicable Swiss law.";

/**
 * Registered activities vs. proposed services. The consulting offering is NOT presented
 * as an existing, authorized or regulated service; Swiss company registration alone does
 * not establish authorization for every type of financial advisory service.
 */
export const ACTIVITIES = {
  title: "Investment Activities & Strategic Consulting",
  registered: "Nexea Holding AG's registered activities focus on the acquisition, holding, management, and disposal of corporate participations for its own account.",
  proposed: [
    "The company is also exploring an expanded range of investment-related strategic consulting capabilities, including corporate strategy, investment evaluation, business development, and potential commercial partnerships.",
    "These proposed external services are subject to corporate approval and any applicable legal or regulatory requirements.",
  ],
} as const;

export const REGISTERED_PURPOSE =
  "Nexea Holding AG's registered purpose encompasses the direct or indirect acquisition, management, and disposal of participations in domestic and international listed and privately held companies. The company is registered as a holding and participation company managing its own assets.";

/**
 * Legal disclosures. Wording supplied by Nexea Holding AG and to be reviewed by qualified
 * Swiss legal counsel before publication.
 *
 * tier "primary":   always visible (identity, activities, regulatory status, disclaimers, capital).
 * tier "highlight": always visible, set in a restrained highlighted panel (regulatory status).
 * tier "secondary": lower-risk housekeeping notices that may be collapsed.
 *
 * Editorial note (NOT published): any figure for investment capacity, committed capital,
 * financing arrangements or assets under management must be separately verified and
 * classified before it appears anywhere on the site. The unconfirmed USD 30 million figure
 * is deliberately absent.
 */
export interface Disclosure {
  id: string;
  title: string;
  tier: "primary" | "highlight" | "secondary";
  paragraphs: readonly string[];
}

export const DISCLOSURES: readonly Disclosure[] = [
  {
    id: "identity",
    title: "Company Identity & Legal Status",
    tier: "primary",
    paragraphs: [
      "Nexea Holding AG is an active, legally registered Swiss investment holding company, established in 2004 and headquartered in Hergiswil, Nidwalden, Switzerland.",
      "The company is incorporated as an Aktiengesellschaft (AG) and operates within the Swiss corporate legal framework.",
      "Its registered corporate purpose encompasses the acquisition, management, and disposal of participations in listed and privately held companies in Switzerland and internationally.",
    ],
  },
  {
    id: "holding-activities",
    title: "Investment Holding Activities",
    tier: "primary",
    paragraphs: [
      "Nexea Holding AG's registered investment activities concern the acquisition, holding, management, and disposal of corporate participations for its own account.",
      "Its investment mandate encompasses domestic and international companies across different industries and business sectors.",
      "Investment-sector information published on this website may include proposed areas of strategic interest and does not necessarily represent existing portfolio holdings or completed investments.",
    ],
  },
  {
    id: "consulting",
    title: "Investment & Strategic Consulting",
    tier: "primary",
    paragraphs: [
      "Nexea Holding AG is exploring the development of investment-related strategic consulting and corporate advisory capabilities.",
      "Potential areas include investment evaluation, corporate strategy, transaction analysis, business development, commercial partnerships, and technology-related strategic assessment.",
      "These represent proposed service areas and should not be interpreted as confirmation that external advisory services are currently operational, licensed, or available.",
      "Any expansion of activities remains subject to corporate authorization and applicable legal or regulatory requirements.",
    ],
  },
  {
    id: "regulatory",
    title: "Regulatory Status",
    tier: "highlight",
    paragraphs: [
      "Nexea Holding AG is registered in the Swiss Commercial Register as an Aktiengesellschaft (AG).",
      "Commercial registration confirms the company's legal corporate existence but does not, by itself, constitute authorization to provide regulated financial services.",
      "No claim of FINMA authorization or supervision is made through this website unless such authorization is independently verified and explicitly disclosed.",
      "Certain financial, investment advisory, asset-management, or intermediary services may be subject to additional regulatory requirements depending on their nature and jurisdiction.",
    ],
  },
  {
    id: "investment-disclaimer",
    title: "Investment Information Disclaimer",
    tier: "primary",
    paragraphs: [
      "Content on this website is provided for general corporate and informational purposes.",
      "Descriptions of investment interests, opportunities, financial sectors, and proposed services do not, by themselves, constitute an offer to sell securities, a solicitation to acquire financial instruments, a commitment to provide financing, or personalized investment advice.",
      "No representation is made that investment funding is available for any specific transaction.",
      "Any potential investment, commercial arrangement, or advisory engagement would require separate evaluation, appropriate approvals, and definitive contractual documentation.",
    ],
  },
  {
    id: "capital-disclosures",
    title: "Capital & Financial Disclosures",
    tier: "primary",
    paragraphs: [
      "The company's documented registered share capital is CHF 2,000,000.",
      "Registered share capital does not necessarily represent available cash, deployable investment funding, assets under management, or financial guarantees.",
    ],
  },
  {
    id: "accuracy",
    title: "Accuracy & Updates",
    tier: "primary",
    paragraphs: [
      "Nexea Holding AG aims to maintain accurate and relevant information on its website.",
      "However, corporate information, proposed investment interests, services, and other website content may change over time.",
      "Visitors should not rely exclusively on website information when making legal, commercial, or financial decisions.",
      "Nothing in this notice excludes responsibility that cannot lawfully be excluded.",
    ],
  },
  {
    id: "external-links",
    title: "External Links",
    tier: "secondary",
    paragraphs: [
      "This website may contain links to independently operated third-party websites.",
      "Nexea Holding AG does not control those websites or their content, availability, security, or privacy practices.",
      "External links are provided for information and convenience and do not necessarily imply endorsement or a business relationship.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Copyright & Intellectual Property",
    tier: "secondary",
    paragraphs: [
      "Unless otherwise indicated, the content, branding, design, written materials, and original graphics published on this website are protected by applicable intellectual property laws.",
      "Reproduction or commercial use may require authorization from the respective rights holders.",
      "Photographs, fonts, software, and other third-party materials remain subject to their respective licenses.",
    ],
  },
];

/** Notice 10: shown at the top of the Privacy section. */
export const PRIVACY_NOTICE = {
  title: "Privacy & Personal Data",
  paragraphs: [
    "Personal information submitted through the website's contact forms or other communication channels is processed for relevant communication and enquiry-handling purposes, as described in the Privacy Policy.",
    "Further information regarding data processing, retention, relevant rights, and cookies is available through the website's applicable privacy documentation.",
  ],
} as const;

export interface LegalResource {
  label: string;
  /** Leave undefined until the page exists: it then renders as a clearly handled, non-link state. */
  href?: string;
}

export const LEGAL_RESOURCES: readonly LegalResource[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Contact Us", href: "/contact" },
];
