import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { institutionAssetUrl, type SupportingInstitution } from "@/lib/institution-data";
import { useOfficialAsset } from "@/lib/public-site";

export function SupportingInstitutionPage({ institution }: { institution: SupportingInstitution }) {
  const logo = useOfficialAsset(institution.key, institutionAssetUrl(institution.logoPath));
  const Icon = institution.icon;
  return <>
    <section aria-labelledby="institution-title" className="relative overflow-hidden border-b border-border bg-surface-sunken">
      <span className="absolute inset-x-0 top-0 h-1.5 band" aria-hidden />
      <Container className="grid gap-10 py-section lg:grid-cols-[1fr_20rem] lg:items-center">
        <div>
          <nav aria-label="Breadcrumb" className="text-small text-muted-foreground"><Link to="/institutions" className="inline-flex items-center gap-1 hover:text-primary"><ArrowLeft className="size-4" aria-hidden />ECOWAS Institutions</Link> / {institution.shortName}</nav>
          <p className="overline mt-8 flex items-center gap-2 text-primary"><Icon className="size-4" aria-hidden />{institution.category}</p>
          <h1 id="institution-title" className="mt-3 max-w-4xl font-display text-display-lg">{institution.name}</h1>
          <p className="mt-6 max-w-2xl text-lead text-ink-soft">{institution.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href={institution.site} target="_blank" rel="noreferrer">Official website <ArrowUpRight /><span className="sr-only">(opens in a new tab)</span></a></Button>
            <Button asChild variant="secondary" size="lg"><a href={institution.officialProfile} target="_blank" rel="noreferrer">ECOWAS profile <ArrowUpRight /><span className="sr-only">(opens in a new tab)</span></a></Button>
          </div>
        </div>
        <figure className="mx-auto grid aspect-square w-full max-w-xs place-items-center border border-border bg-card p-10">
          <img src={logo.src} alt={logo.alt ?? institution.logoAlt} width={320} height={320} className="h-full w-full object-contain" />
          <figcaption className="mt-3 text-center text-xs uppercase text-muted-foreground">Official institution logo</figcaption>
        </figure>
      </Container>
    </section>
    <Container as="section" aria-label="Institution facts" className="py-10">
      <dl className="grid gap-px border border-border bg-border md:grid-cols-3">{institution.facts.map(([label, value]) => <div key={label} className="bg-card p-5"><dt className="overline">{label}</dt><dd className="mt-2 font-display text-h4">{value}</dd></div>)}</dl>
    </Container>
    <section aria-labelledby="mandate-title" className="border-y border-border bg-surface-sunken py-section"><Container>
      <p className="overline text-primary">Institutional role</p><h2 id="mandate-title" className="mt-3 font-display text-h1">Mandate and functions</h2>
      <ol className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">{institution.mandate.map((item, index) => <li key={item} className="flex gap-4 bg-card p-6"><span className="font-mono text-xs text-primary">0{index + 1}</span><span className="text-small text-ink-soft">{item}</span></li>)}</ol>
    </Container></section>
    <Container as="section" className="py-section"><div className="flex flex-col gap-4 border-2 border-primary bg-card p-6 md:flex-row md:items-center md:justify-between">
      <p className="flex items-start gap-3 text-small text-ink-soft"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden /><span><strong className="text-ink">Independent assurance.</strong> OAG’s assurance role remains separate from institutional management and ECOWAS governance arms.</span></p>
      <Button asChild variant="secondary" className="shrink-0"><Link to="/institutions">All ECOWAS Institutions</Link></Button>
    </div></Container>
  </>;
}