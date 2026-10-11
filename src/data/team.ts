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
  /** Role-based corporate summary. Not an independently verified biography: no credentials, history or achievements. */
  description: string;
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
  { id: "schoepfer", name: "Hans Rudolf Paul Schöpfer", role: "President of the Board of Directors", group: "board", email: "hans.schoepfer@nexea-holding.com", emailStatus: "proposed", description: "Provides board leadership and governance oversight, supporting strategic direction, responsible decision-making, and the long-term interests of Nexea Holding AG and its stakeholders.", order: 1 },
  { id: "li", name: "Chao Li", role: "Vice Chairman", group: "board", email: "chao.li@nexea-holding.com", emailStatus: "proposed", description: "Supports board governance and strategic deliberations, contributing to investment priorities, organizational direction, and effective coordination between leadership and the wider business.", order: 2 },
  { id: "girardet", name: "Alain Girardet", role: "Chief Executive Officer (CEO)", group: "board", email: "alain.girardet@nexea-holding.com", emailStatus: "proposed", description: "Leads executive strategy and operational priorities, guiding Nexea Holding AG’s investment and consulting activities while fostering disciplined execution and sustainable business development.", order: 3 },
  { id: "chen", name: "Chiung Ling Chen", role: "Director", group: "board", email: "chiung.chen@nexea-holding.com", emailStatus: "proposed", description: "Contributes to board-level oversight and strategic discussions, supporting informed decisions, sound governance practices, and the company’s evolving investment and business objectives.", order: 4 },
  { id: "rueegg", name: "Dr. Marcel Beat Rüegg", role: "Member of the Board of Directors", group: "board", email: "marcel.rueegg@nexea-holding.com", emailStatus: "proposed", description: "Participates in board governance and strategic review, helping assess organizational priorities, business opportunities, and decisions aligned with the company’s long-term direction.", order: 5 },
  { id: "vatkin", name: "Benjamin Vatkin", role: "Chief Financial Officer (CFO)", group: "executive", email: "benjamin.vatkin@nexea-holding.com", emailStatus: "proposed", description: "Oversees financial management and reporting priorities, supporting budget discipline, financial planning, risk awareness, and sound resource allocation across the company’s operations.", order: 1 },
  { id: "falkenberg", name: "Alexander Falkenberg", role: "Chief Marketing Officer (CMO)", group: "executive", email: "alexander.falkenberg@nexea-holding.com", emailStatus: "proposed", description: "Guides marketing strategy and corporate communications, strengthening brand positioning, stakeholder engagement, and the clear presentation of Nexea Holding AG’s investment capabilities.", order: 2 },
  { id: "saraceno", name: "Dario Saraceno", role: "Asset Management", group: "executive", email: "dario.saraceno@nexea-holding.com", emailStatus: "proposed", description: "Focuses on asset management priorities, supporting portfolio oversight, investment analysis, and disciplined evaluation of opportunities in alignment with the company’s strategic objectives.", order: 3 },
];

export const membersOf = (group: TeamGroup): TeamMember[] =>
  TEAM.filter((m) => m.group === group).sort((a, b) => a.order - b.order);

export const BOARD = membersOf("board");
export const EXECUTIVE = membersOf("executive");
