/**
 * Partner logos shown in the Partnerships marquee.
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
  /** Keep the original brand colours. By default logos are shown in a restrained monochrome. */
  keepColor?: boolean;
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

export const partners: Partner[] = Array.from({ length: 8 }, (_, i) => placeholder(i + 1));

/** Approved, real partners only. */
export const publishedPartners = partners.filter((p) => p.approvedForPublication && !p.isPlaceholder);

/** What the marquee shows: real partners once any exist, otherwise the labelled preview placeholders. */
export const marqueePartners: Partner[] = publishedPartners.length > 0 ? publishedPartners : partners.filter((p) => p.isPlaceholder);

export const SHOW_PREVIEW_NOTICE = publishedPartners.length === 0 && marqueePartners.length > 0;
export const PARTNER_PREVIEW_NOTICE = "Design preview — partner logos will be added following confirmation.";
