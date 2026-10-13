/**
 * Single source for every public page's SEO copy. It feeds the Metadata API (titles, descriptions, canonicals,
 * Open Graph, Twitter), the XML sitemap and the JSON-LD structured data, so the three can never disagree.
 */
export const SITE_SLOGAN = "Investing Beyond Boundaries.";
export const SITE_TAGLINE = "Strategic Investments. Global Perspectives. Long-Term Vision.";

export type PageKind = "WebPage" | "AboutPage" | "ContactPage";

export interface PageSeo {
  /** Canonical path (query-string variants such as ?sector= are all canonicalised to this). */
  path: string;
  /** Short label for the breadcrumb trail. */
  name: string;
  title: string;
  description: string;
  kind?: PageKind;
}

export const PAGES = {
  home: {
    path: "/",
    name: "Home",
    title: "Nexea Holding AG | Swiss Investment Holding & Consulting",
    description:
      "Discover Nexea Holding AG, a Swiss investment holding company focused on global investment opportunities, strategic consulting, asset management, ventures, and real estate.",
  },
  about: {
    path: "/about",
    name: "About",
    title: "About Nexea Holding AG | Swiss Investment Company",
    description:
      "Learn about Nexea Holding AG, our corporate identity, investment philosophy, leadership, governance, and long-term strategic perspective.",
    kind: "AboutPage",
  },
  investments: {
    path: "/investments",
    name: "Investments",
    title: "Investment Sectors & Opportunities | Nexea Holding AG",
    description:
      "Explore Nexea Holding AG's investment universe, including real estate, gold, artificial intelligence, technology, energy, healthcare, and global industries.",
  },
  services: {
    path: "/services",
    name: "Services",
    title: "Investment & Business Consulting Services | Nexea",
    description:
      "Explore Nexea Holding AG's investment consulting, asset management, venture management, real estate, and strategic business consulting services.",
  },
  team: {
    path: "/team",
    name: "Team",
    title: "Leadership & Executive Team | Nexea Holding AG",
    description:
      "Meet the leadership and executive management team of Nexea Holding AG and learn about their roles in governance, strategy, and corporate management.",
  },
  partnerships: {
    path: "/partnerships",
    name: "Partnerships",
    title: "Strategic Partnerships | Nexea Holding AG",
    description:
      "Discover Nexea Holding AG's approach to strategic partnerships, international business relationships, collaboration, and long-term value creation.",
  },
  contact: {
    path: "/contact",
    name: "Contact",
    title: "Contact Nexea Holding AG | Switzerland",
    description:
      "Contact Nexea Holding AG in Hergiswil, Switzerland, to discuss investment interests, business consulting, strategic partnerships, and corporate inquiries.",
    kind: "ContactPage",
  },
  impressum: {
    path: "/impressum",
    name: "Impressum",
    title: "Impressum & Corporate Information | Nexea Holding AG",
    description:
      "View Nexea Holding AG's official corporate identification, registered office, commercial register details, and company contact information.",
  },
  privacy: {
    path: "/privacy-policy",
    name: "Privacy Policy",
    title: "Privacy Policy | Nexea Holding AG",
    description:
      "Learn how Nexea Holding AG handles personal information submitted through its corporate, investment-related, and business enquiry channels.",
  },
  terms: {
    path: "/terms-and-conditions",
    name: "Terms & Conditions",
    title: "Terms & Conditions | Nexea Holding AG",
    description:
      "Read the website terms governing access to Nexea Holding AG's corporate, investment, and proposed consulting information.",
  },
  navigator: {
    path: "/service-navigator",
    name: "Service Navigator",
    title: "Which Nexea Service Fits You? | Nexea Holding AG",
    description:
      "Answer five short questions and discover which of Nexea Holding AG's areas of expertise best fits your objectives.",
  },
  challenge: {
    path: "/investor-challenge",
    name: "Investor Challenge",
    title: "Think Like an Investor | Investor Challenge | Nexea Holding AG",
    description:
      "Five questions. One challenge. Test your knowledge of diversification, due diligence, liquidity and more with the Nexea Investor Challenge.",
  },
} as const satisfies Record<string, PageSeo>;

export const PAGE_LIST: readonly PageSeo[] = Object.values(PAGES);
