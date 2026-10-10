import { INVESTMENT_SECTORS } from "@/data/investment-sectors";

export type EnquiryId = "investment" | "partnership" | "corporate" | "other";

export interface EnquiryType {
  id: EnquiryId;
  number: string;
  /** Card title in the selector. */
  title: string;
  /** Label used in the form's Enquiry Type field and in the notification email. */
  formLabel: string;
  description: string;
}

export const ENQUIRY_TYPES: readonly EnquiryType[] = [
  { id: "investment", number: "01", title: "Investment Opportunities", formLabel: "Investment Opportunity", description: "Introduce a business, asset, or investment proposal for potential consideration." },
  { id: "partnership", number: "02", title: "Strategic Partnerships", formLabel: "Strategic Partnership", description: "Explore potential joint ventures, business relationships, and international collaborations." },
  { id: "corporate", number: "03", title: "Corporate Enquiries", formLabel: "Corporate Enquiry", description: "Contact Nexea Holding AG regarding general company information or business matters." },
  { id: "other", number: "04", title: "Other Enquiries", formLabel: "Other Enquiry", description: "For questions or messages that don't fit the categories above." },
];

export const DEFAULT_ENQUIRY: EnquiryId = "investment";

export const isEnquiryId = (v: unknown): v is EnquiryId => ENQUIRY_TYPES.some((t) => t.id === v);

/** Safe parser for `?type=`: anything unknown is ignored (returns undefined). */
export const parseEnquiryParam = (v: string | null | undefined): EnquiryId | undefined => (isEnquiryId(v) ? v : undefined);

export const enquiryById = (id: EnquiryId): EnquiryType => ENQUIRY_TYPES.find((t) => t.id === id) ?? ENQUIRY_TYPES[0];

/** Sector choices come from the Investments page data (no second list to maintain), plus "Other". */
export const SECTOR_OTHER = "Other";
export const SECTOR_OPTIONS: readonly string[] = [...INVESTMENT_SECTORS.map((s) => s.title), SECTOR_OTHER];
