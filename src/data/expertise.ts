export interface ExpertiseArea {
  id: string;
  title: string;
  description: string;
}

/** Areas of a *proposed* strategic consulting offering; not an established or regulated service. */
export const EXPERTISE: readonly ExpertiseArea[] = [
  {
    id: "capital-strategy",
    title: "Investment & Capital Strategy",
    description:
      "Evaluating investment opportunities, capital allocation considerations, ownership structures, and long-term corporate investment strategies.",
  },
  {
    id: "transactions",
    title: "Mergers, Acquisitions & Transactions",
    description:
      "Assessing potential acquisitions, corporate transactions, business combinations, and strategic ownership opportunities.",
  },
  {
    id: "consulting",
    title: "Corporate & Strategic Consulting",
    description:
      "Exploring business strategies, organizational development, commercial opportunities, and pathways for sustainable growth.",
  },
  {
    id: "partnerships",
    title: "Global Partnerships & Business Development",
    description:
      "Identifying potential strategic relationships, international business opportunities, and joint venture possibilities.",
  },
  {
    id: "research",
    title: "Research, Risk & Valuation",
    description:
      "Applying market intelligence, commercial evaluation, risk considerations, and valuation analysis to business decisions.",
  },
  {
    id: "technology-advisory",
    title: "Technology & Innovation Advisory",
    description:
      "Exploring digital transformation, artificial intelligence, technology adoption, and the strategic potential of emerging solutions.",
  },
];
