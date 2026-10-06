import { Landmark } from "lucide-react";
import { useAuthorityChairs, formatChairDate } from "@/lib/authority-data";
import { useOfficialAsset } from "@/lib/public-site";
import ecowasLogo from "@/assets/ecowas-logo.png.asset.json";
import { InstitutionProfilePage } from "./profile-template";

export function AuthorityProfilePage() {
  const { current, archive, loading } = useAuthorityChairs();
  const logo = useOfficialAsset("ecowas", ecowasLogo.url);
  return <>
    {loading && <p role="status" className="px-6 py-3 text-small text-muted-foreground">Loading published Authority leadership…</p>}
    <InstitutionProfilePage p={{
      name: "Authority of Heads of State and Government", shortName: "The Authority", eyebrow: "Supreme institution of ECOWAS", icon: Landmark,
      logo: { src: logo.src, alt: logo.alt ?? "ECOWAS emblem" },
      summary: "The Authority of Heads of State and Government is the highest decision-making body of ECOWAS. It brings together the Heads of State and Government of Member States and provides overall direction for the Community.",
      site: "https://www.ecowas.int/", officialProfile: "https://www.ecowas.int/institutions/authority-of-heads-of-state-and-government/",
      facts: [["Institutional position", "Supreme institution"], ["Composition", "Heads of State and Government"], ["Chairmanship", "Rotating, defined term"], ["Legal basis", "Revised ECOWAS Treaty, Article 7"]],
      leader: current ? { role: current.officialTitle, name: `${current.honorific} ${current.fullName}`, country: current.countryName, since: formatChairDate(current.startDate), portraitSrc: current.portrait?.src, officeLink: current.officialSource } : undefined,
      leadershipTitle: "Chairmanship of the Authority",
      leaderGroups: archive.length ? [{ title: "Previous chairmanships", members: archive.map((chair) => ({ name: `${chair.honorific} ${chair.fullName}`, role: chair.officialTitle, country: chair.countryName, portraitSrc: chair.portrait?.src, portfolio: [formatChairDate(chair.startDate), formatChairDate(chair.endDate)].filter(Boolean).join(" – "), link: chair.officialSource })) }] : undefined,
      mandate: ["Provide general direction and control of the Community", "Determine the general policies and major guidelines of the Community", "Oversee the functioning of Community institutions and progress towards Community objectives"],
      structure: ["Heads of State and Government of Member States", "Rotating Chairmanship of the Authority"],
      oagNote: "OAG’s independent assurance role is distinct from the Authority’s Community-wide decision-making responsibilities. The Authority is not a fourth governance arm.",
    }} />
  </>;
}