import { Building2, HeartPulse, Landmark, ShieldCheck, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type SupportingInstitution = {
  slug: string; key: string; shortName: string; name: string; category: string; summary: string;
  logoPath: string; logoAlt: string; site: string; officialProfile: string; icon: LucideIcon;
  facts: [string, string][]; mandate: string[];
  /** Summary hierarchy (top first) shown until an official organogram is supplied. */
  structure: string[];
  /** Optional official organogram path in the public institution asset store. */
  organogramPath?: string;
};

export function institutionAssetUrl(path: string) {
  return supabase.storage.from("institution-assets").getPublicUrl(path).data.publicUrl;
}

export const SUPPORTING_INSTITUTIONS: SupportingInstitution[] = [
  {
    slug: "oag", key: "oag", structure: ["Auditor General","Audit directorates","Investigation and integrity","Quality assurance and follow-up","Corporate services"], shortName: "OAG", name: "Office of the Auditor General", category: "Independent assurance",
    summary: "Provides independent audit and assurance across ECOWAS institutions, supporting accountability, good corporate governance and value for money.",
    logoPath: "logos/auditor-logo.png", logoAlt: "Office of the Auditor General logo",
    site: "https://www.ecowas.int/institutions/office-of-the-auditor-general/", officialProfile: "https://www.ecowas.int/institutions/office-of-the-auditor-general/", icon: ShieldCheck,
    facts: [["Institutional position", "Independent assurance office"], ["Scope", "ECOWAS institutions"], ["Focus", "Accountability and value for money"]],
    mandate: ["Provide independent audit and assurance", "Support stewardship of Community resources", "Report findings and recommendations", "Follow up corrective action"],
  },
  {
    slug: "ebid", key: "ebid", structure: ["Board of Governors","Board of Directors","President","Vice-Presidents","Operational departments"], shortName: "EBID", name: "ECOWAS Bank for Investment and Development", category: "Regional development finance",
    summary: "The Community’s financial institution, financing public- and private-sector projects that support regional economic development and integration.",
    logoPath: "logos/ebid.png", logoAlt: "ECOWAS Bank for Investment and Development logo",
    site: "https://www.bidc-ebid.org/", officialProfile: "https://www.ecowas.int/institutions/ecowas-bank-for-investment-and-development-ebid/", icon: Landmark,
    facts: [["Headquarters", "Lomé, Togo"], ["Institution type", "Regional development bank"], ["Coverage", "ECOWAS region"]],
    mandate: ["Finance regional development projects", "Support public- and private-sector investment", "Advance economic integration", "Promote sustainable development"],
  },
  {
    slug: "waho", key: "waho", structure: ["Assembly of Health Ministers","Director General","Technical departments","Administration and finance"], shortName: "WAHO", name: "West African Health Organisation", category: "Regional public health",
    summary: "The regional health agency that harmonizes Member States’ health policies, pools resources and coordinates responses to shared health challenges.",
    logoPath: "logos/waho.png", logoAlt: "West African Health Organisation logo",
    site: "https://www.wahooas.org/", officialProfile: "https://www.ecowas.int/institutions/west-african-health-organisation-waho/", icon: HeartPulse,
    facts: [["Headquarters", "Bobo-Dioulasso, Burkina Faso"], ["Institution type", "Specialized health agency"], ["Coverage", "ECOWAS region"]],
    mandate: ["Harmonize regional health policies", "Coordinate responses to shared health challenges", "Pool expertise and health resources", "Strengthen cooperation among Member States"],
  },
  {
    slug: "giaba", key: "giaba", structure: ["Ministerial Committee","Director General","Technical directorates","Administration and finance"], shortName: "GIABA", name: "Inter-Governmental Action Group against Money Laundering in West Africa", category: "Financial integrity",
    summary: "The regional body that strengthens Member States’ capacity to prevent money laundering, terrorist financing and related threats to financial systems.",
    logoPath: "logos/giaba.png", logoAlt: "GIABA logo",
    site: "https://www.giaba.org/", officialProfile: "https://www.ecowas.int/institutions/the-inter-governmental-action-group-against-money-laundering-and-terrorism-financing-in-africa-giaba/", icon: Building2,
    facts: [["Headquarters", "Dakar, Senegal"], ["Institution type", "Regional financial integrity body"], ["Coverage", "West Africa"]],
    mandate: ["Strengthen anti-money-laundering systems", "Counter terrorist financing", "Assess Member State frameworks", "Support regional cooperation and technical capacity"],
  },
];