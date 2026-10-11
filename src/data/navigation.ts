export type MegaId = "investments" | "services";

export interface NavItem {
  label: string;
  /**
   * Destination. Leave `undefined` while the page does not exist yet: the item is omitted from the
   * navigation rather than rendered as a dead control.
   */
  href?: string;
  /** Opens the matching mega menu (desktop) or accordion (mobile). */
  mega?: MegaId;
}

const ALL_NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Investments", href: "/investments", mega: "investments" },
  { label: "Services", href: "/services", mega: "services" },
  { label: "Team", href: "/team" },
  { label: "Our Partners", href: "/partnerships" },
  { label: "Contact", href: "/contact" },
];

/** Only published destinations are shown. */
export const NAV_ITEMS: readonly NavItem[] = ALL_NAV_ITEMS.filter((i) => i.href);

/** The desktop header shows Contact as a distinct CTA button; the drawer keeps it in the list. */
export const NAV_LINKS: readonly NavItem[] = NAV_ITEMS.filter((i) => i.href !== "/contact");
export const NAV_CTA: NavItem = { label: "Contact", href: "/contact" };

/** Tooltip for inert controls whose destination is not yet published. */
export const UNAVAILABLE_HINT = "This page is not yet available";

/* ---------- Deep links ----------
 * Investments page: `?category=<group id>` filters the directory; `?sector=<slug>` filters to that sector's
 * category, scrolls to it and highlights it. Both are read by SectorDirectory and always end with #sectors.
 * Services page: `?service=<slug>` opens that service's detail panel (SvAreas) and scrolls to it.
 */
export const categoryHref = (groupId: string) => `/investments?category=${groupId}#sectors`;
export const sectorDeepLink = (slug: string) => `/investments?sector=${slug}#sectors`;
export const serviceDeepLink = (slug: string) => `/services?service=${slug}#services-list`;
