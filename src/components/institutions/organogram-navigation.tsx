import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GOVERNANCE_ARMS } from "@/components/ds/institutional";
import { SUPPORTING_INSTITUTIONS } from "@/lib/institution-data";
import { SPECIAL_AGENCIES, agencySlug, agencyShortName } from "@/lib/special-agencies";
import { getApprovedOrganogram } from "@/lib/organogram-data";

const institutions = [
  ...GOVERNANCE_ARMS.map((arm, index) => ({ slug: ["commission", "parliament", "court"][index], name: arm.body })),
  ...SUPPORTING_INSTITUTIONS.map((institution) => ({ slug: institution.slug, name: institution.shortName })),
  ...SPECIAL_AGENCIES.map((agency) => ({ slug: agencySlug(agency), name: agencyShortName(agency) })),
];

export function OrganogramNavigation({ parentPath }: { parentPath: string }) {
  return <nav aria-label="All institution organograms" className="mt-12 border-t border-border pt-8">
    <h2 className="font-display text-h2">Institution organograms</h2>
    <ul className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {institutions.map(({ slug, name }) => {
        const path = `/institutions/${slug}`;
        return <li key={slug}><Link to={`${path}/organogram`} aria-current={parentPath === path ? "page" : undefined} className="flex h-full min-h-20 items-center justify-between gap-3 bg-card p-4 text-small hover:bg-surface-sunken aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary">
          <span><span className="block font-semibold">{name}</span><span className="mt-1 block text-xs text-muted-foreground">{getApprovedOrganogram(slug) ? "Source chart available" : "Official chart not supplied"}</span></span><ArrowRight className="size-4 shrink-0" aria-hidden />
        </Link></li>;
      })}
    </ul>
  </nav>;
}