import { useOfficialAsset } from "@/lib/public-site";
import { InstitutionProfilePage } from "./profile-template";
import type { LucideIcon } from "lucide-react";

export type ArmInfo = { slug: string; key: string; site: string; arm: string; body: string; role: string; logo: string; icon: LucideIcon };

type Profile = {
  summary: string;
  building?: { path: string; alt: string; caption: string };
  facts: [string, string][];
  leader: { title: string; name: string; country: string; since: string; portraitPath?: string };
  additionalLeaders?: { role: string; name: string; country: string; portfolio: string; link: string; portraitPath?: string }[];
  mandate: string[];
  structure: string[];
  history: [string, string][];
  organogramPath?: string;
};

// Commission information is centralized here so profile views and listings share one record.
const PROFILES: Record<string, Profile> = {
  commission: {
    summary: "The ECOWAS Commission is the Community’s executive arm. It implements decisions and regional programmes, coordinates Community institutions, and advances cooperation among Member States.",
    building: { path: "Building/commission headquarter.jpeg", alt: "ECOWAS Commission headquarters in Abuja, Nigeria", caption: "ECOWAS Commission headquarters · Abuja, Nigeria" },
    facts: [["Headquarters", "Abuja, Nigeria"], ["Established", "1975"], ["Member States", "12"], ["Leadership term", "2026–2030"], ["Legal basis", "Revised ECOWAS Treaty, 1993"]],
    leader: { title: "President of the ECOWAS Commission", name: "H.E. General Birame Diop", country: "Senegal", since: "1 September 2026", portraitPath: "Leadership/commission-president.jpeg" },
    additionalLeaders: [
      { role: "Vice-President of the ECOWAS Commission", name: "H.E. Anthony Oluwatosin Ogunjimi", country: "Nigeria", portfolio: "Office of the Vice-President", link: "https://www.ecowas.int/departments/office-of-the-vice-president/", portraitPath: "Leadership/commission vice president.jpeg" },
      { role: "Commissioner", name: "Ms. Francess Piagie Alghali", country: "Sierra Leone", portfolio: "Political Affairs, Peace and Security", link: "https://www.ecowas.int/departments/political-affairs-peace-security/", portraitPath: "Leadership/commissioner political affairs.jpeg" },
      { role: "Commissioner", name: "Mr. Dehpue Yenpea Zuo", country: "Liberia", portfolio: "Economic Affairs and Agriculture", link: "https://www.ecowas.int/departments/economic-affairs-agriculture/", portraitPath: "Leadership/commissioner economic affairs and agriculture.jpeg" },
      { role: "Commissioner", name: "Dr. Kalilou Sylla", country: "Côte d’Ivoire", portfolio: "Internal Services", link: "https://www.ecowas.int/departments/internal-affairs/", portraitPath: "Leadership/commissioner for internal services.jpeg" },
      { role: "Commissioner", name: "Hon. Amin Amidu Sulemani", country: "Ghana", portfolio: "Infrastructure, Energy and Digitalization", link: "https://www.ecowas.int/departments/infrastructure-energy-digitalization/", portraitPath: "Leadership/commissioner for infrastructure, Energy & Digital.jpeg" },
      { role: "Commissioner", name: "Prof. Nassirou Bako-Arifari", country: "Benin", portfolio: "Human Development and Social Affairs", link: "https://www.ecowas.int/departments/human-development-social-affairs/", portraitPath: "Leadership/commissioner human development and social affairs.jpeg" },
    ],
    mandate: ["Prepare and implement decisions of the Authority and Council of Ministers", "Propose Community legislation and regional policies", "Manage Community programmes, budget and resources", "Represent the Community in international relations"],
    structure: ["President", "Vice-President", "Commissioners leading thematic departments", "Directorates and specialised agencies"],
    history: [["1975", "Treaty of Lagos creates ECOWAS and its Executive Secretariat"], ["1993", "Revised Treaty broadens Community institutions"], ["2007", "Executive Secretariat transformed into the Commission"]],
  },
  parliament: {
    summary: "The ECOWAS Parliament is the Community’s assembly of peoples. It brings together representatives of Member State parliaments to debate regional issues, give opinions on Community acts and strengthen democratic oversight.",
    building: { path: "Building/parliament building.JPG", alt: "ECOWAS Parliament building in Abuja, Nigeria", caption: "ECOWAS Parliament building · Abuja, Nigeria" },
    facts: [["Headquarters", "Abuja, Nigeria"], ["Established", "Protocol of 1994; inaugurated in 2000"], ["Seats", "115 representatives from Member States"], ["Working languages", "English, French, Portuguese"]],
    leader: { title: "Speaker of the ECOWAS Parliament", name: "Rt. Hon. Hadja Mémounatou Ibrahima", country: "Togo", since: "2024", portraitPath: "Leadership/parliament speaker.jpg" },
    additionalLeaders: [
      { role: "First Deputy Speaker", name: "Rt. Hon. Jibrin Barau", country: "Nigeria", portfolio: "Bureau Member", link: "https://www.parl.ecowas.int/structure-parliament/", portraitPath: "Leadership/parliament 1st deputy speaker.jpeg" },
      { role: "Second Deputy Speaker", name: "Hon. Adjaratou Traore Coulibaly", country: "Côte d’Ivoire", portfolio: "Bureau Member", link: "https://www.parl.ecowas.int/structure-parliament/", portraitPath: "Leadership/parliament 2nd deputy speaker.jpeg" },
      { role: "Third Deputy Speaker", name: "Hon. Alexander Afenyo-Markin", country: "Ghana", portfolio: "Bureau Member", link: "https://www.parl.ecowas.int/structure-parliament/", portraitPath: "Leadership/parliament 3rd deputy speaker.jpeg" },
      { role: "Fourth Deputy Speaker", name: "Hon. Billay Tunkara", country: "Gambia", portfolio: "Bureau Member", link: "https://www.parl.ecowas.int/structure-parliament/", portraitPath: "Leadership/parliament 4th deputy speaker.jpeg" },
    ],
    mandate: ["Consider matters on human rights, integration and regional policy", "Give opinions on Community acts and the budget", "Promote democratic governance and citizen participation", "Strengthen links between national parliaments"],
    structure: ["Speaker and Bureau", "Plenary of Members of Parliament", "Standing committees", "General Secretariat"],
    history: [["1993", "Revised Treaty provides for a Community Parliament"], ["1994", "Protocol relating to the Parliament adopted"], ["2000", "First Legislature inaugurated"]],
  },
  court: {
    summary: "The Community Court of Justice is the judicial arm of ECOWAS. It interprets and applies Community law, settles disputes between Member States and institutions, and hears human rights cases brought by individuals.",
    facts: [["Seat", "Abuja, Nigeria"], ["Established", "Protocol of 1991; operational since 2001"], ["Jurisdiction", "Community law, disputes, human rights"], ["Working languages", "English, French, Portuguese"]],
    leader: { title: "President of the Court", name: "Hon. Justice Ricardo Cláudio Monteiro Gonçalves", country: "Cabo Verde", since: "2022" },
    mandate: ["Interpret and apply the Treaty and Community acts", "Settle disputes between Member States and institutions", "Hear cases on human rights violations in Member States", "Give advisory opinions on Community law"],
    structure: ["President and Vice-President", "Judges of the Court", "Registry", "Administration"],
    history: [["1991", "Protocol on the Community Court of Justice adopted"], ["2001", "Court inaugurated"], ["2005", "Supplementary Protocol extends jurisdiction to human rights"]],
  },
};


export function ArmDetailPage({ a }: { a: ArmInfo }) {
  const p = PROFILES[a.slug];
  const logo = useOfficialAsset(a.key, a.logo);
  const others = p.additionalLeaders ?? [];
  const isCommission = a.slug === "commission";
  const groups = isCommission
    ? [{ title: "Vice-President", members: others.filter((l) => l.role !== "Commissioner") }, { title: "Commissioners and portfolios", members: others.filter((l) => l.role === "Commissioner") }]
    : [{ title: a.slug === "parliament" ? "Bureau of Parliament" : "Leadership", members: others }];
  return (
    <InstitutionProfilePage p={{
      name: a.body, eyebrow: `${a.arm} arm of ECOWAS`, icon: a.icon, logo: { src: logo.src, alt: logo.alt ?? `Official logo of the ${a.body}` },
      summary: p.summary, site: a.site, building: p.building, facts: p.facts,
      leader: { role: p.leader.title, name: p.leader.name, country: p.leader.country, since: p.leader.since, portraitPath: p.leader.portraitPath, officeLink: isCommission ? "https://www.ecowas.int/departments/office-of-the-president/" : undefined },
      leadershipEyebrow: isCommission ? "Executive leadership · 2026–2030" : "Leadership",
      leadershipTitle: isCommission ? "Commission leadership" : undefined,
      leaderGroups: groups, mandate: p.mandate, structure: p.structure, organogramPath: p.organogramPath, history: p.history,
      oagNote: `The Office of the Auditor General provides independent audit and assurance over the ${a.body}; it is not a fourth governance arm or subordinate to it.`,
    }} />
  );
}
