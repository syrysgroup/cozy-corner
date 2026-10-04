import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import editorial from "@/assets/editorial-meeting.jpg";
import { Button, StatusBadge } from "@/components/ds/primitives";
import { MetricCard, SectionHeading } from "@/components/ds/showcase";
import { Container } from "@/components/ds/shell/layout-parts";
import { useI18n } from "@/lib/i18n";
import { NAV } from "@/lib/site";

export default function Home() {
  const { t, lang } = useI18n();
  return (
    <>
      <section className="border-b border-border bg-surface-sunken">
        <Container className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="overline text-primary">{t.orgSub}</p>
            <h1 className="mt-4 font-display text-display-lg">{t.heroTitle}</h1>
            <p className="mt-5 max-w-[38rem] text-lead text-ink-soft">Independent audit and assurance that helps ECOWAS Institutions use public resources with integrity and impact.</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button asChild><Link to="/publications">Read the latest reports <ArrowRight /></Link></Button>
              <Link to="/transparency" className="text-small font-semibold text-primary underline-offset-4 hover:underline">View accountability data</Link>
            </div>
          </div>
          <img src={editorial} alt="Auditors reviewing findings around a meeting table" className="aspect-[4/3] w-full object-cover" />
        </Container>
      </section>
      <Container as="section" className="py-section">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Audits completed" value="46" change="+8" note="vs. 2024" />
          <MetricCard label="Recommendations issued" value="1,248" change="+112" note="this cycle" />
          <MetricCard label="Implementation rate" value="72%" change="+6 pts" note="year on year" />
          <MetricCard label="Institutions covered" value="14" change="100%" note="of mandate" />
        </div>
      </Container>
      <Container as="section" className="pb-section">
        <SectionHeading index="01" eyebrow="Explore" title="Our work">Seven areas connect you to the Office’s mandate, findings and services.</SectionHeading>
        <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {NAV.map((s, i) => (
            <li key={s.slug} className="bg-card">
              <Link to={`/${s.slug}`} className="group flex h-full flex-col p-6 transition-colors duration-base hover:bg-primary-soft/50">
                <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-3 font-display text-h4">{s.label[lang]}</span>
                <span className="mt-2 text-small text-muted-foreground">{s.lead}</span>
                <ArrowRight className="mt-5 size-4 text-primary transition-transform duration-base group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
          <li className="flex flex-col justify-between gap-4 bg-ecowas-ocean p-6 text-primary-foreground">
            <StatusBadge status="positive" className="self-start bg-background">Live</StatusBadge>
            <p className="font-display text-h4">Recommendation tracker now updated quarterly.</p>
          </li>
        </ul>
      </Container>
    </>
  );
}
