import { institutionAssetUrl, type SupportingInstitution } from "@/lib/institution-data";
import { useOfficialAsset } from "@/lib/public-site";
import { InstitutionProfilePage } from "./profile-template";

export function SupportingInstitutionPage({ institution: i }: { institution: SupportingInstitution }) {
  const logo = useOfficialAsset(i.key, institutionAssetUrl(i.logoPath));
  return (
    <InstitutionProfilePage p={{
      name: i.name, shortName: i.shortName, eyebrow: i.category, icon: i.icon, logo: { src: logo.src, alt: logo.alt ?? i.logoAlt },
      summary: i.summary, site: i.site, officialProfile: i.officialProfile, facts: i.facts, mandate: i.mandate,
      structure: i.structure, organogramPath: i.organogramPath,
      oagNote: i.slug === "oag" ? "OAG’s assurance role remains separate from institutional management and the ECOWAS governance arms." : undefined,
    }} />
  );
}
