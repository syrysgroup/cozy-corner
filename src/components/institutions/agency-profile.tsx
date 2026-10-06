import { Network } from "lucide-react";
import { agencyShortName, type SpecialAgency } from "@/lib/special-agencies";
import { InstitutionProfilePage } from "./profile-template";
import { useOfficialAsset } from "@/lib/public-site";
import commissionLogo from "@/assets/commission-logo.png.asset.json";

export function AgencyProfilePage({ agency }: { agency: SpecialAgency }) {
  const short = agencyShortName(agency);
  const logo = useOfficialAsset(`agency-${short.toLowerCase()}`, commissionLogo.url);
  return (
    <InstitutionProfilePage p={{
      name: agency.name.replace(/\s*\([^)]+\)\s*$/, ""), shortName: short, eyebrow: "Specialized agency of ECOWAS", icon: Network,
      logo: { src: logo.src, alt: logo.alt ?? "ECOWAS emblem" }, summary: agency.description, officialProfile: agency.link, site: agency.link,
      facts: [["Institution type", "Specialized agency"], ["Coverage", "ECOWAS region"]],
      mandate: [agency.description, "Implement ECOWAS programmes within its specialised field", "Support cooperation among Member States", "Report on activities and results to Community bodies"],
      structure: ["Director General / Head of agency", "Technical departments", "Programmes and projects", "Administration and finance"],
      organogramPath: agency.organogramPath,
    }} />
  );
}
