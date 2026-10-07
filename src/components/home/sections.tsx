import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, FileSearch, Search, ClipboardCheck, RefreshCcw, BadgeCheck, Megaphone, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { SectionHeading } from "@/components/ds/showcase";
import { Container } from "@/components/ds/shell/layout-parts";
import { GOVERNANCE_ARMS, OAG_POSITIONING } from "@/components/ds/institutional";
import { useOfficialAsset } from "@/lib/public-site";
import { categoryLabel, fetchLatestNews, type NewsItem } from "@/lib/news-data";
import commissionLogo from "@/assets/commission-logo.png.asset.json";

const ARM_KEYS = ["commission", "parliament", "court"];
const ARM_SLUGS = ["commission", "parliament", "court"];

export function HomeIntro() {
  return (
    <Container as="section" aria-labelledby="home-intro" className="py-section">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div><p className="overline text-primary">The Office</p><h2 id="home-intro" className="mt-3 font-display text-h2">Who we are</h2></div>
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
        <p className="overline text-primary">What OAG does</p>
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
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const roles = ["Auditor General", "Leadership role 02", "Leadership role 03", "Leadership role 04"];

  const moveTo = (index: number) => {
    const next = Math.max(0, Math.min(roles.length - 1, index));
    const track = trackRef.current;
    const card = track?.children.item(next);
    if (!(card instanceof HTMLElement)) return;
    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActive(next);
  };

  const syncActive = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children).filter((item): item is HTMLElement => item instanceof HTMLElement);
    if (!cards.length) return;
    const nearest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft - track.scrollLeft);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setActive(nearest.index);
  };

  return (
    <section aria-labelledby="home-leadership" className="overflow-hidden border-b border-border bg-background py-section-lg">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)] lg:items-center">
          <div className="max-w-xl">
            <p className="overline text-primary">OAG Leadership</p>
            <h2 id="home-leadership" className="mt-4 font-display text-h1">Leadership of the Office of the Auditor General</h2>
            <p className="mt-5 text-lead text-ink-soft">The people responsible for directing the Office’s independent audit and assurance mandate.</p>
            <p className="mt-4 border-l-2 border-ecowas-yellow pl-4 text-small text-muted-foreground">Names, portraits and biographies will be published only after formal approval.</p>
            <div className="mt-8 flex items-center gap-3">
              <Button type="button" variant="secondary" size="icon" aria-label="Previous leadership profile" onClick={() => moveTo(active - 1)} disabled={active === 0} className="size-12 rounded-full">
                <ArrowLeft aria-hidden />
              </Button>
              <Button type="button" variant="secondary" size="icon" aria-label="Next leadership profile" onClick={() => moveTo(active + 1)} disabled={active === roles.length - 1} className="size-12 rounded-full">
                <ArrowRight aria-hidden />
              </Button>
              <span className="ml-2 font-mono text-xs text-muted-foreground" aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(roles.length).padStart(2, "0")}</span>
            </div>
            <div className="mt-6">
              <Button asChild variant="tertiary"><Link to="/about/leadership">View leadership page <ArrowRight /></Link></Button>
            </div>
          </div>

          <div className="min-w-0">
            <ul
              ref={trackRef}
              aria-label="OAG leadership profiles"
              tabIndex={0}
              onScroll={syncActive}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") { event.preventDefault(); moveTo(active + 1); }
                if (event.key === "ArrowLeft") { event.preventDefault(); moveTo(active - 1); }
              }}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-8 [scrollbar-width:thin]"
            >
              {roles.map((role, index) => (
                <li key={role} className="relative aspect-[3/4] w-[min(78vw,18.5rem)] shrink-0 snap-start overflow-hidden rounded-md border border-border bg-ecowas-ocean text-primary-foreground shadow-raised sm:w-72">
                  <div className="absolute inset-0 pattern-dots opacity-10" aria-hidden />
                  <div className="absolute inset-x-0 top-0 h-1 band" aria-hidden />
                  <div className="relative flex h-full flex-col p-6">
                    <span className="font-mono text-xs text-primary-foreground/65">{String(index + 1).padStart(2, "0")}</span>
                    <div className="grid flex-1 place-items-center">
                      <span className="grid size-28 place-items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10">
                        {index === 0 ? <ShieldCheck className="size-12 text-primary-foreground/70" aria-hidden /> : <UserRound className="size-12 text-primary-foreground/70" aria-hidden />}
                      </span>
                    </div>
                    <div className="border-t border-primary-foreground/25 pt-5">
                      <h3 className="font-display text-h3 text-primary-foreground">{role}</h3>
                      <p className="mt-2 text-small font-semibold uppercase text-primary-foreground/75">Details awaiting approval</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-1 flex gap-2" aria-hidden="true">
              {roles.map((role, index) => <span key={role} className={`h-1 flex-1 transition-colors ${index === active ? "bg-primary" : "bg-border"}`} />)}
            </div>
          </div>
        </div>
      </Container>
    </section>
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
          <p className="flex items-start gap-3 text-small text-ink-soft"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden /><span><strong className="text-ink">OAG: Independent assurance.</strong> {OAG_POSITIONING}</span></p>
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
          <p className="overline text-primary">Audit &amp; Assurance</p>
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
          <Button asChild variant="secondary" size="sm"><Link to="/news">View all news <ArrowRight /></Link></Button>
        </div>
        <div className="mt-8" aria-live="polite">
          {items === null ? <p className="text-small text-muted-foreground">Loading news…</p>
            : !feature ? <p className="border border-dashed border-border bg-card p-6 text-small text-muted-foreground">No news has been published yet. Approved announcements and events will appear here.</p>
            : (
              <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                <Link to={feature.href} className="group block">
                  {feature.image && <img src={feature.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />}
                  <p className="overline mt-5 text-primary">{categoryLabel(feature.category)} · <time dateTime={feature.date}>{feature.date}</time></p>
                  <h3 className="mt-2 font-display text-h2 group-hover:text-primary">{feature.title}</h3>
                  <p className="mt-3 text-small text-muted-foreground">{feature.summary}</p>
                </Link>
                <ul className="grid content-start gap-6">{rest.map((n) => <li key={n.id}><Link to={n.href} className="group block"><p className="text-xs text-muted-foreground">{categoryLabel(n.category)} · <time dateTime={n.date}>{n.date}</time></p><h3 className="mt-1 font-display text-h4 group-hover:text-primary">{n.title}</h3></Link></li>)}</ul>
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
          <p role="status" className="text-small text-muted-foreground sm:col-span-2">{status === "unavailable" && "Subscriptions are not yet open, the mailing service is still being connected, so your details were not saved. Please try again later."}</p>
        </form>
      </div>
    </Container>
  );
}
