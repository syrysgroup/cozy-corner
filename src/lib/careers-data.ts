/* Published OAG vacancies are read from the approved public Careers records. */

import type { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export type Vacancy = Tables<"careers_jobs">;
export type CareerArea = string;
export type ContractType = string;

export const CAREER_AREAS: { id: CareerArea; title: string; summary: string }[] = [
  { id: "financial", title: "Financial audit", summary: "Assurance over the financial statements of ECOWAS Institutions under international standards." },
  { id: "performance", title: "Performance audit", summary: "Assessing economy, efficiency and effectiveness of Community programmes, value for money." },
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
  const { data, error } = await supabase
    .from("careers_jobs")
    .select("*")
    .eq("is_published", true)
    .is("archived_at", null)
    .order("featured", { ascending: false })
    .order("closing_date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchVacancyBySlug(slug: string): Promise<Vacancy | null> {
  const { data, error } = await supabase
    .from("careers_jobs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .is("archived_at", null)
    .maybeSingle();

  if (error) throw error;
  return data;
}
