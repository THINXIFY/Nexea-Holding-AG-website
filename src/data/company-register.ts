/**
 * Company register documents shown from the Contact and Impressum pages.
 *
 * Both are THIRD-PARTY INFORMATIONAL REPORTS in German, not certified commercial-register extracts. Their issuers
 * state this themselves (Pappers: "for information purposes only"; Moneyhouse: only the certified extract issued by
 * the responsible commercial registry is authoritative). Never describe them as certified or government-issued.
 *
 * The files live in public/documents/company register/ (the folder name contains a space, so URLs are encoded).
 */
export interface RegisterDocument {
  id: string;
  title: string;
  source: string;
  /** Human-readable date shown on the card. */
  dateLabel: string;
  /** ISO date for the <time> element. */
  dateISO: string;
  description: string;
  file: string;
  /** Download filename offered to the visitor. */
  downloadName: string;
}

const FOLDER = "/documents/company register/";
const url = (file: string) => encodeURI(`${FOLDER}${file}`);

export const REGISTER_DOCUMENTS: readonly RegisterDocument[] = [
  {
    id: "commercial-register-extract",
    title: "Commercial Register Extract",
    source: "Pappers/Zefix",
    dateLabel: "08 October 2026",
    dateISO: "2026-10-08",
    description: "Commercial register information for Nexea Holding AG, sourced from Pappers/Zefix.",
    file: url("Registrierungsauszug - CHE111982395.pdf"),
    downloadName: "Nexea Holding AG - Commercial Register Extract (Pappers-Zefix, 2026-10-08).pdf",
  },
  {
    id: "company-dossier",
    title: "Company Dossier",
    source: "Moneyhouse",
    dateLabel: "09 October 2026",
    dateISO: "2026-10-09",
    description: "Corporate registration details, management information and company information, provided by Moneyhouse.",
    file: url("Firmendossier Nexea Holding AG.pdf"),
    downloadName: "Nexea Holding AG - Company Dossier (Moneyhouse, 2026-10-09).pdf",
  },
];
