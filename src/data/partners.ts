/**
 * Partner logos shown in the Partners marquee.
 *
 * The eight entries below are DESIGN-PREVIEW placeholders (generic monograms, not companies).
 * They are never presented as verified relationships and the page labels them as a preview.
 *
 * To publish a real partner (no UI changes needed):
 *  1. Put the transparent PNG in `public/images/partners/` (or replace a placeholder file).
 *  2. Update `name`, `logo` and, optionally, `website`, `width` and `height` (the file's pixel size).
 *  3. Set `approvedForPublication: true` and `isPlaceholder: false`.
 * As soon as one approved, non-placeholder partner exists, only approved partners are shown and the
 * preview notice disappears automatically. Only publish logos whose relationship and branding
 * permissions have been confirmed in writing.
 */
export type Partner = {
  id: string;
  name: string;
  /** Path under /public. Transparent PNG recommended. */
  logo: string;
  /** Logo is linked only when the partner is approved, not a placeholder, and has a website. */
  website?: string;
  category?: string;
  approvedForPublication: boolean;
  isPlaceholder: boolean;
  /** Intrinsic pixel size of the logo file (used to avoid layout shift). Defaults to 600 x 164 (the placeholder size). */
  width?: number;
  height?: number;
  /** Keep the original brand colours at all times. By default logos rest in a restrained monochrome and show colour on hover. */
  keepColor?: boolean;
  /** Why this entry is not yet published (internal note; never rendered). */
  review?: string;
};

const placeholder = (n: number): Partner => {
  const id = `partner-${String(n).padStart(2, "0")}`;
  return {
    id,
    name: `Partner ${String(n).padStart(2, "0")}`,
    logo: `/images/partners/${id}.png`,
    approvedForPublication: false,
    isPlaceholder: true,
  };
};

/**
 * Logos supplied by Nexea for the showcase, stored locally. They are published at Nexea's instruction: confirming
 * each relationship and holding permission to show each trademark is Nexea's responsibility. To withdraw one, set
 * its `approvedForPublication` to false (it disappears; nothing else changes). `review` holds open follow-ups.
 */
const candidate = (c: Omit<Partner, "approvedForPublication" | "isPlaceholder">): Partner => ({ keepColor: true, ...c, approvedForPublication: true, isPlaceholder: false });

export const candidatePartners: Partner[] = [
  candidate({ id: "allianz", name: "Allianz", logo: "/images/partners/allianz.png", width: 560, height: 139, review: "Relationship not documented." }),
  candidate({ id: "deutsche-telekom", name: "Deutsche Telekom", logo: "/images/partners/deutsche-telekom.png", width: 560, height: 275, review: "Relationship not documented. The supplied artwork also looks incomplete (the usual four-square mark shows two); obtain the official file." }),
  candidate({ id: "ubs", name: "UBS", logo: "/images/partners/ubs.png", width: 560, height: 203, review: "Relationship not documented." }),
  candidate({ id: "newmont", name: "Newmont Corporation", logo: "/images/partners/newmont.png", width: 560, height: 83, review: "Relationship not documented." }),
  candidate({ id: "vodafone", name: "Vodafone", logo: "/images/partners/vodafone.png", width: 560, height: 138, review: "Relationship not documented." }),
  candidate({ id: "shell", name: "Shell", logo: "/images/partners/shell.png", width: 560, height: 522, review: "Relationship not documented." }),
  candidate({ id: "mercedes-benz", name: "Mercedes-Benz", logo: "/images/partners/mercedes-benz.png", width: 560, height: 142, review: "A document titled 'Mercedes-Benz Partnership Agreement' is among the PDFs Nexea sends to verified visitors, but the agreement itself and permission to show the logo have not been confirmed." }),
  candidate({ id: "unverified-nexus-mutual", name: "Nexus Mutual", logo: "/images/partners/unverified-nexus-mutual.png", width: 560, height: 177, review: "The file is a ChatGPT-generated image, not an official brand asset. It reads 'Nexus Mutual' (a crypto cover protocol, not Nexea). Do not publish without a confirmed relationship and an official logo." }),
  candidate({ id: "sauber-motorsport", name: "Sauber Motorsport", logo: "/images/partners/sauber-motorsport.png", width: 304, height: 58, review: "Relationship not documented. Source file is only 304px wide (soft on retina screens); obtain a larger file." }),
];

export const partners: Partner[] = [...Array.from({ length: 8 }, (_, i) => placeholder(i + 1)), ...candidatePartners];

/** Approved, real partners only. */
export const publishedPartners = partners.filter((p) => p.approvedForPublication && !p.isPlaceholder);

/** What the marquee shows: real partners once any exist, otherwise the labelled preview placeholders. */
export const marqueePartners: Partner[] = publishedPartners.length > 0 ? publishedPartners : partners.filter((p) => p.isPlaceholder);

export const SHOW_PREVIEW_NOTICE = publishedPartners.length === 0 && marqueePartners.length > 0;
export const PARTNER_PREVIEW_NOTICE = "Design preview — partner logos will be added following confirmation.";
