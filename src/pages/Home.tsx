import { AuthorityChairFeature } from "@/components/home/authority-chair";
import { LatestNews, LeadershipFeature } from "@/components/home/sections";
import { CinematicHero } from "@/components/home/hero";
import { MandateGrid } from "@/components/home/mandate";
import { WestAfricaMap } from "@/components/home/map-section";
import { TransparencyDashboard } from "@/components/home/stats";
import { PublicationsShelf } from "@/components/home/shelf";
import { InstitutionsExplainer, IntegrityBand, ClosingBand } from "@/components/home/closing";
import { useReveal } from "@/hooks/use-motion";

export default function Home() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <CinematicHero />
      <AuthorityChairFeature />
      <LeadershipFeature />
      <MandateGrid />
      <InstitutionsExplainer />
      <WestAfricaMap />
      <TransparencyDashboard />
      <LatestNews />
      <PublicationsShelf />
      <IntegrityBand />
      <ClosingBand />
    </div>
  );
}
