export interface UniverseCategory {
  id: string;
  title: string;
  description: string;
  image: { src: string; alt: string; position: string };
}

/**
 * Investment categories of interest. These describe where Nexea looks for
 * opportunities; they are NOT portfolio holdings, funded projects or transactions.
 */
export const UNIVERSE: readonly UniverseCategory[] = [
  {
    id: "real-estate",
    title: "Real Estate & Property",
    description: "Residential, commercial and development opportunities.",
    image: {
      src: "/images/universe-real-estate.jpg",
      alt: "Upward view of a glass residential and office tower",
      position: "40% 40%",
    },
  },
  {
    id: "ai-technology",
    title: "Artificial Intelligence & Technology",
    description: "AI, software, cloud infrastructure and digital innovation.",
    image: {
      src: "/images/pillar-technology.jpg",
      alt: "A long aisle of server racks inside a data centre",
      position: "50% 50%",
    },
  },
  {
    id: "healthcare",
    title: "Healthcare & Life Sciences",
    description: "Healthcare services, pharmaceuticals and biotechnology.",
    image: {
      src: "/images/pillar-health.jpg",
      alt: "A researcher in protective clothing working at a laboratory microscope",
      position: "65% 40%",
    },
  },
  {
    id: "energy",
    title: "Energy & Infrastructure",
    description: "Solar power, renewable energy and essential infrastructure.",
    image: {
      src: "/images/universe-energy.jpg",
      alt: "Rows of solar panels over a green field",
      position: "50% 50%",
    },
  },
  {
    id: "industry",
    title: "Industry & Manufacturing",
    description: "Industrial production, manufacturing and automation.",
    image: {
      src: "/images/pillar-industry.jpg",
      alt: "Heavy industrial machinery cutting steel plate in a factory, throwing sparks",
      position: "60% 50%",
    },
  },
  {
    id: "logistics",
    title: "Logistics & Mobility",
    description: "Logistics, transportation, automotive and mobility.",
    image: {
      src: "/images/universe-logistics.jpg",
      alt: "Aerial view of a container ship alongside a port terminal with cranes",
      position: "40% 50%",
    },
  },
  {
    id: "agriculture",
    title: "Agriculture & Sustainability",
    description: "Agribusiness, food systems and environmental solutions.",
    image: {
      src: "/images/universe-agriculture.jpg",
      alt: "Aerial view of green agricultural fields below misty mountains",
      position: "50% 55%",
    },
  },
];
