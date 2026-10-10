export type SectorGroupId = "real-assets" | "technology" | "industry" | "health";

export interface SectorGroup {
  id: SectorGroupId;
  /** Short label used on the filter control. */
  filterLabel: string;
  title: string;
}

export const SECTOR_GROUPS: readonly SectorGroup[] = [
  { id: "real-assets", filterLabel: "Real Assets", title: "Real Assets & Infrastructure" },
  { id: "technology", filterLabel: "Technology", title: "Technology & Innovation" },
  { id: "industry", filterLabel: "Industry", title: "Industry & Commerce" },
  { id: "health", filterLabel: "Health & Sustainability", title: "Health & Sustainability" },
];

export interface InvestmentSector {
  /** Becomes the route segment under /investments/[slug] once the inner pages exist. */
  slug: string;
  title: string;
  description: string;
  group: SectorGroupId;
  image: { src: string; alt: string; position: string };
}

/**
 * The 15 sectors of interest. These are proposed investment interests, NOT
 * current portfolio companies or holdings.
 *
 * No sector has a published inner page yet, so entries carry no `href`. When
 * `/investments/[slug]` is built, add the slug to PUBLISHED_SECTOR_SLUGS and
 * the directory will start linking to it automatically.
 */
export const INVESTMENT_SECTORS: readonly InvestmentSector[] = [
  {
    slug: "real-estate-property",
    title: "Real Estate & Property",
    description: "Residential, commercial, and development-related investment opportunities.",
    group: "real-assets",
    image: { src: "/images/universe-real-estate.jpg", alt: "Upward view of a glass residential and office tower", position: "40% 40%" },
  },
  {
    slug: "gold-precious-metals",
    title: "Gold & Precious Metals",
    description: "Precious metals, commodity-linked assets, and related businesses.",
    group: "real-assets",
    image: { src: "/images/universe-gold.jpg", alt: "Gold bars and coins", position: "50% 50%" },
  },
  {
    slug: "energy-renewable-power",
    title: "Energy & Renewable Power",
    description: "Solar energy, renewable generation, energy storage, and power infrastructure.",
    group: "real-assets",
    image: { src: "/images/universe-energy.jpg", alt: "Rows of solar panels over a green field", position: "50% 50%" },
  },
  {
    slug: "logistics-supply-chain",
    title: "Logistics & Supply Chain",
    description: "Transportation, warehousing, distribution, and supply-chain solutions.",
    group: "real-assets",
    image: { src: "/images/universe-logistics.jpg", alt: "Aerial view of a container ship beside a port terminal", position: "40% 50%" },
  },
  {
    slug: "infrastructure-connectivity",
    title: "Infrastructure & Connectivity",
    description: "Digital infrastructure, telecommunications, utilities, and connectivity.",
    group: "real-assets",
    image: { src: "/images/sec-infrastructure.jpg", alt: "A telecommunications mast with antennas against a blue sky", position: "50% 40%" },
  },
  {
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    description: "Intelligent software, automation, AI infrastructure, and advanced computing.",
    group: "technology",
    image: { src: "/images/sector-ai.jpg", alt: "Rows of illuminated server racks in a data centre", position: "50% 50%" },
  },
  {
    slug: "technology-it-services",
    title: "Technology & IT Services",
    description: "Enterprise software, SaaS, cloud solutions, and cybersecurity.",
    group: "technology",
    image: { src: "/images/sector-it.jpg", alt: "Network equipment racks lit in blue inside a server room", position: "50% 50%" },
  },
  {
    slug: "fintech-financial-innovation",
    title: "Fintech & Financial Innovation",
    description: "Payment technologies, financial software, and digital financial infrastructure.",
    group: "technology",
    image: { src: "/images/sec-fintech.jpg", alt: "A hand using a card at a payment terminal beside a laptop", position: "50% 55%" },
  },
  {
    slug: "industrial-manufacturing",
    title: "Industrial & Manufacturing",
    description: "Industrial production, machinery, advanced materials, and automation.",
    group: "industry",
    image: { src: "/images/pillar-industry.jpg", alt: "Industrial machinery cutting steel plate in a factory", position: "60% 50%" },
  },
  {
    slug: "automotive-mobility",
    title: "Automotive & Mobility",
    description: "Automotive businesses, electric mobility, components, and transportation technologies.",
    group: "industry",
    image: { src: "/images/sec-automotive.jpg", alt: "A white electric car on display in a bright showroom", position: "50% 55%" },
  },
  {
    slug: "consumer-retail",
    title: "Consumer & Retail",
    description: "Consumer brands, e-commerce, retail networks, and distribution.",
    group: "industry",
    image: { src: "/images/sec-retail.jpg", alt: "A bright retail store interior with clothing racks", position: "50% 50%" },
  },
  {
    slug: "hospitality-tourism",
    title: "Hospitality & Tourism",
    description: "Hospitality assets, hotels, resorts, and tourism-related enterprises.",
    group: "industry",
    image: { src: "/images/sec-hospitality.jpg", alt: "A resort building with a swimming pool and timber pergola", position: "50% 50%" },
  },
  {
    slug: "healthcare-life-sciences",
    title: "Healthcare & Life Sciences",
    description: "Healthcare services, pharmaceuticals, biotechnology, and medical technology.",
    group: "health",
    image: { src: "/images/pillar-health.jpg", alt: "A researcher in protective clothing at a laboratory microscope", position: "65% 40%" },
  },
  {
    slug: "agriculture-agribusiness",
    title: "Agriculture & Agribusiness",
    description: "Agricultural production, agri-tech, food systems, and farming infrastructure.",
    group: "health",
    image: { src: "/images/universe-agriculture.jpg", alt: "Aerial view of green agricultural fields below mountains", position: "50% 55%" },
  },
  {
    slug: "environmental-solutions",
    title: "Environmental Solutions",
    description: "Water management, recycling, resource efficiency, and environmental technologies.",
    group: "health",
    image: { src: "/images/sec-environment.jpg", alt: "Aerial view of circular water treatment basins", position: "50% 50%" },
  },
];

/** Slugs of sector pages that actually exist under /investments/[slug]. Empty until they are built. */
export const PUBLISHED_SECTOR_SLUGS: readonly string[] = [];

export const sectorHref = (slug: string): string | undefined =>
  PUBLISHED_SECTOR_SLUGS.includes(slug) ? `/investments/${slug}` : undefined;

export const countByGroup = (id: SectorGroupId | "all"): number =>
  id === "all" ? INVESTMENT_SECTORS.length : INVESTMENT_SECTORS.filter((s) => s.group === id).length;
