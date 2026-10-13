/** Content for the /investments page. All of it describes proposed interests and a proposed framework. */

export interface Pillar {
  number: string;
  title: string;
  description: string;
  image: { src: string; alt: string; position: string };
}

export const PILLARS: readonly Pillar[] = [
  {
    number: "01",
    title: "Real Assets & Infrastructure",
    description:
      "Exploring property, renewable energy, logistics, and essential infrastructure assets.",
    image: { src: "/images/ab-real-assets.jpg", alt: "Aerial view of a dense financial district of skyscrapers", position: "50% 40%" },
  },
  {
    number: "02",
    title: "Technology & Innovation",
    description:
      "Considering artificial intelligence, enterprise technology, financial innovation, and digital infrastructure.",
    image: { src: "/images/ab-technology.jpg", alt: "Close-up of a blue-lit server rack inside a data centre", position: "30% 50%" },
  },
  {
    number: "03",
    title: "Industry & Commerce",
    description:
      "Evaluating industrial manufacturing, automotive mobility, consumer businesses, and hospitality.",
    image: { src: "/images/ab-industry.jpg", alt: "A yellow industrial robot arm on an automated production line", position: "50% 40%" },
  },
  {
    number: "04",
    title: "Health & Sustainability",
    description:
      "Examining healthcare, life sciences, agriculture, and environmental solutions.",
    image: { src: "/images/ab-health.jpg", alt: "Researchers working in a bright, clean laboratory", position: "50% 45%" },
  },
];

export const PHILOSOPHY_PRINCIPLES = [
  { title: "Fundamental Value", description: "Understanding business models, market dynamics, and underlying assets." },
  { title: "Disciplined Evaluation", description: "Assessing opportunities through structured analysis and informed judgment." },
  { title: "Risk Awareness", description: "Considering uncertainty, financial exposure, and long-term resilience." },
  { title: "Long-Term Perspective", description: "Looking beyond immediate trends toward enduring business relevance." },
] as const;

/** Proposed evaluation considerations; not an approval process or funding eligibility test. */
export const CRITERIA = [
  { title: "Business Fundamentals", description: "A clear business model, market positioning, and commercial rationale." },
  { title: "Market Opportunity", description: "Industry relevance, competitive dynamics, and future market potential." },
  { title: "Financial Considerations", description: "Financial position, investment requirements, and economic sustainability." },
  { title: "Strategic Alignment", description: "Compatibility with Nexea’s investment mandate and areas of interest." },
  { title: "Risk & Governance", description: "Relevant operational, legal, financial, and governance considerations." },
  { title: "Long-Term Potential", description: "The ability to remain relevant, adaptable, and commercially sustainable." },
] as const;

export const APPROACH_STEPS = [
  { title: "Discover", description: "Identify relevant businesses, assets, and investment opportunities." },
  { title: "Assess", description: "Review commercial fundamentals, market positioning, and financial considerations." },
  { title: "Investigate", description: "Examine risks, legal factors, and operational information." },
  { title: "Structure", description: "Evaluate potential participation structures and commercial terms." },
  { title: "Review", description: "Consider developments and the longer-term outlook." },
] as const;
