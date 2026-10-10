/** Corporate facts for Nexea Holding AG. One source so every page quotes them identically. */
export const COMPANY = {
  name: "Nexea Holding AG",
  website: "nexea-holding.com",
  email: "info@nexea-holding.com",
  address: {
    street: "Sonnenbergstrasse 9",
    postalCity: "6052 Hergiswil NW",
    country: "Switzerland",
  },
  commercialRegisterNumber: "CH-170.3.027.541-5",
  uid: "CHE-111.982.395",
  legalForm: "Aktiengesellschaft (AG)",
  commercialRegisterOffice: "Nidwalden (NW)",
  registeredOffice: "Hergiswil, Nidwalden, Switzerland",
  registrationDate: "27 August 2004",
  status: "Active",
  /** Registered share capital per the supplied corporate records. NOT investment capacity or available funds. */
  shareCapital: { amount: "CHF 2,000,000", currency: "Swiss Francs (CHF)" },
  auditor: { name: "Arimec Audit AG", location: "Suhr, Switzerland" },
  url: "https://nexea-holding.com",
} as const;

export const ADDRESS_LINES = [COMPANY.address.street, COMPANY.address.postalCity, COMPANY.address.country] as const;
export const ADDRESS_ONE_LINE = ADDRESS_LINES.join(", ");

/** Google Maps endpoints driven purely by the address text (no API key, no invented coordinates). */
export const MAPS_QUERY = encodeURIComponent(ADDRESS_ONE_LINE);
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;
export const MAPS_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
