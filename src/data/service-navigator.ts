import { SERVICE_AREAS, type ServiceArea } from "./services";

/**
 * Nexea Service Navigator: questions, options and a transparent, deterministic matching engine.
 *
 * No AI, no network, no randomness: every option adds fixed points to services (see SCORES), the highest total is the
 * primary recommendation and the next two (with a meaningful score) are complementary. Ties are broken by PRIORITY.
 * Only services that exist on the Services page are ever recommended, and every service is described using that
 * page's own wording. Nothing here implies funding, returns, third-party asset management or regulated services.
 */

export type StepId = "objective" | "profile" | "sector" | "support" | "next";

export interface NavOption {
  id: string;
  label: string;
  /** Short phrase used in the personalised sentence ("looking to ..."), lower-case. */
  phrase: string;
}

export interface NavQuestion {
  id: StepId;
  /** Short label for the progress indicator. */
  short: string;
  question: string;
  hint: string;
  options: readonly NavOption[];
}

export const QUESTIONS: readonly NavQuestion[] = [
  {
    id: "objective",
    short: "Objective",
    question: "What best describes your objective?",
    hint: "Choose the aim closest to what you have in mind.",
    options: [
      { id: "invest", label: "Explore investment opportunities", phrase: "explore investment opportunities" },
      { id: "assets", label: "Manage or optimize assets", phrase: "manage or optimize assets" },
      { id: "venture", label: "Develop a business venture", phrase: "develop a business venture" },
      { id: "realestate", label: "Explore real estate opportunities", phrase: "explore real estate opportunities" },
      { id: "advice", label: "Seek strategic business advice", phrase: "seek strategic business advice" },
    ],
  },
  {
    id: "profile",
    short: "Profile",
    question: "What best describes you?",
    hint: "This helps us frame the conversation.",
    options: [
      { id: "individual", label: "Individual investor", phrase: "an individual investor" },
      { id: "owner", label: "Business owner / entrepreneur", phrase: "a business owner or entrepreneur" },
      { id: "company", label: "Company or institution", phrase: "a company or institution" },
      { id: "assetowner", label: "Asset owner", phrase: "an asset owner" },
    ],
  },
  {
    id: "sector",
    short: "Sector",
    question: "Which sector interests you most?",
    hint: "Pick the area you would like to start with.",
    options: [
      { id: "tech", label: "Technology & AI", phrase: "technology and AI" },
      { id: "realestate", label: "Real Estate", phrase: "real estate" },
      { id: "energy", label: "Energy & Sustainability", phrase: "energy and sustainability" },
      { id: "diversified", label: "Diversified industries", phrase: "diversified industries" },
      { id: "exploring", label: "Still exploring", phrase: "a range of sectors" },
    ],
  },
  {
    id: "support",
    short: "Support",
    question: "What type of support are you seeking?",
    hint: "Select the kind of input that would help most.",
    options: [
      { id: "strategy", label: "Strategy and expert guidance", phrase: "strategy and expert guidance" },
      { id: "evaluation", label: "Opportunity or venture evaluation", phrase: "evaluation of an opportunity or venture" },
      { id: "oversight", label: "Portfolio or asset oversight", phrase: "portfolio or asset oversight" },
      { id: "partnership", label: "Partnership and business development", phrase: "partnership and business development" },
    ],
  },
  {
    id: "next",
    short: "Next step",
    question: "What is your preferred next step?",
    hint: "We will tailor the suggestions that follow.",
    options: [
      { id: "understand", label: "Understand available services", phrase: "understand Nexea's services" },
      { id: "discuss", label: "Discuss a specific opportunity", phrase: "discuss a specific opportunity" },
      { id: "consult", label: "Request a consultation", phrase: "request a consultation" },
      { id: "partner", label: "Explore a potential partnership", phrase: "explore a potential partnership" },
    ],
  },
];

export type Answers = Partial<Record<StepId, string>>;

export const isComplete = (a: Answers): a is Record<StepId, string> => QUESTIONS.every((q) => validOption(q.id, a[q.id]));

export function validOption(step: StepId, id: unknown): id is string {
  const q = QUESTIONS.find((x) => x.id === step);
  return typeof id === "string" && !!q && q.options.some((o) => o.id === id);
}

export const optionOf = (step: StepId, id: string | undefined): NavOption | undefined =>
  QUESTIONS.find((q) => q.id === step)?.options.find((o) => o.id === id);

/* ----------------------------------------------------------------------------------------------------------------
 * Scoring. Keys are short aliases of the real service slugs.
 * ------------------------------------------------------------------------------------------------------------- */
type Key = "investment" | "mna" | "consulting" | "partnerships" | "research" | "technology" | "assets" | "venture" | "realestate";

export const SLUG: Record<Key, string> = {
  investment: "investment-capital-strategy",
  mna: "mergers-acquisitions",
  consulting: "strategic-consulting",
  partnerships: "global-partnerships",
  research: "research-risk-valuation",
  technology: "technology-advisory",
  assets: "proprietary-asset-management",
  venture: "venture-strategy",
  realestate: "real-estate-strategy",
};

/** Tie-break order (earlier wins). */
const PRIORITY: readonly Key[] = ["investment", "consulting", "realestate", "venture", "research", "assets", "partnerships", "mna", "technology"];

type Table = Record<string, Partial<Record<Key, number>>>;

const SCORES: Record<StepId, Table> = {
  objective: {
    invest: { investment: 6, research: 3, mna: 2, partnerships: 1 },
    assets: { investment: 5, research: 4, assets: 4 },
    venture: { venture: 7, consulting: 2, partnerships: 2, technology: 1 },
    realestate: { realestate: 8, research: 2, investment: 2 },
    advice: { consulting: 7, investment: 2, mna: 1, research: 1 },
  },
  profile: {
    individual: { investment: 1, research: 1 },
    owner: { venture: 1, consulting: 1, mna: 1 },
    company: { consulting: 1, mna: 1, partnerships: 1 },
    assetowner: { assets: 1, research: 1, investment: 1 },
  },
  sector: {
    tech: { technology: 4, venture: 1 },
    realestate: { realestate: 4, research: 1 },
    energy: { investment: 2, research: 2, partnerships: 1 },
    diversified: { investment: 2, research: 1, partnerships: 1 },
    exploring: { consulting: 1, investment: 1 },
  },
  support: {
    strategy: { consulting: 3, investment: 2 },
    evaluation: { research: 4, mna: 1, venture: 1 },
    oversight: { assets: 4, research: 1 },
    partnership: { partnerships: 4, mna: 1 },
  },
  next: {
    understand: {},
    discuss: {},
    consult: {},
    partner: { partnerships: 2 },
  },
};

/** A service must score at least this much to be offered as a complementary suggestion. */
const COMPLEMENT_MIN = 3;

export interface ScoreRow {
  key: Key;
  slug: string;
  score: number;
}

export function scoreServices(a: Answers): ScoreRow[] {
  const total = Object.fromEntries(PRIORITY.map((k) => [k, 0])) as Record<Key, number>;
  for (const q of QUESTIONS) {
    const id = a[q.id];
    if (!validOption(q.id, id)) continue;
    for (const [k, v] of Object.entries(SCORES[q.id][id] ?? {})) total[k as Key] += v ?? 0;
  }
  return PRIORITY.map((k) => ({ key: k, slug: SLUG[k], score: total[k] })).sort(
    (x, y) => y.score - x.score || PRIORITY.indexOf(x.key) - PRIORITY.indexOf(y.key),
  );
}

/* ----------------------------------------------------------------------------------------------------------------
 * Wording. `fit` completes "For someone who wants to <phrase>, ..." so it must be a clause about Nexea's expertise.
 * ------------------------------------------------------------------------------------------------------------- */
const FIT: Record<Key, string> = {
  investment: "Nexea's investment and capital strategy work examines opportunities, capital allocation and ownership structures with a long-term view.",
  mna: "Nexea examines acquisitions, ownership transitions and potential business combinations with careful transaction analysis.",
  consulting: "Nexea's strategic consulting explores commercial strategy, positioning and transformation to give a clear direction.",
  partnerships: "Nexea identifies strategic relationships and cross-border opportunities that open new markets and collaborations.",
  research: "Nexea applies market intelligence, valuation and structured risk analysis so decisions rest on solid fundamentals.",
  technology: "Nexea looks at how AI, digital systems and emerging technologies can support innovation and competitiveness.",
  assets: "Nexea approaches portfolio and asset oversight with a disciplined, long-term holding perspective, applied to its own assets and participations.",
  venture: "Nexea evaluates emerging businesses, business models and growth strategies, including potential participation.",
  realestate: "Nexea evaluates commercial and residential property opportunities, investment structures and market fundamentals.",
};

export interface Recommendation {
  service: ServiceArea;
  key: Key;
  score: number;
  /** One personalised sentence. */
  why: string;
}

export interface NextStep {
  label: string;
  description: string;
  href: string;
}

export interface Result {
  primary: Recommendation;
  complementary: Recommendation[];
  steps: NextStep[];
  /** Chips summarising the visitor's choices. */
  summary: { label: string; value: string }[];
  consultationHref: string;
}

const serviceBySlug = (slug: string) => SERVICE_AREAS.find((s) => s.slug === slug) as ServiceArea;

export const serviceHref = (slug: string) => `/services?service=${slug}#services-list`;

function whyText(key: Key, a: Record<StepId, string>, primary: boolean): string {
  const obj = optionOf("objective", a.objective)!.phrase;
  const sector = a.sector === "exploring" ? "" : ` with an interest in ${optionOf("sector", a.sector)!.phrase}`;
  const support = optionOf("support", a.support)!.phrase;
  const lead = primary
    ? `For ${optionOf("profile", a.profile)!.phrase} looking to ${obj}${sector}, and seeking ${support}: `
    : `Alongside your main aim to ${obj}: `;
  return `${lead}${FIT[key]}`;
}

/** Enquiry type to preselect in the contact form for a given answer set. */
function enquiryType(a: Record<StepId, string>): "investment" | "partnership" | "corporate" {
  if (a.next === "partner" || a.support === "partnership") return "partnership";
  if (a.objective === "invest" || a.objective === "realestate" || a.next === "discuss") return "investment";
  return "corporate";
}

/** Compact, validated encoding of the answers for `/contact?nav=`: five option ids joined by "." in question order. */
export const encodeAnswers = (a: Record<StepId, string>) => QUESTIONS.map((q) => a[q.id]).join(".");

export function decodeAnswers(raw: string | null | undefined): Record<StepId, string> | null {
  if (!raw || raw.length > 120) return null;
  const parts = raw.split(".");
  if (parts.length !== QUESTIONS.length) return null;
  const out = {} as Record<StepId, string>;
  for (let i = 0; i < QUESTIONS.length; i++) {
    if (!validOption(QUESTIONS[i].id, parts[i])) return null;
    out[QUESTIONS[i].id] = parts[i];
  }
  return out;
}

export function consultationHref(slug: string, a: Record<StepId, string>): string {
  const q = new URLSearchParams({ type: enquiryType(a), service: slug, nav: encodeAnswers(a) });
  return `/contact?${q.toString()}#enquiry-form`;
}

const NEXT_STEPS: Record<string, NextStep> = {
  understand: { label: "Browse all services", description: "See every area of Nexea's expertise side by side.", href: "/services#services-list" },
  discuss: { label: "See how Nexea evaluates opportunities", description: "A clear, five-stage view of how opportunities are considered.", href: "/investments#approach" },
  consult: { label: "Meet the team", description: "The people behind Nexea's leadership and governance.", href: "/team" },
  partner: { label: "Explore partnerships", description: "How Nexea builds strategic relationships.", href: "/partnerships" },
};

export function recommend(a: Answers): Result | null {
  if (!isComplete(a)) return null;
  const ranked = scoreServices(a);
  const [first, ...rest] = ranked;
  const comps = rest.filter((r) => r.score >= COMPLEMENT_MIN).slice(0, 2);
  const build = (r: ScoreRow, primary: boolean): Recommendation => ({ service: serviceBySlug(r.slug), key: r.key, score: r.score, why: whyText(r.key, a, primary) });
  const primary = build(first, true);
  return {
    primary,
    complementary: comps.map((r) => build(r, false)),
    steps: [NEXT_STEPS[a.next]],
    summary: QUESTIONS.map((q) => ({ label: q.short, value: optionOf(q.id, a[q.id])!.label })),
    consultationHref: consultationHref(primary.service.slug, a),
  };
}

/** Pre-written subject and message for the contact form, built only from validated service and answer ids. */
export function consultationDraft(slug: string | null | undefined, a: Record<StepId, string> | null): { subject: string; message: string } | null {
  const service = SERVICE_AREAS.find((s) => s.slug === slug);
  if (!service) return null;
  const lines = [`I would like to discuss: ${service.title}.`];
  if (a) {
    lines.push("", "From the Nexea Service Navigator:");
    for (const q of QUESTIONS) lines.push(`- ${q.short}: ${optionOf(q.id, a[q.id])!.label}`);
  }
  lines.push("", "Further context:", "");
  return { subject: `Service consultation: ${service.title}`, message: lines.join("\n") };
}
