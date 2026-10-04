import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Download, EyeOff, Lock, UserCheck, Search, MapPin, Calendar } from "lucide-react";
import hero from "@/assets/hero-auditors.jpg";
import conference from "@/assets/news-conference.jpg";
import meeting from "@/assets/editorial-meeting.jpg";
import building from "@/assets/editorial-building.jpg";
import { Button, StatusBadge, Badge } from "@/components/ds/primitives";
import { SectionHeading } from "@/components/ds/showcase";
import { Container } from "@/components/ds/shell/layout-parts";
import { useCountUp, useReveal, usePrefersReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";
import {
  PLACEHOLDER_NOTICE, intelligenceMetrics, countries, publications, insights, opportunities, type Country, type OppKind,
} from "@/lib/home-data";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const { ref, value: v } = useCountUp(value);
  return <span ref={ref as React.RefObject<HTMLSpanElement>} className="num">{Math.round(v).toLocaleString("en")}{suffix}</span>;
}

function useParallax(strength = 0.15) {
  const ref = useRef<HTMLImageElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * strength}px) scale(1.08)`; }); };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [reduced, strength]);
  return ref;
}

const Note = () => <p className="mt-6 text-xs text-muted-foreground">{PLACEHOLDER_NOTICE}</p>;
const stagger = (i: number) => ({ transitionDelay: `${i * 80}ms` });

/* ---------------- Hero ---------------- */
function Hero() {
  const img = useParallax();
  return (
    <section className="relative isolate overflow-hidden bg-ecowas-ocean text-primary-foreground">
      <img ref={img} src={hero} alt="Auditors reviewing printed reports together" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center] opacity-70 will-change-transform" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ecowas-ocean via-ecowas-ocean/85 to-ecowas-ocean/10 max-lg:via-ecowas-ocean/80 max-lg:to-ecowas-ocean/50" aria-hidden />
      <Container className="flex min-h-[86vh] flex-col justify-end pb-12 pt-28 md:pb-20">
        <div className="max-w-3xl animate-rise-in motion-reduce:animate-none">
          <p className="flex items-center gap-3 text-overline uppercase text-primary-foreground/80"><span className="h-px w-10 bg-ecowas-yellow" aria-hidden />Office of the Auditor General · ECOWAS</p>
          <h1 className="mt-6 font-display text-display-lg md:text-display-xl">Strengthening accountability across ECOWAS institutions.</h1>
          <p className="mt-6 max-w-[38rem] text-lead text-primary-foreground/85">The Office provides independent audit and assurance on how Community resources are used — turning evidence into recommendations, and recommendations into public trust.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="inverse" size="lg"><a href="#intelligence">Explore Audit Intelligence <ArrowRight /></a></Button>
            <Button asChild size="lg" className="border border-primary-foreground/50 bg-transparent hover:bg-primary-foreground/10"><Link to="/publications">View Publications</Link></Button>
          </div>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-px border-t border-primary-foreground/20 pt-6 text-small text-primary-foreground/80 sm:grid-cols-3 lg:grid-cols-6">
          {["Audit", "Assurance", "Transparency", "Integrity", "Intelligence", "Public service"].map((w, i) => (
            <li key={w} className="flex items-center gap-2 py-1"><span className="font-mono text-xs text-ecowas-yellow">0{i + 1}</span>{w}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- Intelligence + Map ---------------- */
function Intelligence() {
  const [active, setActive] = useState(0);
  return (
    <Container as="section" className="py-section">
      <div id="intelligence" className="scroll-mt-24" />
      <SectionHeading index="01" eyebrow="Audit intelligence" title="The work, in numbers.">A live picture of audit activity, designed to connect to authorised data sources.</SectionHeading>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {intelligenceMetrics.map((m, i) => (
          <button key={m.key} onClick={() => setActive(i)} aria-pressed={active === i} style={stagger(i)}
            className={cn("reveal group bg-card p-6 text-left transition-colors duration-base md:p-8", active === i ? "bg-primary-soft/60" : "hover:bg-surface-sunken")}>
            <span className={cn("block h-0.5 w-8 transition-all duration-base", active === i ? "w-16 bg-primary" : "bg-border")} aria-hidden />
            <p className="mt-6 text-small font-semibold text-muted-foreground">{m.label}</p>
            <p className="mt-2 font-display text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-none text-ink"><Counter value={m.value} suffix={m.suffix} /></p>
            <p className="mt-3 text-small text-muted-foreground">{m.note}</p>
          </button>
        ))}
      </div>
      <Note />
    </Container>
  );
}

function AuditMap() {
  const [sel, setSel] = useState<Country>(countries.find((c) => c.code === "NG")!);
  const total = (c: Country) => c.recs.implemented + c.recs.inProgress + c.recs.notStarted;
  const pct = (n: number) => `${Math.round((n / total(sel)) * 100)}%`;
  return (
    <section className="border-y border-border bg-surface-sunken py-section">
      <Container>
        <SectionHeading index="02" eyebrow="Regional view" title="Audit activity across the region.">Select a Member State to see institutions, activity and recommendation status. Only published, non-confidential summaries are shown.</SectionHeading>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="reveal relative border border-border bg-card p-4 md:p-8">
            <svg viewBox="0 0 100 80" className="h-auto w-full" role="group" aria-label="Schematic map of ECOWAS Member States">
              <defs><pattern id="dots" width="2.5" height="2.5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.35" className="fill-border" /></pattern></defs>
              <path d="M8 22 Q20 14 40 16 L62 18 Q80 22 84 40 Q82 56 72 64 L58 68 Q40 72 26 72 Q14 66 10 54 Q4 40 8 22Z" fill="url(#dots)" className="stroke-border" strokeWidth="0.3" />
              {countries.map((c) => {
                const on = sel.code === c.code; const r = 2 + c.audits * 0.45;
                return (
                  <g key={c.code} tabIndex={0} role="button" aria-label={`${c.name}: ${c.audits} audits`} aria-pressed={on}
                    onMouseEnter={() => setSel(c)} onFocus={() => setSel(c)} onClick={() => setSel(c)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(c)} className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-ring">
                    {on && <circle cx={c.x} cy={c.y} r={r + 2.5} className="fill-primary/15 motion-safe:animate-pulse" />}
                    <circle cx={c.x} cy={c.y} r={r} strokeWidth="0.5" className={cn("transition-all duration-base", on ? "fill-primary stroke-primary" : "fill-card stroke-primary/60 hover:fill-primary-soft")} />
                    <text x={c.x} y={c.y + r + 3} textAnchor="middle" className={cn("select-none font-sans text-[2.2px] font-semibold", on ? "fill-ink" : "fill-muted-foreground")}>{c.code}</text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-2 text-xs text-muted-foreground">Schematic, not to scale. Circle size reflects number of audits.</p>
          </div>
          <aside aria-live="polite" className="reveal flex flex-col border border-border bg-card p-6 shadow-raised md:p-8" style={stagger(1)}>
            <p className="overline flex items-center gap-2 text-primary"><MapPin className="size-3.5" aria-hidden />Member State</p>
            <h3 key={sel.code} className="mt-3 animate-fade-in font-display text-h2 motion-reduce:animate-none">{sel.name}</h3>
            <dl className="mt-6 grid grid-cols-2 gap-6 border-y border-border py-5">
              <div><dt className="text-small text-muted-foreground">Audits</dt><dd className="num font-display text-3xl font-bold">{sel.audits}</dd></div>
              <div><dt className="text-small text-muted-foreground">Published findings</dt><dd className="num font-display text-3xl font-bold">{sel.findings}</dd></div>
            </dl>
            <p className="mt-5 text-small font-semibold">Institutions</p>
            <ul className="mt-2 flex flex-wrap gap-2">{sel.institutions.map((i) => <li key={i}><Badge tone="outline">{i}</Badge></li>)}</ul>
            <p className="mt-6 text-small font-semibold">Recommendation status</p>
            <div className="mt-3 flex h-2.5 overflow-hidden bg-muted" role="img" aria-label={`Implemented ${pct(sel.recs.implemented)}, in progress ${pct(sel.recs.inProgress)}, not started ${pct(sel.recs.notStarted)}`}>
              <span className="bg-status-positive transition-all duration-slow" style={{ width: pct(sel.recs.implemented) }} />
              <span className="bg-ecowas-yellow transition-all duration-slow" style={{ width: pct(sel.recs.inProgress) }} />
              <span className="bg-status-neutral/50 transition-all duration-slow" style={{ width: pct(sel.recs.notStarted) }} />
            </div>
            <ul className="mt-3 grid gap-1.5 text-small">
              <li className="flex justify-between"><StatusBadge status="positive" /><span className="num">{sel.recs.implemented}</span></li>
              <li className="flex justify-between"><StatusBadge status="attention">In progress</StatusBadge><span className="num">{sel.recs.inProgress}</span></li>
              <li className="flex justify-between"><StatusBadge status="neutral" /><span className="num">{sel.recs.notStarted}</span></li>
            </ul>
            <Note />
          </aside>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Transparency ---------------- */
function Transparency() {
  const items = [
    { k: "Audit reports", v: 126, img: building, to: "/publications/reports", d: "Final reports published after due process." },
    { k: "Recommendations", v: 940, img: meeting, to: "/audit/recommendations", d: "Tracked from issue to implementation." },
    { k: "Publications", v: 58, img: conference, to: "/publications", d: "Annual reports, guidance and studies." },
    { k: "Institutional coverage", v: 100, s: "%", img: hero, to: "/transparency/institutions", d: "Institutions within the audit mandate." },
  ];
  return (
    <Container as="section" className="py-section">
      <SectionHeading index="03" eyebrow="Transparency" title="From institutional information to public knowledge.">Each audit follows a path: evidence gathered, findings agreed, reports published, actions followed up.</SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Link key={it.k} to={it.to} style={stagger(i)} className="reveal group relative flex aspect-[3/4] flex-col justify-end overflow-hidden bg-ecowas-ocean p-6 text-primary-foreground max-sm:aspect-[4/3]">
            <img src={it.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-slow group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ecowas-ocean via-ecowas-ocean/60 to-transparent" aria-hidden />
            <div className="relative">
              <span className="font-mono text-xs text-ecowas-yellow">0{i + 1}</span>
              <p className="mt-2 font-display text-5xl font-bold"><Counter value={it.v} suffix={it.s} /></p>
              <h3 className="mt-2 font-display text-h4">{it.k}</h3>
              <p className="mt-1 text-small text-primary-foreground/75">{it.d}</p>
              <ArrowUpRight className="mt-4 size-5 transition-transform duration-base group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
            </div>
          </Link>
        ))}
      </div>
      <Note />
    </Container>
  );
}

/* ---------------- Publications ---------------- */
const coverTone = { ocean: "bg-ecowas-ocean", green: "bg-ecowas-green", brown: "bg-ecowas-brown", slate: "bg-ecowas-slate" };
function Publications() {
  return (
    <section className="border-y border-border bg-surface-sunken py-section">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading index="04" eyebrow="Featured publications" title="Reports that shape the record." className="mb-0 flex-1 border-0 pb-0" />
          <Button asChild variant="secondary" size="sm"><Link to="/publications">All publications <ArrowRight /></Link></Button>
        </div>
      </Container>
      <div className="mt-10 overflow-x-auto pb-4 [scrollbar-width:thin]">
        <ul className="mx-auto flex w-max snap-x snap-mandatory gap-6 px-5 md:px-8 xl:px-[max(3rem,calc((100vw-82rem)/2+3rem))]">
          {publications.map((p, i) => (
            <li key={p.title} className="reveal w-[15rem] shrink-0 snap-start md:w-[17rem]" style={stagger(i)}>
              <article className="group">
                <div className={cn("relative flex aspect-[3/4] flex-col justify-between p-5 text-primary-foreground shadow-raised transition-transform duration-base group-hover:-translate-y-1.5", coverTone[p.tone])}>
                  <span className="absolute inset-y-0 left-0 w-2 bg-ink/20" aria-hidden />
                  <div className="flex justify-between text-xs uppercase tracking-[0.12em] text-primary-foreground/80"><span>OAG</span><span>{p.year}</span></div>
                  <div>
                    <span className="block h-1 w-10 bg-ecowas-yellow" aria-hidden />
                    <h3 className="mt-4 font-display text-h3 leading-tight">{p.title}</h3>
                  </div>
                  <p className="text-xs text-primary-foreground/75">{p.institution}</p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground"><Badge tone="brown">{p.type}</Badge><span>{p.language}</span></div>
                <div className="mt-3 flex gap-4 text-small font-semibold text-primary">
                  <Link to="/publications/reports" className="inline-flex items-center gap-1 hover:underline">View</Link>
                  <button type="button" className="inline-flex items-center gap-1 hover:underline" aria-label={`Download ${p.title}`}><Download className="size-4" aria-hidden />PDF</button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Insights ---------------- */
function Insights() {
  return (
    <Container as="section" className="py-section">
      <SectionHeading index="05" eyebrow="Latest audit insights" title="What the evidence tells us.">Published summaries only. Confidential working papers are never shown.</SectionHeading>
      <div className="grid gap-px border border-border bg-border md:grid-cols-3">
        {insights.map((x, i) => (
          <article key={x.topic} className="reveal group flex flex-col bg-card p-6 md:p-8" style={stagger(i)}>
            <div className="flex flex-wrap items-center gap-2"><Badge>{x.type}</Badge><span className="text-xs text-muted-foreground">{x.date}</span></div>
            <h3 className="mt-6 font-display text-h3">{x.topic}</h3>
            <p className="mt-1 text-small font-semibold text-primary">{x.institution}</p>
            <p className="mt-3 flex-1 text-small text-muted-foreground">{x.summary}</p>
            <Link to="/knowledge/insights" className="mt-6 inline-flex items-center gap-2 text-small font-semibold text-ink group-hover:text-primary">Read insight <ArrowRight className="size-4 transition-transform duration-base group-hover:translate-x-1" aria-hidden /></Link>
          </article>
        ))}
      </div>
    </Container>
  );
}

/* ---------------- IntegrityLine ---------------- */
function IntegrityLine() {
  const opts = [
    { icon: EyeOff, t: "Report anonymously", d: "No name, no contact details required." },
    { icon: Lock, t: "Report confidentially", d: "Your identity is known only to authorised staff." },
    { icon: UserCheck, t: "Identify myself", d: "Share your details so we can follow up with you." },
    { icon: Search, t: "Track existing report", d: "Use your case reference to check progress." },
  ];
  return (
    <section className="relative overflow-hidden bg-ecowas-green py-section-lg text-primary-foreground">
      <span className="absolute -right-32 -top-32 size-[28rem] rounded-full border border-primary-foreground/10" aria-hidden />
      <span className="absolute -right-12 -top-12 size-[18rem] rounded-full border border-primary-foreground/10" aria-hidden />
      <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="reveal">
          <p className="text-overline uppercase text-primary-foreground/75">06 · IntegrityLine</p>
          <h2 className="mt-4 font-display text-display-lg">See something.<br />Say something.</h2>
          <p className="mt-6 max-w-md text-lead text-primary-foreground/85">IntegrityLine provides protected channels for reporting matters within the Office’s mandate — fraud, waste, abuse or misconduct involving Community resources.</p>
          <Link to="/integrityline/protection" className="mt-6 inline-flex items-center gap-2 text-small font-semibold underline-offset-4 hover:underline">How reporters are protected <ArrowRight className="size-4" /></Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {opts.map((o, i) => (
            <li key={o.t} className="reveal" style={stagger(i)}>
              <Link to="/integrityline/report" className="group flex h-full flex-col gap-6 border border-primary-foreground/20 bg-primary-foreground/5 p-6 transition-colors duration-base hover:bg-primary-foreground hover:text-ecowas-green">
                <o.icon className="size-6" aria-hidden />
                <span><span className="block font-display text-h4">{o.t}</span><span className="mt-1 block text-small opacity-80">{o.d}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- Opportunities ---------------- */
function Opportunities() {
  const kinds: ("All" | OppKind)[] = ["All", "Careers", "Procurement", "Consultancies", "Tenders"];
  const [k, setK] = useState<(typeof kinds)[number]>("All");
  const list = opportunities.filter((o) => k === "All" || o.kind === k);
  return (
    <Container as="section" className="py-section">
      <SectionHeading index="07" eyebrow="Opportunities" title="Work with the Office.">Careers, procurement notices, consultancies and tenders in one place.</SectionHeading>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2" role="group" aria-label="Filter opportunities">
        {kinds.map((x) => <Button key={x} variant="filter" size="sm" data-active={k === x} aria-pressed={k === x} onClick={() => setK(x)}>{x}</Button>)}
      </div>
      <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {list.map((o) => (
          <li key={o.ref} className="animate-fade-in motion-reduce:animate-none">
            <Link to={`/opportunities/${o.kind === "Careers" ? "careers" : "procurement"}`} className="group flex h-full flex-col border border-border bg-card p-6 transition-shadow duration-base hover:shadow-raised">
              <div className="flex justify-between gap-2"><Badge tone="brand">{o.kind}</Badge><span className="font-mono text-xs text-muted-foreground">{o.ref}</span></div>
              <h3 className="mt-5 flex-1 font-display text-h4 group-hover:text-primary">{o.title}</h3>
              <div className="mt-5 flex justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="size-3.5" aria-hidden />{o.location}</span>
                <span className="flex items-center gap-1"><Calendar className="size-3.5" aria-hidden />Closes {o.closes}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Note />
    </Container>
  );
}

/* ---------------- News ---------------- */
function News() {
  const side = [
    { t: "OAG hosts regional workshop on performance audit methods", d: "Event · 18 Sep 2026", img: meeting },
    { t: "New guidance on internal control self-assessment published", d: "News · 2 Sep 2026", img: building },
  ];
  return (
    <section className="border-t border-border bg-surface-sunken py-section">
      <Container>
        <SectionHeading index="08" eyebrow="News & events" title="From the Office." />
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Link to="/knowledge/news" className="reveal group block">
            <div className="overflow-hidden"><img src={conference} alt="A delegate addresses a regional assembly" loading="lazy" width={1280} height={864} className="aspect-[16/10] w-full object-cover transition-transform duration-slow group-hover:scale-[1.03]" /></div>
            <p className="overline mt-5 text-primary">Feature · 26 Sep 2026</p>
            <h3 className="mt-2 font-display text-h2 group-hover:text-primary">Auditors General convene on the future of regional accountability</h3>
            <p className="mt-3 max-w-2xl text-small text-muted-foreground">Sample story: delegates discussed shared standards, digital audit tools and public reporting.</p>
          </Link>
          <ul className="grid content-start gap-8">
            {side.map((n, i) => (
              <li key={n.t} className="reveal" style={stagger(i + 1)}>
                <Link to="/knowledge/news" className="group grid grid-cols-[7rem_1fr] gap-4 sm:grid-cols-[10rem_1fr]">
                  <div className="overflow-hidden"><img src={n.img} alt="" loading="lazy" className="aspect-square w-full object-cover transition-transform duration-slow group-hover:scale-105" /></div>
                  <div><p className="text-xs text-muted-foreground">{n.d}</p><h3 className="mt-1 font-display text-h4 group-hover:text-primary">{n.t}</h3></div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta() {
  const links = [
    { t: "Audit Intelligence", to: "/#intelligence" },
    { t: "Publications", to: "/publications" },
    { t: "IntegrityLine", to: "/integrityline" },
  ];
  return (
    <section className="bg-ink py-section-lg text-background">
      <Container className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <h2 className="reveal font-display text-display-lg">Explore the work of the Office of the Auditor General.</h2>
        <ul className="grid border-t border-background/20">
          {links.map((l) => (
            <li key={l.t} className="border-b border-background/20">
              <Link to={l.to} className="group flex items-center justify-between py-5 font-display text-h3 hover:text-ecowas-yellow">
                {l.t}<ArrowRight className="size-6 transition-transform duration-base group-hover:translate-x-2" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default function Home() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <Hero />
      <Intelligence />
      <AuditMap />
      <Transparency />
      <Publications />
      <Insights />
      <IntegrityLine />
      <Opportunities />
      <News />
      <FinalCta />
    </div>
  );
}
