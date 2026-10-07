/* Procurement content source. All published collections stay empty until the OAG
   connects an authorised procurement feed, never fabricate notices, plans,
   awards, projects, contacts or resource documents. Replace the bodies of the
   fetch functions with the authorised source, keeping the shapes below.
   Records are structured for later reviewed EN/FR/PT content. */

export type NoticeType = "tender" | "expression-of-interest" | "request-for-quotation" | "prequalification";
export type NoticeStatus = "open" | "closed" | "cancelled";
export type AwardStatus = "awarded" | "standstill" | "cancelled";

export interface ProcurementNotice {
  id: string;
  reference: string;
  title: string;
  type: NoticeType;
  status: NoticeStatus;
  institution: string;
  published: string; // ISO date
  deadline: string; // ISO date
  summary: string;
  donorFunded: boolean;
  documents: { title: string; url: string }[];
}

export interface ProcurementPlan {
  id: string;
  year: number;
  institution: string;
  title: string;
  summary: string;
  documentUrl?: string;
}

export interface ProcurementAward {
  id: string;
  reference: string;
  title: string;
  status: AwardStatus;
  institution: string;
  awardedTo?: string;
  awardDate?: string; // ISO date
  value?: string;
}

export interface ProcurementProject {
  id: string;
  title: string;
  institution: string;
  summary: string;
  donorFunded: boolean;
}

export interface ProcurementResource {
  id: string;
  title: string;
  kind: "guide" | "regulation" | "template" | "policy";
  summary: string;
  documentUrl?: string;
}

export const NOTICE_TYPES: { id: NoticeType; title: string }[] = [
  { id: "tender", title: "Call for tenders" },
  { id: "expression-of-interest", title: "Expression of interest" },
  { id: "request-for-quotation", title: "Request for quotation" },
  { id: "prequalification", title: "Prequalification" },
];

export const RESOURCE_KINDS: { id: ProcurementResource["kind"]; title: string }[] = [
  { id: "guide", title: "Guide" },
  { id: "regulation", title: "Regulation" },
  { id: "template", title: "Template" },
  { id: "policy", title: "Policy" },
];

export const PARTICIPATION_STEPS = [
  { title: "Find a notice", body: "Published notices appear on this page and through official ECOWAS procurement channels, with eligibility criteria, documents and deadlines." },
  { title: "Prepare your submission", body: "Follow the instructions in the notice exactly. Submissions are accepted only through the channel named in the notice." },
  { title: "Submit before the deadline", body: "Late or incomplete submissions cannot be considered. The OAG never charges a fee to access or respond to a notice." },
  { title: "Award and standstill", body: "Award decisions are published after evaluation, subject to any applicable standstill period before contract signature." },
];

export const AUTHENTICITY_GUIDANCE =
  "Genuine OAG procurement notices are published on this website and official ECOWAS channels, carry a formal reference number, and never request payment to participate. If you receive a procurement offer by unsolicited email or are asked to pay a fee, treat it as fraudulent and report it through IntegrityLine.";

export const PROCUREMENT_FAQS = [
  { q: "Who can respond to a procurement notice?", a: "Eligibility is defined in each notice. Depending on the procedure, participation may be open to firms and individuals from ECOWAS Member States or, for donor-funded procurement, according to the financing agreement." },
  { q: "Is there a fee to obtain tender documents?", a: "No. The OAG and ECOWAS never charge for access to procurement notices or documents. Report any payment request through IntegrityLine." },
  { q: "How are awards decided?", a: "Submissions are evaluated against the criteria published in the notice, in line with applicable ECOWAS procurement rules and, where relevant, donor procedures." },
  { q: "Where can I see past awards?", a: "Published contract awards appear in the Awards section of this page once approved for publication." },
  { q: "How do I report a suspicious procurement approach?", a: "Use IntegrityLine, the Office's confidential reporting channel. Do not pay any fee or share banking details." },
];

export async function fetchNotices(): Promise<ProcurementNotice[]> {
  return [];
}

export async function fetchPlans(): Promise<ProcurementPlan[]> {
  return [];
}

export async function fetchAwards(): Promise<ProcurementAward[]> {
  return [];
}

export async function fetchProjects(): Promise<ProcurementProject[]> {
  return [];
}

export async function fetchResources(): Promise<ProcurementResource[]> {
  return [];
}
