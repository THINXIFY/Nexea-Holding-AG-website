export interface HeroSlide {
  id: string;
  /** Short label on the slide selector. */
  label: string;
  eyebrow: string;
  /** Authored line breaks; each line is revealed separately. */
  headline: readonly string[];
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  image: {
    src: string;
    /** object-position per breakpoint, so the photograph's subject stays in frame. */
    position: { mobile: string; tablet: string; desktop: string };
  };
}

/**
 * Homepage hero slides. Images (public/images/slider), assigned by what they show:
 *  - slide-1.png: Swiss lakeside terrace with the Nexea logo and guests   -> Corporate Identity
 *  - slide-2.png: executive office over an international financial district -> Strategic Investments
 *  - slide-3.png: executive boardroom in discussion                         -> Global Perspective
 * Route checks: /investments#approach (InvApproach), /partnerships and /contact all exist.
 */
export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: "identity",
    label: "Our Identity",
    eyebrow: "Nexea Holding AG · Switzerland",
    headline: ["Investing Beyond", "Boundaries."],
    description:
      "Established in Switzerland in 2004, Nexea Holding AG pursues long-term value through strategic corporate participations and a global investment perspective.",
    primary: { label: "Explore Investments", href: "/investments" },
    secondary: { label: "Discover Nexea", href: "/about" },
    image: { src: "/images/slider/slide-1.png", position: { mobile: "86% 50%", tablet: "80% 50%", desktop: "70% 50%" } },
  },
  {
    id: "investments",
    label: "Investments",
    eyebrow: "Strategic Investments",
    headline: ["Capital with Purpose.", "Value with Vision."],
    description:
      "From real assets and established industries to technology and innovation, we explore investment opportunities with discipline and a long-term perspective.",
    primary: { label: "Our Investment Universe", href: "/investments" },
    secondary: { label: "Our Approach", href: "/investments#approach" },
    image: { src: "/images/slider/slide-2.png", position: { mobile: "86% 50%", tablet: "76% 50%", desktop: "66% 50%" } },
  },
  {
    id: "partnerships",
    label: "Global Perspective",
    eyebrow: "Global Perspective",
    headline: ["Connecting Opportunities.", "Creating Value."],
    description:
      "We believe enduring value begins with thoughtful decisions, meaningful relationships, and opportunities that reach across markets and industries.",
    primary: { label: "Explore Partnerships", href: "/partnerships" },
    secondary: { label: "Get in Touch", href: "/contact" },
    image: { src: "/images/slider/slide-3.png", position: { mobile: "88% 50%", tablet: "80% 50%", desktop: "72% 50%" } },
  },
];

/** Time each slide stays before advancing (ms). Also drives the progress line. */
export const HERO_DURATION_MS = 7000;
