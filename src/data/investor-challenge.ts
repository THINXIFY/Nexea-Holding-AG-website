export interface ChallengeQuestion {
  id: string;
  question: string;
  /** Exactly three options, labelled A, B, C in order. */
  options: readonly [string, string, string];
  /** Index (0-2) of the correct option. */
  correct: 0 | 1 | 2;
  explanation: string;
  /** One short, optional educational takeaway shown beneath the explanation. */
  takeaway: string;
}

export const QUESTIONS: readonly ChallengeQuestion[] = [
  {
    id: "diversification",
    question: "What is the primary purpose of investment diversification?",
    options: ["Guarantee higher returns", "Reduce concentration risk", "Eliminate all financial risk"],
    correct: 1,
    explanation: "Diversification spreads investments across different assets or sectors, helping reduce concentration risk without eliminating investment risk.",
    takeaway: "Spread exposure across assets, sectors and regions.",
  },
  {
    id: "balance-sheet",
    question: "Which financial statement shows a company's assets, liabilities, and equity?",
    options: ["Balance Sheet", "Marketing Report", "Sales Proposal"],
    correct: 0,
    explanation: "A balance sheet provides a financial snapshot of a company's assets, liabilities, and shareholders' equity at a specific point in time.",
    takeaway: "Read the balance sheet alongside the income and cash-flow statements.",
  },
  {
    id: "due-diligence",
    question: "What does due diligence involve before making an investment decision?",
    options: ["Predicting guaranteed profits", "Reviewing financial, legal, and business information", "Selecting investments based only on popularity"],
    correct: 1,
    explanation: "Due diligence involves systematically reviewing relevant information to evaluate an investment opportunity, identify potential risks, and support informed decision-making.",
    takeaway: "Evidence first, conviction second.",
  },
  {
    id: "liquidity",
    question: "What does liquidity mean in investing?",
    options: ["How easily an asset can be converted into cash", "The total number of employees in a company", "The amount of annual marketing expenditure"],
    correct: 0,
    explanation: "Liquidity generally describes how easily an asset can be bought or sold without significantly affecting its market price.",
    takeaway: "Match an asset's liquidity to when you may need the capital.",
  },
  {
    id: "time-horizon",
    question: "What is an investment time horizon?",
    options: ["The time needed to establish a company", "The expected period an investment will be held", "The number of investment markets worldwide"],
    correct: 1,
    explanation: "An investment time horizon is the expected length of time an investor intends to hold an investment before needing the invested capital.",
    takeaway: "A longer horizon can change which risks make sense to accept.",
  },
];

export const TOTAL = QUESTIONS.length;

export interface Level {
  id: "explorer" | "analyst" | "strategist";
  name: string;
  message: string;
  /** 1-3, used by the emblem. */
  tier: 1 | 2 | 3;
}

export const LEVELS: readonly Level[] = [
  { id: "explorer", name: "Investment Explorer", tier: 1, message: "Every great investor begins with curiosity. Keep exploring the fundamentals of financial decision-making." },
  { id: "analyst", name: "Investment Analyst", tier: 2, message: "A strong foundation. You understand several important principles behind informed investment decisions." },
  { id: "strategist", name: "Investment Strategist", tier: 3, message: "Excellent work. You've demonstrated a strong understanding of essential investment concepts." },
];

/** 0-2 Explorer, 3-4 Analyst, 5 Strategist. */
export function levelFor(score: number): Level {
  if (score >= 5) return LEVELS[2];
  if (score >= 3) return LEVELS[1];
  return LEVELS[0];
}

/** Picked option index per question (undefined = unanswered). Each question counts at most once. */
export type Picks = readonly (number | undefined)[];

export function scoreOf(picks: Picks): number {
  return QUESTIONS.reduce((n, q, i) => n + (picks[i] === q.correct ? 1 : 0), 0);
}

export const SHARE_PATH = "/investor-challenge";

/** Result-only share text: no qualification claims. */
export function shareText(score: number): string {
  const level = levelFor(score);
  return `I scored ${score}/${TOTAL} on Nexea Holding AG's Investor Challenge and reached "${level.name}" (quiz result only). Try it yourself:`;
}
