import { AuthorityChairFeature } from "@/components/home/authority-chair";
import { LeadershipFeature } from "@/components/home/sections";
import { EcowasNews } from "@/components/home/ecowas-news";
import { CinematicHero } from "@/components/home/hero";
import { MandateGrid } from "@/components/home/mandate";
import { TransparencyDashboard } from "@/components/home/stats";
import { PublicationsShelf } from "@/components/home/shelf";
import { InstitutionsExplainer, IntegrityBand, ClosingBand } from "@/components/home/closing";
import { useReveal } from "@/hooks/use-motion";
import { HomeInsights, HomeOpportunities } from "@/components/home/discovery";

export default function Home() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <CinematicHero />
      <AuthorityChairFeature />
      <LeadershipFeature />
      <MandateGrid />
      <InstitutionsExplainer />
      <TransparencyDashboard />
      <EcowasNews />
      <PublicationsShelf />
      <HomeInsights />
      <IntegrityBand />
      <HomeOpportunities />
      <ClosingBand />
    </div>
  );
}
