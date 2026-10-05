/* Careers content source. Vacancies stay empty until the OAG publishes approved
   notices — never fabricate roles, counts or closing dates. Replace the body of
   fetchVacancies with the authorised feed, keeping the Vacancy shape. */

export type CareerArea = "financial" | "performance" | "compliance" | "it" | "investigations" | "corporate";
export type ContractType = "Permanent" | "Fixed-term" | "Internship" | "Consultancy";

export interface Vacancy {
  id: string;
  title: string;
  grade?: string;
  area: CareerArea;
  contract: ContractType;
  location: string;
  closes: string; // ISO date
  officialUrl: string;
}

export const CAREER_AREAS: { id: CareerArea; title: string; summary: string }[] = [
  { id: "financial", title: "Financial audit", summary: "Assurance over the financial statements of ECOWAS Institutions under international standards." },
  { id: "performance", title: "Performance audit", summary: "Assessing economy, efficiency and effectiveness of Community programmes — value for money." },
  { id: "compliance", title: "Compliance audit", summary: "Testing adherence to the ECOWAS Treaty, Financial Regulations and governing rules." },
  { id: "it", title: "IT and data audit", summary: "Information systems assurance, audit analytics and data-driven risk assessment." },
  { id: "investigations", title: "Investigations and integrity", summary: "Handling referrals, protecting reporters and supporting institutional integrity." },
  { id: "corporate", title: "Corporate services", summary: "Quality assurance, communication, legal, knowledge management and administration." },
];

export const PROCESS_STEPS = [
  { title: "Publication", body: "Vacancies are published through official ECOWAS recruitment channels with eligibility criteria and closing dates." },
  { title: "Application", body: "Candidates apply only through the official channel named in the notice. The OAG never charges a fee." },
  { title: "Assessment", body: "Shortlisted candidates may complete written tests and competency-based interviews." },
  { title: "Decision", body: "Appointments follow ECOWAS Staff Regulations, including verification of credentials and references." },
];

export const FAQS = [
  { q: "Who can apply?", a: "Eligibility is set in each vacancy notice. Professional posts are generally open to nationals of ECOWAS Member States who meet the stated qualifications and experience." },
  { q: "Does the OAG charge any recruitment fee?", a: "No. The OAG and ECOWAS never request payment at any stage. Report suspicious requests through IntegrityLine." },
  { q: "Can I send an unsolicited CV?", a: "Applications are considered only against a published vacancy through the official channel." },
  { q: "Are internships available?", a: "When internship opportunities are approved, they are published here and on the official ECOWAS recruitment channel." },
];

export const OFFICIAL_RECRUITMENT_URL = "https://www.ecowas.int/";

export async function fetchVacancies(): Promise<Vacancy[]> {
  return [];
}
