export type TeamGroup = "board" | "executive";

/**
 * Email addresses follow a PROPOSED naming convention on nexea-holding.com. No
 * mailbox has been confirmed to exist or approved for publication, so every
 * member is "proposed". The interface never claims an address is verified or active.
 */
export type EmailStatus = "proposed" | "confirmed";

/**
 * Master switch: true renders addresses as clickable mailto links, false renders
 * them as plain, copyable text. Flip to false (or remove an address) until the
 * mailboxes are confirmed for the live site.
 */
export const EMAIL_LINKS_ENABLED = true;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  group: TeamGroup;
  email?: string;
  emailStatus?: EmailStatus;
  /** Display order within its group (1-based). */
  order: number;
}

/**
 * Names and roles supplied for website development. They must be confirmed
 * against Nexea's current corporate records before public release. No
 * biographies, qualifications, signing powers or contact details beyond the
 * supplied addresses are implied.
 */
export const TEAM: readonly TeamMember[] = [
  { id: "schoepfer", name: "Hans Rudolf Paul Schöpfer", role: "President of the Board of Directors", group: "board", email: "hans.schoepfer@nexea-holding.com", emailStatus: "proposed", order: 1 },
  { id: "li", name: "Chao Li", role: "Vice Chairman", group: "board", email: "chao.li@nexea-holding.com", emailStatus: "proposed", order: 2 },
  { id: "girardet", name: "Alain Girardet", role: "Chief Executive Officer (CEO)", group: "board", email: "alain.girardet@nexea-holding.com", emailStatus: "proposed", order: 3 },
  { id: "chen", name: "Chiung Ling Chen", role: "Director", group: "board", email: "chiung.chen@nexea-holding.com", emailStatus: "proposed", order: 4 },
  { id: "rueegg", name: "Dr. Marcel Beat Rüegg", role: "Member of the Board of Directors", group: "board", email: "marcel.rueegg@nexea-holding.com", emailStatus: "proposed", order: 5 },
  { id: "vatkin", name: "Benjamin Vatkin", role: "Chief Financial Officer (CFO)", group: "executive", email: "benjamin.vatkin@nexea-holding.com", emailStatus: "proposed", order: 1 },
  { id: "falkenberg", name: "Alexander Falkenberg", role: "Chief Marketing Officer (CMO)", group: "executive", email: "alexander.falkenberg@nexea-holding.com", emailStatus: "proposed", order: 2 },
  { id: "saraceno", name: "Dario Saraceno", role: "Asset Management", group: "executive", email: "dario.saraceno@nexea-holding.com", emailStatus: "proposed", order: 3 },
];

export const membersOf = (group: TeamGroup): TeamMember[] =>
  TEAM.filter((m) => m.group === group).sort((a, b) => a.order - b.order);

export const BOARD = membersOf("board");
export const EXECUTIVE = membersOf("executive");
