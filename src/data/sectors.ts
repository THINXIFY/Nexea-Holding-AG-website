export interface Sector {
  id: string;
  title: string;
  summary: string;
  image: { src: string; alt: string; position: string };
  /** Destination page. Undefined while the sector page does not exist; the tile is then not a link. */
  href?: string;
  /** Grid placement for the desktop mosaic (lg+) and tablet (md). */
  layout: string;
  /** "feature" tiles get larger type. */
  size: "feature" | "wide" | "compact";
}

/**
 * Featured sectors of interest. These describe where Nexea looks for
 * opportunities, not existing holdings.
 */
export const SECTORS: readonly Sector[] = [
  {
    id: "real-estate",
    title: "Real Estate & Property",
    summary:
      "Residential and commercial property, income-generating assets, and carefully evaluated development opportunities.",
    image: {
      src: "/images/sector-real-estate.jpg",
      alt: "Upward view of a glass office tower against a partly cloudy sky",
      position: "50% 40%",
    },
    layout: "md:col-span-2 lg:col-span-7 lg:row-span-2",
    size: "feature",
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    summary:
      "AI-driven businesses, intelligent automation, enterprise applications, and the infrastructure enabling advanced computing.",
    image: {
      src: "/images/sector-ai.jpg",
      alt: "Rows of illuminated server racks in a data centre",
      position: "50% 50%",
    },
    layout: "md:col-span-2 lg:col-span-5 lg:row-span-2",
    size: "wide",
  },
  {
    id: "healthcare",
    title: "Healthcare & Life Sciences",
    summary:
      "Healthcare services, pharmaceutical innovation, biotechnology, medical technology, and digital health.",
    image: {
      src: "/images/ab-health.jpg",
      alt: "Two researchers in protective clothing working in a bright, clean laboratory",
      position: "50% 45%",
    },
    layout: "lg:col-span-4",
    size: "compact",
  },
  {
    id: "energy",
    title: "Energy & Renewable Power",
    summary:
      "Solar generation, renewable infrastructure, energy storage, and solutions supporting evolving energy requirements.",
    image: {
      src: "/images/sector-energy.jpg",
      alt: "Aerial view of a large solar farm with wind turbines at sunrise",
      position: "50% 55%",
    },
    layout: "lg:col-span-4",
    size: "compact",
  },
  {
    id: "technology",
    title: "Technology & IT Services",
    summary:
      "Enterprise software, cloud infrastructure, cybersecurity, scalable digital platforms, and technology-enabled services.",
    image: {
      src: "/images/sector-it.jpg",
      alt: "Network equipment racks lit in blue inside a server room",
      position: "50% 50%",
    },
    layout: "md:col-span-2 lg:col-span-4",
    size: "compact",
  },
];
