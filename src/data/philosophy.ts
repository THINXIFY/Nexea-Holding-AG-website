export interface Principle {
  title: string;
  description: string;
}

/** Proposed positioning, subject to company approval; not an independently verified corporate policy. */
export const PRINCIPLES: readonly Principle[] = [
  {
    title: "Fundamental Understanding",
    description:
      "Understanding business models, underlying assets, market dynamics, and economic fundamentals.",
  },
  {
    title: "Disciplined Evaluation",
    description:
      "Evaluating opportunities through structured analysis, commercial understanding, and risk awareness.",
  },
  {
    title: "Independent Perspective",
    description:
      "Considering businesses, industries, and emerging opportunities with clarity and objectivity.",
  },
  {
    title: "Long-Term Orientation",
    description:
      "Assessing business durability, adaptability, and potential for lasting relevance.",
  },
];
