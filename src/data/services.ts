export interface ServiceArea {
  /** Matches the planned future route segment under /services/[slug]. */
  slug: string;
  number: string;
  title: string;
  summary: string;
  description: string;
  capabilities: readonly [string, string, string, string];
  /** Extra regulatory clarification shown in the detail panel. */
  note?: string;
  image: { src: string; alt: string; position: string };
}

/**
 * Nine proposed areas of expertise. None of these is presented as an existing,
 * authorised or regulated service. Planned routes (not yet built):
 * /services/investment-capital-strategy, /services/mergers-acquisitions,
 * /services/strategic-consulting, /services/global-partnerships,
 * /services/research-risk-valuation, /services/technology-advisory.
 */
export const SERVICE_AREAS: readonly ServiceArea[] = [
  {
    slug: "investment-capital-strategy",
    number: "01",
    title: "Investment & Capital Strategy",
    summary: "Opportunities, capital allocation, and ownership structures.",
    description:
      "Assessing investment opportunities, capital allocation considerations, ownership structures, and long-term corporate investment objectives.",
    capabilities: ["Investment Evaluation", "Capital Strategy", "Equity Participation", "Investment Structuring"],
    image: { src: "/images/ab-tower.jpg", alt: "Black-and-white view up the glass facade of a commercial office tower", position: "60% 40%" },
  },
  {
    slug: "mergers-acquisitions",
    number: "02",
    title: "Mergers, Acquisitions & Transactions",
    summary: "Acquisitions, ownership transitions, and business combinations.",
    description:
      "Examining corporate acquisitions, ownership transitions, transaction opportunities, and potential business combinations.",
    capabilities: ["M&A Assessment", "Acquisition Analysis", "Transaction Due Diligence", "Joint Ventures"],
    image: { src: "/images/svc-ma.jpg", alt: "Business colleagues discussing documents around a meeting-room table", position: "50% 45%" },
  },
  {
    slug: "strategic-consulting",
    number: "03",
    title: "Corporate & Strategic Consulting",
    summary: "Commercial strategy, positioning, and transformation.",
    description:
      "Exploring commercial strategies, competitive positioning, business transformation, and organizational development.",
    capabilities: ["Corporate Strategy", "Business Transformation", "Market Entry", "Growth Planning"],
    image: { src: "/images/svc-corporate.jpg", alt: "Overhead view of a team working at a boardroom table with laptops and papers", position: "50% 50%" },
  },
  {
    slug: "global-partnerships",
    number: "04",
    title: "Global Partnerships & Business Development",
    summary: "Strategic relationships and cross-border collaboration.",
    description:
      "Identifying strategic relationships, international commercial opportunities, and potential cross-border collaborations.",
    capabilities: ["Strategic Partnerships", "International Expansion", "Business Origination", "Collaboration Strategy"],
    image: { src: "/images/svc-globe.jpg", alt: "A vintage globe showing the Americas against a dark background", position: "55% 45%" },
  },
  {
    slug: "research-risk-valuation",
    number: "05",
    title: "Research, Risk & Valuation",
    summary: "Market intelligence, valuation, and structured risk analysis.",
    description:
      "Applying market intelligence, valuation considerations, commercial assessment, and structured risk analysis to strategic decisions.",
    capabilities: ["Market Research", "Business Valuation", "Risk Assessment", "Commercial Due Diligence"],
    image: { src: "/images/ab-analysis.jpg", alt: "A professional reviewing financial reports at a desk, pen in hand", position: "55% 50%" },
  },
  {
    slug: "technology-advisory",
    number: "06",
    title: "Technology & Innovation Advisory",
    summary: "AI, digital systems, and emerging technologies.",
    description:
      "Exploring how artificial intelligence, digital systems, and emerging technologies may support business innovation and competitiveness.",
    capabilities: ["AI Strategy", "Digital Transformation", "Technology Assessment", "Innovation Planning"],
    image: { src: "/images/svc-technology.jpg", alt: "Streaks of blue light on a dark background", position: "50% 50%" },
  },
  {
    slug: "proprietary-asset-management",
    number: "07",
    title: "Proprietary Asset & Portfolio Management",
    summary: "Oversight of Nexea’s own assets and participations.",
    description:
      "Management and assessment of Nexea’s own investment assets, corporate participations, and long-term portfolio interests.",
    capabilities: ["Portfolio Review", "Participation Oversight", "Asset Assessment", "Long-Term Holding Strategy"],
    note: "Focused on the management of Nexea’s own assets and participations.",
    image: { src: "/images/ab-real-assets.jpg", alt: "Aerial view of a dense financial district of skyscrapers", position: "50% 40%" },
  },
  {
    slug: "venture-strategy",
    number: "08",
    title: "Venture Strategy & Development",
    summary: "Emerging businesses, growth strategy, and participation.",
    description:
      "Evaluation of emerging businesses, venture opportunities, growth strategies, and potential investment participation.",
    capabilities: ["Venture Evaluation", "Business Model Assessment", "Growth Strategy", "Participation Analysis"],
    image: { src: "/images/svc-venture.jpg", alt: "A team of professionals discussing plans around a table with laptops", position: "50% 40%" },
  },
  {
    slug: "real-estate-strategy",
    number: "09",
    title: "Real Estate Investment Strategy",
    summary: "Commercial and residential property opportunities.",
    description:
      "Evaluation of commercial and residential property opportunities, investment structures, and real estate market fundamentals.",
    capabilities: ["Market Fundamentals", "Property Evaluation", "Investment Structures", "Development Assessment"],
    image: { src: "/images/inv-overview-tower.jpg", alt: "Looking up the curved glass facade of a modern commercial tower", position: "50% 40%" },
  },
];

/** Slugs of /services/[slug] pages that actually exist. Empty until they are built. */
export const PUBLISHED_SERVICE_SLUGS: readonly string[] = [];

export const serviceHref = (slug: string): string | undefined =>
  PUBLISHED_SERVICE_SLUGS.includes(slug) ? `/services/${slug}` : undefined;

export const THEMES = [
  { title: "Strategic Insight", description: "In-depth understanding of markets and industries." },
  { title: "Global Perspective", description: "Opportunities across domestic and international markets." },
  { title: "Practical Approach", description: "Turning analysis into meaningful direction." },
  { title: "Long-Term Focus", description: "Supporting sustainable business relevance." },
] as const;

export const CAPABILITY_STAGES = [
  { title: "Analyze", description: "Understand markets, business models, financial considerations, and potential risks." },
  { title: "Strategize", description: "Identify priorities, evaluate alternatives, and develop a clear strategic direction." },
  { title: "Structure", description: "Assess investment arrangements, partnerships, and appropriate commercial frameworks." },
  { title: "Advance", description: "Translate strategic findings into actionable recommendations and next steps." },
] as const;

export const INDUSTRY_GROUPS = [
  {
    title: "Real Assets & Infrastructure",
    description: "Property, energy systems, logistics, and essential infrastructure.",
    image: { src: "/images/universe-real-estate.jpg", alt: "Upward view of a glass commercial tower", position: "40% 40%" },
    className: "sm:col-span-2 lg:col-span-7",
  },
  {
    title: "Technology & Digital Economy",
    description: "Artificial intelligence, software, fintech, and digital innovation.",
    image: { src: "/images/pillar-technology.jpg", alt: "A long aisle of server racks inside a data centre", position: "50% 50%" },
    className: "lg:col-span-5",
  },
  {
    title: "Industry & Commerce",
    description: "Manufacturing, mobility, consumer businesses, and international trade.",
    image: { src: "/images/pillar-industry.jpg", alt: "Industrial machinery cutting steel plate in a factory", position: "60% 50%" },
    className: "lg:col-span-5",
  },
  {
    title: "Healthcare & Sustainability",
    description: "Life sciences, agribusiness, and environmental solutions.",
    image: { src: "/images/pillar-health.jpg", alt: "A researcher in protective clothing at a laboratory microscope", position: "65% 40%" },
    className: "sm:col-span-2 lg:col-span-7",
  },
] as const;

export const AUDIENCES = [
  {
    title: "Businesses & Corporate Groups",
    description: "Exploring corporate strategy, investment considerations, transformation, and business development opportunities.",
  },
  {
    title: "Entrepreneurs & Growing Companies",
    description: "Considering commercial development, strategic positioning, innovation, and potential investment relationships.",
  },
  {
    title: "Investors & Strategic Partners",
    description: "Exploring corporate participations, commercial partnerships, and opportunities for strategic collaboration.",
  },
] as const;

export const SERVICE_APPROACH = [
  { title: "Understand the Objective", description: "Establish business priorities, context, and strategic requirements." },
  { title: "Assess the Opportunity", description: "Review commercial information, market conditions, and relevant considerations." },
  { title: "Develop the Perspective", description: "Identify strategic options, potential risks, and practical recommendations." },
  { title: "Define the Next Step", description: "Outline possible actions, priorities, and areas for further evaluation." },
] as const;
