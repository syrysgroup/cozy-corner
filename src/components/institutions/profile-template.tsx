import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, ShieldCheck, UserRound, Network, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ds/shell/layout-parts";
import { Button } from "@/components/ds/primitives";
import { institutionAssetUrl } from "@/lib/institution-data";
import { cn } from "@/lib/utils";
import { InteractiveOrganogram } from "./interactive-organogram";

/**
 * One profile shape for every ECOWAS institution page (governance arms,
 * supporting institutions and specialized agencies). Optional fields simply
 * hide their section, so new data (e.g. an official organogram) can be added
 * per institution without layout changes.
 */
export type ProfileLeader = { role: string; name: string; country?: string; since?: string; portfolio?: string; link?: string; portraitPath?: string; portraitSrc?: string };
export type InstitutionProfile = {
  name: string;
  shortName?: string;
  eyebrow: string;
  icon: LucideIcon;
  logo: { src: string; alt?: string };
  summary: string;
  site?: string;
  officialProfile?: string;
  building?: { path: string; alt: string; caption: string };
  facts: [string, string][];
  leader?: ProfileLeader & { officeLink?: string };
  leadershipTitle?: string;
  leadershipEyebrow?: string;
  leaderGroups?: { title: string; members: ProfileLeader[] }[];
  mandate: string[];
  structure: string[];
  /** Path in the public institution asset store, e.g. "Organogram/commission.png". */
  organogramPath?: string;
  history?: [string, string][];
  oagNote?: string;
};

function Portrait({ path, src, name, fallback }: { path?: string; src?: string; name: string; fallback?: ReactNode }) {
  const [bad, setBad] = useState(false);
  const url = src ?? (path ? institutionAssetUrl(path) : undefined);
  if (!url || bad) return <div className="grid h-full place-items-center bg-surface-sunken p-6 text-center text-small text-muted-foreground">{fallback ?? <span className="grid justify-items-center gap-3"><UserRound className="size-10" aria-hidden />Official portrait to be published.</span>}</div>;
  return <img src={url} alt={`Official portrait of ${name}`} loading="lazy" decoding="async" className="h-full w-full object-contain" onError={() => setBad(true)} />;
}

const Ext = ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className={cn("inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary hover:underline", className)}>{children}<ArrowUpRight className="size-4 shrink-0" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a>
);

function SectionTitle({ id, eyebrow, title, lead }: { id: string; eyebrow: string; title: string; lead?: string }) {
  return <div className="max-w-3xl"><p className="overline text-primary">{eyebrow}</p><h2 id={id} className="mt-3 font-display text-h1">{title}</h2>{lead && <p className="mt-3 text-small text-muted-foreground">{lead}</p>}</div>;
}

function Hero({ p, organogramPath }: { p: InstitutionProfile; organogramPath: string }) {
  const [photoBad, setPhotoBad] = useState(false);
  const photo = !photoBad ? p.building : undefined;
  const Icon = p.icon;
  return (
    <section aria-labelledby="profile-title" className={cn("relative isolate overflow-hidden", photo ? "institution-photo-header bg-ink" : "bg-surface-sunken")}>
      {photo && <><img src={institutionAssetUrl(photo.path)} alt={photo.alt} loading="eager" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover" onError={() => setPhotoBad(true)} /><div className="institution-photo-overlay absolute inset-0 -z-10" aria-hidden /></>}
      <span className="absolute inset-x-0 top-0 h-1.5 band" aria-hidden />
      <Container className={cn("grid gap-10 py-12 md:py-16", !photo && "lg:grid-cols-[1.4fr_1fr] lg:items-center")}>
        <div>
          <nav aria-label="Breadcrumb" className={cn("text-small", photo ? "text-primary-foreground/90" : "text-muted-foreground")}>
            <Link to="/institutions" className="inline-flex min-h-11 items-center gap-1 hover:underline"><ArrowLeft className="size-4" aria-hidden />ECOWAS Institutions</Link> / {p.shortName ?? p.name}
          </nav>
          <div className="mt-6 flex items-center gap-4">
            {photo && <img src={p.logo.src} alt={p.logo.alt ?? `${p.name} logo`} width={80} height={80} className="size-16 shrink-0 bg-card p-2 object-contain md:size-20" />}
            <p className={cn("overline flex items-center gap-2", photo ? "text-primary-foreground" : "text-primary")}><Icon className="size-4" aria-hidden />{p.eyebrow}</p>
          </div>
          <h1 id="profile-title" className={cn("mt-5 max-w-4xl font-display text-4xl md:text-6xl", photo && "text-primary-foreground")}>{p.name}</h1>
          <p className={cn("mt-5 max-w-2xl text-lead", photo ? "text-primary-foreground/95" : "text-ink-soft")}>{p.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {p.site && <Button asChild size="lg" variant={photo ? "inverse" : "primary"}><a href={p.site} target="_blank" rel="noreferrer">Official website <ArrowUpRight /><span className="sr-only">(opens in a new tab)</span></a></Button>}
            <Button asChild size="lg" variant="secondary" className={cn(photo && "border-primary-foreground/80 text-primary-foreground hover:bg-primary-foreground hover:text-ink")}><Link to={organogramPath}><Network />View organogram</Link></Button>
          </div>
          {photo && <p className="mt-8 text-xs text-primary-foreground/80">{photo.caption}</p>}
        </div>
        {!photo && (
          <figure className="relative mx-auto grid aspect-square w-full max-w-xs place-items-center border border-border bg-card p-10 shadow-raised">
            <span className="absolute inset-4 border border-dashed border-border" aria-hidden />
            <img src={p.logo.src} alt={p.logo.alt ?? `${p.name} logo`} width={320} height={320} className="relative h-full w-full object-contain" />
            <figcaption className="absolute inset-x-0 bottom-3 text-center text-xs uppercase tracking-[0.14em] text-muted-foreground">Official emblem</figcaption>
          </figure>
        )}
      </Container>
    </section>
  );
}

export function InstitutionProfilePage({ p }: { p: InstitutionProfile }) {
  const { pathname } = useLocation();
  if (pathname.endsWith("/organogram")) return <InteractiveOrganogram key={pathname} p={p} parentPath={pathname.replace(/\/organogram$/, "")} />;
  const hasLeaders = !!p.leader || !!p.leaderGroups?.some((g) => g.members.length);
  const nav = [["overview", "Overview"], hasLeaders && ["leadership", "Leadership"], ["mandate", "Mandate"], ["organogram", "Organogram"], p.history?.length && ["milestones", "Milestones"]].filter(Boolean) as [string, string][];
  return (
    <>
      <Hero p={p} organogramPath={`${pathname}/organogram`} />
      <nav aria-label="On this page" className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <Container><ul className="-mx-2 flex gap-1 overflow-x-auto py-2">{nav.map(([id, t]) => <li key={id}><a href={`#${id}`} className="inline-flex min-h-11 items-center whitespace-nowrap px-3 text-small font-semibold text-ink-soft hover:text-primary">{t}</a></li>)}</ul></Container>
      </nav>

      <Container as="section" aria-label="Key facts" className="scroll-mt-20 py-10"><div id="overview" />
        <dl className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr">
          {p.facts.map(([k, v]) => <div key={k} className="bg-card p-5"><dt className="overline">{k}</dt><dd className="mt-2 font-display text-h4">{v}</dd></div>)}
        </dl>
      </Container>

      {hasLeaders && (
        <section id="leadership" aria-labelledby="leadership-title" className="scroll-mt-20 py-section"><Container>
          <SectionTitle id="leadership-title" eyebrow={p.leadershipEyebrow ?? "Leadership"} title={p.leadershipTitle ?? "Current leadership"} />
          {p.leader && (
            <article className="mt-8 grid overflow-hidden border border-border bg-card md:grid-cols-[14.75rem_1fr]">
              <figure className="h-56 w-[14.75rem] max-w-full overflow-hidden bg-surface-sunken"><Portrait path={p.leader.portraitPath} src={p.leader.portraitSrc} name={`${p.leader.name}, ${p.leader.role}`} fallback={<img src={p.logo.src} alt="" className="max-h-40 w-auto object-contain" />} /></figure>
              <div className="p-6 md:p-8">
                <p className="overline flex items-center gap-2 text-primary"><UserRound className="size-4" aria-hidden />{p.leader.role}</p>
                <h3 className="mt-3 font-display text-h2">{p.leader.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small text-ink-soft">
                  {p.leader.country && <li className="flex items-center gap-2"><MapPin className="size-4" aria-hidden />{p.leader.country}</li>}
                  {p.leader.since && <li className="flex items-center gap-2"><CalendarDays className="size-4" aria-hidden />In office since {p.leader.since}</li>}
                </ul>
                {p.leader.officeLink && <Ext href={p.leader.officeLink} className="mt-6">Office of the leader</Ext>}
                <p className="mt-6 border-l-2 border-ecowas-yellow pl-4 text-xs text-muted-foreground">Based on the institution’s latest public information.</p>
              </div>
            </article>
          )}
          {p.leaderGroups?.filter((g) => g.members.length).map((g) => (
            <div key={g.title} className="mt-12">
              <h3 className="font-display text-h3">{g.title}</h3>
              <ul className="mt-6 grid grid-flow-col auto-cols-[14.75rem] gap-px overflow-x-auto md:grid-flow-row md:grid-cols-[repeat(auto-fit,14.75rem)] md:overflow-visible">
                {g.members.map((m) => (
                  <li key={m.name} className="flex min-w-0 flex-col bg-card">
                    <figure className="h-56 overflow-hidden bg-surface-sunken"><Portrait path={m.portraitPath} src={m.portraitSrc} name={`${m.name}, ${m.role}`} /></figure>
                    <div className="flex flex-1 flex-col p-4">
                      {m.country && <p className="text-xs font-semibold uppercase text-primary">{m.country}</p>}
                      <h4 className="mt-2 font-display text-base font-bold leading-snug text-ink">{m.name}</h4>
                      <p className="mt-2 text-xs font-semibold leading-relaxed text-ink-soft">{m.role}</p>{m.portfolio && m.portfolio !== m.role && <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{m.portfolio}</p>}
                      {m.link && <Ext href={m.link} className="mt-2 text-xs">{m.role === "Commissioner" ? "Department" : "Official profile"}</Ext>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container></section>
      )}

      <section id="mandate" aria-labelledby="mandate-title" className="scroll-mt-20 border-y border-border bg-surface-sunken py-section"><Container>
        <SectionTitle id="mandate-title" eyebrow="Institutional role" title="Mandate and functions" />
        <ol className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">{p.mandate.map((m, i) => <li key={m} className="flex gap-4 bg-card p-6"><span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span><span className="text-small text-ink-soft">{m}</span></li>)}</ol>
      </Container></section>

      <section id="organogram" aria-labelledby="organogram-title" className="scroll-mt-20 py-section"><Container>
        <SectionTitle id="organogram-title" eyebrow="Structure" title="Organogram" lead={`How the ${p.shortName ?? p.name} is organised.`} />
        
        <Button asChild size="lg" className="mt-6 h-auto min-h-13 max-w-full whitespace-normal"><Link to={`${pathname}/organogram`}><Network />View organogram<ArrowUpRight /></Link></Button>
      </Container></section>

      {p.history?.length ? (
        <section id="milestones" aria-labelledby="milestones-title" className="scroll-mt-20 border-t border-border bg-surface-sunken py-section"><Container>
          <SectionTitle id="milestones-title" eyebrow="History" title="Key milestones" />
          <ol className="mt-8 grid gap-6 md:grid-cols-3">{p.history.map(([y, t]) => <li key={y} className="border-t-4 border-ecowas-yellow pt-4"><p className="font-display text-h2 text-primary">{y}</p><p className="mt-2 text-small text-ink-soft">{t}</p></li>)}</ol>
        </Container></section>
      ) : null}

      <Container as="section" className="py-section">
        <div className="flex flex-col gap-4 border-2 border-primary bg-card p-6 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-3 text-small text-ink-soft"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden /><span><strong className="text-ink">Independent assurance.</strong> {p.oagNote ?? `The Office of the Auditor General provides independent audit and assurance across ECOWAS institutions, including the ${p.shortName ?? p.name}. Published audit information will appear once approved for release.`}</span></p>
          <div className="flex shrink-0 flex-wrap gap-3">
            {p.officialProfile && <Button asChild variant="ghost"><a href={p.officialProfile} target="_blank" rel="noreferrer">ECOWAS profile <ArrowUpRight /></a></Button>}
            <Button asChild variant="secondary"><Link to="/institutions">All ECOWAS Institutions</Link></Button>
          </div>
        </div>
      </Container>
    </>
  );
}
