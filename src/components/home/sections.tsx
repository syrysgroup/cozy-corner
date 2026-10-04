import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileSearch, Search, ClipboardCheck, RefreshCcw, BadgeCheck, Megaphone, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { SectionHeading } from "@/components/ds/showcase";
import { Container } from "@/components/ds/shell/layout-parts";
import { GOVERNANCE_ARMS, OAG_POSITIONING } from "@/components/ds/institutional";
import { useOfficialAsset } from "@/lib/public-site";
import { fetchLatestNews, type NewsItem } from "@/lib/news-data";
import oagLogo from "@/assets/auditor-general-logo.png.asset.json";
import commissionLogo from "@/assets/commission-logo.png.asset.json";

const ARM_KEYS = ["commission", "parliament", "court"];
const ARM_SLUGS = ["commission", "parliament", "court"];

export function HomeIntro() {
  return (
    <Container as="section" aria-labelledby="home-intro" className="py-section">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div><p className="overline text-primary">01 · The Office</p><h2 id="home-intro" className="mt-3 font-display text-h2">Who we are</h2></div>
        <p className="text-lead text-ink-soft">The Office of the Auditor General is an independent assurance office supporting accountability, good corporate governance and value for money across ECOWAS Institutions.</p>
      </div>
    </Container>
  );
}

const FUNCTIONS = [
  { icon: FileSearch, t: "Audit", d: "Financial, compliance and performance audits." },
  { icon: Search, t: "Investigate", d: "Matters within the Office’s mandate." },
  { icon: ClipboardCheck, t: "Recommend", d: "Practical actions to strengthen institutions." },
  { icon: RefreshCcw, t: "Follow up", d: "Track how recommendations are implemented." },
  { icon: BadgeCheck, t: "Verify", d: "Confirm that corrective action is effective." },
  { icon: Megaphone, t: "Inform", d: "Publish approved findings and reports." },
];

export function WhatOAGDoes() {
  return (
    <section aria-labelledby="home-functions" className="border-y border-border bg-surface-sunken py-section">
      <Container>
        <p className="overline text-primary">02 · What OAG does</p>
        <h2 id="home-functions" className="mt-3 font-display text-h2">Six core functions</h2>
        <ul className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FUNCTIONS.map(({ icon: Icon, t, d }) => (
            <li key={t} className="flex gap-4 bg-card p-6"><Icon className="mt-1 size-5 shrink-0 text-primary" aria-hidden /><span><span className="block font-display text-h4">{t}</span><span className="mt-1 block text-small text-muted-foreground">{d}</span></span></li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function LeadershipFeature() {
  const emblem = useOfficialAsset("auditor-general", oagLogo.url);
  const [broken, setBroken] = useState(false);
  return (
    <Container as="section" aria-labelledby="home-leadership" className="py-section-lg">
      <p className="overline text-primary">03 · Leadership</p>
      <h2 id="home-leadership" className="mt-3 max-w-3xl font-display text-h1">Leadership of the Office of the Auditor General</h2>
      <p className="mt-4 max-w-2xl text-lead text-muted-foreground">The Auditor General leads the Office’s independent audit and assurance work across ECOWAS Institutions.</p>
      <article aria-labelledby="ag-title" className="mt-10 grid overflow-hidden border border-border bg-card shadow-raised md:grid-cols-[minmax(16rem,0.9fr)_1.1fr]">
        <div className="relative grid min-h-[20rem] place-items-center bg-ecowas-ocean p-10">
          {broken ? <ShieldCheck className="size-24 text-primary-foreground/70" aria-hidden /> : <img src={emblem.src} alt={emblem.alt ?? "Office of the Auditor General emblem"} width={200} height={200} loading="lazy" onError={() => setBroken(true)} className="max-h-52 w-auto object-contain" />}
          <p className="absolute bottom-4 left-4 right-4 text-xs text-primary-foreground/80">Official portrait to be published once approved.</p>
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="overline flex items-center gap-2 text-primary"><span className="h-px w-8 bg-ecowas-yellow" aria-hidden />Head of Office</p>
          <h3 id="ag-title" className="mt-3 font-display text-h1">Auditor General</h3>
          <p className="mt-2 text-small font-semibold text-ink-soft">Office of the Auditor General of ECOWAS Institutions</p>
          <p className="mt-6 flex items-start gap-2 border-l-2 border-ecowas-yellow pl-4 text-small text-muted-foreground"><UserRound className="mt-0.5 size-4 shrink-0" aria-hidden />The official name, photograph and biography will appear here once approved for publication.</p>
          <div className="mt-8"><Button asChild size="lg"><Link to="/about/leadership">Meet the OAG leadership <ArrowRight /></Link></Button></div>
        </div>
      </article>
    </Container>
  );
}

function ArmLogo({ k, fallback, body }: { k: string; fallback: string; body: string }) {
  const logo = useOfficialAsset(k, fallback);
  return <img src={logo.src} alt={logo.alt ?? `${body} logo`} width={64} height={64} loading="lazy" className="size-16 object-contain" />;
}

export function InstitutionsTeaser() {
  return (
    <section aria-labelledby="home-institutions" className="border-y border-border bg-surface-sunken py-section">
      <Container>
        <SectionHeading index="04" eyebrow="ECOWAS Institutions" title="Three arms of governance.">ECOWAS governance is exercised by the Executive, the Legislature and the Judiciary.</SectionHeading>
        <ul className="grid gap-4 md:grid-cols-3">
          {GOVERNANCE_ARMS.map(({ arm, body, icon: Icon, logo }, i) => (
            <li key={arm}>
              <Link to={`/institutions/${ARM_SLUGS[i]}`} className="group flex h-full items-center gap-4 border border-border border-t-2 border-t-ink bg-card p-5 hover:shadow-raised">
                <ArmLogo k={ARM_KEYS[i]} fallback={i === 0 ? commissionLogo.url : logo} body={body} />
                <span><span className="flex items-center gap-1.5 text-ink-soft"><Icon className="size-3.5" aria-hidden /><span className="overline">{arm}</span></span><span className="mt-1 block font-display text-h4 group-hover:text-primary">{body}</span></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-4 border-2 border-primary bg-card p-5 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-3 text-small text-ink-soft"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden /><span><strong className="text-ink">OAG — Independent assurance, not a fourth arm.</strong> {OAG_POSITIONING}</span></p>
          <Button asChild variant="secondary" className="shrink-0"><Link to="/institutions">Explore ECOWAS Institutions <ArrowRight /></Link></Button>
        </div>
      </Container>
    </section>
  );
}

const AUDIT_TYPES = ["Financial audit", "Compliance audit", "Performance audit", "Investigation", "Special audit"];
export function AuditAssurance() {
  return (
    <Container as="section" aria-labelledby="home-audit" className="py-section">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="overline text-primary">05 · Audit &amp; Assurance</p>
          <h2 id="home-audit" className="mt-3 font-display text-h2">Assurance across the Community’s resources.</h2>
          <div className="mt-6"><Button asChild variant="secondary"><Link to="/audit">Explore Audit &amp; Assurance <ArrowRight /></Link></Button></div>
        </div>
        <ul className="grid gap-px border border-border bg-border sm:grid-cols-2">
          {AUDIT_TYPES.map((t, i) => <li key={t} className="flex items-center gap-3 bg-card px-5 py-4 font-display text-h4"><span className="font-mono text-xs text-primary">0{i + 1}</span>{t}</li>)}
        </ul>
      </div>
    </Container>
  );
}

export function LatestNews() {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  useEffect(() => { let on = true; fetchLatestNews(3).then((n) => on && setItems(n)); return () => { on = false; }; }, []);
  const [feature, ...rest] = items ?? [];
  return (
    <section aria-labelledby="home-news" className="border-y border-border bg-surface-sunken py-section">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading index="07" eyebrow="Latest news" title="From the Office." className="mb-0 flex-1 border-0 pb-0" />
          <Button asChild variant="secondary" size="sm"><Link to="/knowledge/news">View all news <ArrowRight /></Link></Button>
        </div>
        <div className="mt-8" aria-live="polite">
          {items === null ? <p className="text-small text-muted-foreground">Loading news…</p>
            : !feature ? <p className="border border-dashed border-border bg-card p-6 text-small text-muted-foreground">No news has been published yet. Approved announcements and events will appear here.</p>
            : (
              <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                <Link to={feature.href} className="group block">
                  {feature.image && <img src={feature.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />}
                  <p className="overline mt-5 text-primary">{feature.category} · <time>{feature.date}</time></p>
                  <h3 className="mt-2 font-display text-h2 group-hover:text-primary">{feature.title}</h3>
                  <p className="mt-3 text-small text-muted-foreground">{feature.summary}</p>
                </Link>
                <ul className="grid content-start gap-6">{rest.map((n) => <li key={n.id}><Link to={n.href} className="group block"><p className="text-xs text-muted-foreground">{n.category} · <time>{n.date}</time></p><h3 className="mt-1 font-display text-h4 group-hover:text-primary">{n.title}</h3></Link></li>)}</ul>
              </div>
            )}
        </div>
      </Container>
    </section>
  );
}

export function KnowledgeGateway() {
  const items = [["OAG Knowledge", "Guidance and lessons from published audit work."], ["Research", "Studies on public-sector audit and governance."], ["Approved institutional knowledge", "Only material cleared for public release."]];
  return (
    <Container as="section" aria-labelledby="home-knowledge" className="py-section">
      <SectionHeading index="09" eyebrow="Knowledge" title="Learning from the evidence." />
      <ul className="grid gap-px border border-border bg-border md:grid-cols-3">
        {items.map(([t, d]) => <li key={t} className="bg-card p-6"><BookOpen className="size-5 text-primary" aria-hidden /><h3 className="mt-4 font-display text-h4">{t}</h3><p className="mt-1 text-small text-muted-foreground">{d}</p></li>)}
      </ul>
      <div className="mt-6"><Button asChild variant="secondary"><Link to="/knowledge">Explore Knowledge <ArrowRight /></Link></Button></div>
    </Container>
  );
}

const INTERESTS = ["Audits", "Publications", "Institutional news", "Events", "Accountability insights"];
export function Newsletter() {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "unavailable">("idle");
  const field = "mt-1 block min-h-11 w-full border border-input bg-background px-3 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <Container as="section" aria-labelledby="home-newsletter" className="py-section">
      <div className="grid gap-10 border border-border bg-card p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="overline text-primary">11 · Newsletter</p>
          <h2 id="home-newsletter" className="mt-3 font-display text-h2">Stay informed</h2>
          <p className="mt-4 text-small text-muted-foreground">Subscribe for updates on OAG audits, publications, institutional developments, events and accountability insights.</p>
        </div>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setStatus("unavailable"); }}>
          <label className="text-small font-semibold sm:col-span-2" htmlFor={`${id}-email`}>Email address <span aria-hidden>*</span><input id={`${id}-email`} type="email" required autoComplete="email" className={field} /></label>
          <label className="text-small font-semibold" htmlFor={`${id}-fn`}>First name (optional)<input id={`${id}-fn`} autoComplete="given-name" className={field} /></label>
          <label className="text-small font-semibold" htmlFor={`${id}-ln`}>Last name (optional)<input id={`${id}-ln`} autoComplete="family-name" className={field} /></label>
          <label className="text-small font-semibold" htmlFor={`${id}-lang`}>Preferred language<select id={`${id}-lang`} className={field}><option>English</option><option>Français</option><option>Português</option></select></label>
          <fieldset className="sm:col-span-2"><legend className="text-small font-semibold">Areas of interest (optional)</legend>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">{INTERESTS.map((x) => <label key={x} className="inline-flex min-h-11 items-center gap-2 text-small"><input type="checkbox" className="size-4 accent-primary" />{x}</label>)}</div>
          </fieldset>
          <div className="sm:col-span-2"><Button type="submit">Subscribe</Button></div>
          <p role="status" className="text-small text-muted-foreground sm:col-span-2">{status === "unavailable" && "Subscriptions are not yet open — the mailing service is still being connected, so your details were not saved. Please try again later."}</p>
        </form>
      </div>
    </Container>
  );
}
