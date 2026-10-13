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
 *  - slide-1.jpg: dark glass towers with a glowing bar chart and rising arrow -> Corporate Identity
 *  - slide-2.jpg: bright blue towers with a rising chart                      -> Strategic Investments
 *  - slide-3.jpg: sunset skyline with a world-network overlay                 -> Global Perspective
 * All three are 2000 x 1121 JPEGs; next/image serves optimised AVIF/WebP. Positions keep each photo's subject (chart and
 * towers) in frame while the copy sits over the left.
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
    image: { src: "/images/slider/slide-1.jpg", position: { mobile: "64% 50%", tablet: "62% 50%", desktop: "55% 50%" } },
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
    image: { src: "/images/slider/slide-2.jpg", position: { mobile: "62% 50%", tablet: "60% 50%", desktop: "52% 50%" } },
  },
  {
    id: "partnerships",
    label: "Global Perspective",
    eyebrow: "Global Perspective",
    headline: ["Connecting Opportunities.", "Creating Value."],
    description:
      "We believe enduring value begins with thoughtful decisions, meaningful relationships, and opportunities that reach across markets and industries.",
    primary: { label: "Explore Partners", href: "/partnerships" },
    secondary: { label: "Get in Touch", href: "/contact" },
    image: { src: "/images/slider/slide-3.jpg", position: { mobile: "44% 50%", tablet: "38% 50%", desktop: "50% 50%" } },
  },
];

/** Time each slide stays before advancing (ms). Also drives the progress line. */
export const HERO_DURATION_MS = 7000;
