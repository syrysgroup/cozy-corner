import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight, CalendarDays, ChevronDown, FileText, FolderKanban, Landmark,
  ScrollText, Search, ShieldAlert, Trophy, BookOpen, Building2,
} from "lucide-react";
import { Button, Badge } from "@/components/ds/primitives";
import { filterNotices, noticeSearchParams, DEFAULT_NOTICE_FILTERS } from "@/lib/opportunity-filters";
import {
  NOTICE_TYPES, RESOURCE_KINDS,
  fetchNotices, fetchPlans, fetchAwards, fetchProjects, fetchResources,
  type ProcurementNotice, type ProcurementPlan, type ProcurementAward,
  type ProcurementProject, type ProcurementResource, type NoticeType,
} from "@/lib/procurement-data";

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function EmptyPanel({ icon: Icon, title, body, as: Heading = "h3" }: { icon: typeof FileText; title: string; body: string; as?: "h1" | "h3" }) {
  return (
    <div className="grid gap-4 border border-border bg-surface-sunken p-8 md:grid-cols-[auto_1fr] md:items-start">
      <Icon className="size-8 text-primary" aria-hidden />
      <div>
        <Heading className="font-display text-h3">{title}</Heading>
        <p className="mt-2 max-w-2xl text-body text-ink-soft">{body}</p>
      </div>
    </div>
  );
}

function Crumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-small text-muted-foreground">
      <Link to="/" className="hover:text-primary hover:underline">Home</Link> /{" "}
      <Link to="/opportunities" className="hover:text-primary hover:underline">Opportunities</Link> /{" "}
      <Link to="/opportunities/procurement" className="hover:text-primary hover:underline">Procurement</Link>
      {current && <> / <span aria-current="page" className="text-ink">{current}</span></>}
    </nav>
  );
}

// ---------- Notices ----------
function NoticesView({ overview = false }: { overview?: boolean }) {
  const [params, setParams] = useSearchParams();
  const [notices, setNotices] = useState<ProcurementNotice[] | null>(null);
  const q = params.get("q") ?? "";
  const setQ = (value: string) => setParams(noticeSearchParams(params, value), { replace: true });
  const [failed, setFailed] = useState(false);
  const [type, setType] = useState<NoticeType | "all">("all");
  const [status, setStatus] = useState<"all" | "open" | "closed" | "cancelled">(overview ? "open" : "all");

  const load = () => { setFailed(false); setNotices(null); fetchNotices().then(setNotices).catch(() => setFailed(true)); };
  useEffect(load, []);
  const filtered = useMemo(() => filterNotices(notices ?? [], q, type, status), [notices, q, type, status]);

  return (
    <section lang="en" className="container py-section-sm" aria-labelledby="notices-h">
      <Crumb current={overview ? "" : "Notices"} />
      <p className="overline text-primary">Procurement</p>
      <h1 id="notices-h" className="mt-3 font-display text-h1">{overview ? "Procurement" : "Procurement notices"}</h1>
      <p className="mt-4 max-w-2xl text-lead text-ink-soft">Calls for tenders, expressions of interest and other published procurement opportunities.</p>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2"><Button asChild variant="tertiary"><Link to="/opportunities#procurement-guidance">Participation guidance <ArrowRight /></Link></Button>{overview && <Button asChild variant="tertiary"><Link to={{ pathname: "/opportunities/procurement/notices", search: params.toString() }}>All published notices <ArrowRight /></Link></Button>}</div>
      <h2 className="mt-8 font-display text-h3">{status === "open" ? "Open notices" : "Published notices"}</h2>
      <div className="mt-5 grid gap-4 border-b border-border pb-5 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <label className="grid min-w-0 gap-1 text-small font-semibold text-ink">
          Search notices
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="form-control min-h-11 w-full pl-9" placeholder="Title, reference or institution" />
          </span>
        </label>
        <label className="grid gap-1 text-small font-semibold text-ink">
          Notice type
          <select className="form-control min-h-11 w-full" value={type} onChange={(e) => setType(e.target.value as NoticeType | "all")}>
            <option value="all">All types</option>
            {NOTICE_TYPES.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-small font-semibold text-ink">
          Status
          <select className="form-control min-h-11 w-full" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      <div className="mt-8" aria-live="polite">
        {failed ? (<div role="alert"><h3 className="font-display text-h3">Notices could not be loaded</h3><p className="mt-2 text-ink-soft">Please try again. Availability cannot be confirmed right now.</p><Button className="mt-4" variant="secondary" onClick={load}>Try again</Button></div>) : notices === null ? (
          <p className="text-muted-foreground">Loading notices…</p>
        ) : filtered.length === 0 ? (
          <><EmptyPanel icon={ScrollText} title={notices.length === 0 ? "No procurement notices are currently published here" : "No notices match your filters"}
            body={notices.length === 0 ? "There are no approved procurement notices listed on this page. Check the official ECOWAS channels for further announcements." : "Try a different search, notice type or status."} />{(q || type !== "all" || status !== "all") && <Button variant="secondary" className="mt-4" onClick={() => { setQ(DEFAULT_NOTICE_FILTERS.q); setType(DEFAULT_NOTICE_FILTERS.type); setStatus(DEFAULT_NOTICE_FILTERS.status); }}>Reset filters</Button>}</>
        ) : (
          <ul className="grid gap-4">
            {filtered.map((n) => (
              <li key={n.id} className="border border-border border-l-4 border-l-primary bg-card p-6 transition-shadow duration-base hover:shadow-raised">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="outline">{NOTICE_TYPES.find((t) => t.id === n.type)?.title}</Badge>
                  <Badge tone={n.status === "open" ? "brand" : "default"}>{n.status}</Badge>
                  {n.donorFunded && <Badge tone="outline">Donor-funded</Badge>}
                </div>
                <h2 className="mt-3 font-display text-h3 text-ink">
                  <Link to={{ pathname: `/opportunities/procurement/notices/${n.id}`, search: params.toString() }} className="underline-offset-4 hover:text-primary hover:underline">{n.title}</Link>
                </h2>
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-small text-ink-soft">
                  <div className="flex items-center gap-1.5"><FileText className="size-4" aria-hidden /><dt className="sr-only">Reference</dt><dd className="font-mono">{n.reference}</dd></div>
                  <div className="flex items-center gap-1.5"><Building2 className="size-4" aria-hidden /><dt className="sr-only">Institution</dt><dd>{n.institution}</dd></div>
                  <div className="flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden /><dt>Deadline</dt><dd>{fmt(n.deadline)}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-6 flex items-start gap-2 text-small text-ink-soft"><ShieldAlert className="size-4 shrink-0 text-accent" aria-hidden /><span>Never pay to participate. Follow the submission channel named in the official notice. <Link to="/opportunities#procurement-guidance" className="font-semibold text-primary hover:underline">Read procurement guidance</Link>.</span></p>
      <nav aria-label="Procurement information" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5">{["Plans", "Awards", "Projects", "Resources"].map((label) => <Button key={label} asChild variant="tertiary" size="sm"><Link to={`/opportunities/procurement/${label.toLowerCase()}`}>{label}<ArrowRight /></Link></Button>)}</nav>
    </section>
  );
}

function NoticeDetailView({ id }: { id: string }) {
  const [params] = useSearchParams();
  const [notice, setNotice] = useState<ProcurementNotice | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const load = () => { setFailed(false); setNotice(undefined); fetchNotices().then((all) => setNotice(all.find((n) => n.id === id) ?? null)).catch(() => setFailed(true)); };
  useEffect(load, [id]);

  return (
    <section className="container py-section-sm lg:py-section">
      <Crumb current="Notice detail" />
      {failed ? <div role="alert"><h1 className="font-display text-h3">Notice could not be loaded</h1><p className="mt-2 text-ink-soft">Availability cannot be confirmed right now.</p><Button variant="secondary" className="mt-4" onClick={load}>Try again</Button></div> : notice === undefined ? (
        <p className="text-muted-foreground">Loading notice…</p>
      ) : notice === null ? (
        <EmptyPanel as="h1" icon={ScrollText} title="Notice not available"
          body="This notice is not currently published. It may have been withdrawn or the link may be incorrect. Published notices are listed on the notices page." />
      ) : (
        <article className="max-w-3xl">
          <p className="font-mono text-small text-muted-foreground">{notice.reference}</p>
          <h1 className="mt-2 font-display text-h1">{notice.title}</h1>
          <dl className="mt-6 grid gap-4 border-y border-border py-5 sm:grid-cols-2">
            <div><dt className="overline text-muted-foreground">Institution</dt><dd className="mt-1 text-body text-ink">{notice.institution}</dd></div>
            <div><dt className="overline text-muted-foreground">Published</dt><dd className="mt-1 text-body text-ink">{fmt(notice.published)}</dd></div>
            <div><dt className="overline text-muted-foreground">Deadline</dt><dd className="mt-1 text-body text-ink">{fmt(notice.deadline)}</dd></div>
            <div><dt className="overline text-muted-foreground">Status</dt><dd className="mt-1 text-body text-ink">{notice.status}</dd></div>
          </dl>
          <p className="mt-6 text-lead text-ink-soft">{notice.summary}</p>
          <p className="mt-5 flex items-start gap-2 text-small text-ink-soft"><ShieldAlert className="size-4 shrink-0 text-accent" aria-hidden /><span>Never pay to participate. Follow the submission channel named in the official notice.</span></p>
          {notice.documents.length > 0 && (
            <ul className="mt-8 grid gap-2">
              {notice.documents.map((d) => (
                <li key={d.title}><a href={d.url} className="flex items-center gap-3 border border-border bg-card px-4 py-3 text-body text-ink hover:border-primary"><FileText className="size-4 text-primary" aria-hidden />{d.title}</a></li>
              ))}
            </ul>
          )}
        </article>
      )}
      <Button asChild variant="secondary" className="mt-10"><Link to={{ pathname: "/opportunities/procurement/notices", search: params.toString() }}>All notices</Link></Button>
    </section>
  );
}

// ---------- Plans ----------
function PlansView() {
  const [plans, setPlans] = useState<ProcurementPlan[] | null>(null);
  useEffect(() => { fetchPlans().then(setPlans); }, []);
  return (
    <section className="container py-section-sm lg:py-section" aria-labelledby="plans-h">
      <Crumb current="Plans" />
      <p className="overline text-primary">Procurement</p>
      <h1 id="plans-h" className="mt-3 font-display text-h1">Procurement plans</h1>
      <p className="mt-4 max-w-2xl text-lead text-ink-soft">Published annual procurement plans give advance notice of upcoming opportunities.</p>
      <div className="mt-8" aria-live="polite">
        {plans === null ? (
          <p className="text-muted-foreground">Loading plans…</p>
        ) : plans.length === 0 ? (
          <EmptyPanel icon={Landmark} title="No published plans at present"
            body="Approved procurement plans are published here once adopted. Please check back." />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {plans.map((p) => (
              <li key={p.id} className="border border-border bg-card p-6">
                <p className="overline text-primary">{p.year}</p>
                <h2 className="mt-2 font-display text-h3 text-ink">{p.title}</h2>
                <p className="mt-2 text-body text-ink-soft">{p.summary}</p>
                <p className="mt-3 text-small text-muted-foreground">{p.institution}</p>
                {p.documentUrl && <Button asChild variant="secondary" className="mt-4"><a href={p.documentUrl}>View plan document <ArrowRight /></a></Button>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ---------- Awards ----------
function AwardsView() {
  const [awards, setAwards] = useState<ProcurementAward[] | null>(null);
  const [q, setQ] = useState("");
  useEffect(() => { fetchAwards().then(setAwards); }, []);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (awards ?? []).filter((a) => !term || `${a.title} ${a.reference} ${a.institution} ${a.awardedTo ?? ""}`.toLowerCase().includes(term));
  }, [awards, q]);
  return (
    <section className="container py-section-sm lg:py-section" aria-labelledby="awards-h">
      <Crumb current="Awards" />
      <p className="overline text-primary">Procurement</p>
      <h1 id="awards-h" className="mt-3 font-display text-h1">Contract awards</h1>
      <p className="mt-4 max-w-2xl text-lead text-ink-soft">Published contract award decisions, subject to any applicable standstill period.</p>
      <label className="mt-8 grid max-w-md gap-1 text-small font-semibold text-ink">
        Search awards
        <span className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="form-control min-h-11 w-full pl-9" placeholder="Title, reference or supplier" />
        </span>
      </label>
      <div className="mt-8" aria-live="polite">
        {awards === null ? (
          <p className="text-muted-foreground">Loading awards…</p>
        ) : filtered.length === 0 ? (
          <EmptyPanel icon={Trophy} title="No published awards at present"
            body="Approved contract awards are published here after evaluation and any standstill period. Please check back." />
        ) : (
          <ul className="grid gap-4">
            {filtered.map((a) => (
              <li key={a.id} className="border border-border bg-card p-6">
                <p className="font-mono text-small text-muted-foreground">{a.reference}</p>
                <h2 className="mt-1 font-display text-h3 text-ink">{a.title}</h2>
                <p className="mt-2 text-body text-ink-soft">{a.institution}{a.awardedTo && ` · Awarded to ${a.awardedTo}`}{a.awardDate && ` · ${fmt(a.awardDate)}`}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ---------- Projects ----------
function ProjectsView() {
  const [projects, setProjects] = useState<ProcurementProject[] | null>(null);
  useEffect(() => { fetchProjects().then(setProjects); }, []);
  return (
    <section className="container py-section-sm lg:py-section" aria-labelledby="projects-h">
      <Crumb current="Projects" />
      <p className="overline text-primary">Procurement</p>
      <h1 id="projects-h" className="mt-3 font-display text-h1">Procurement projects</h1>
      <p className="mt-4 max-w-2xl text-lead text-ink-soft">Programmes and projects with procurement activity, including donor-funded operations.</p>
      <div className="mt-8" aria-live="polite">
        {projects === null ? (
          <p className="text-muted-foreground">Loading projects…</p>
        ) : projects.length === 0 ? (
          <EmptyPanel icon={FolderKanban} title="No published projects at present"
            body="Projects with procurement activity are listed here once approved for publication." />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <li key={p.id} className="border border-border bg-card p-6">
                {p.donorFunded && <Badge tone="outline">Donor-funded</Badge>}
                <h2 className="mt-2 font-display text-h3 text-ink">{p.title}</h2>
                <p className="mt-2 text-body text-ink-soft">{p.summary}</p>
                <p className="mt-3 text-small text-muted-foreground">{p.institution}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ---------- Resources ----------
function ResourcesView() {
  const [resources, setResources] = useState<ProcurementResource[] | null>(null);
  useEffect(() => { fetchResources().then(setResources); }, []);
  return (
    <section className="container py-section-sm lg:py-section" aria-labelledby="res-h">
      <Crumb current="Resources" />
      <p className="overline text-primary">Procurement</p>
      <h1 id="res-h" className="mt-3 font-display text-h1">Procurement resources</h1>
      <p className="mt-4 max-w-2xl text-lead text-ink-soft">Guides, regulations, templates and policies for suppliers and partners.</p>
      <div className="mt-8" aria-live="polite">
        {resources === null ? (
          <p className="text-muted-foreground">Loading resources…</p>
        ) : resources.length === 0 ? (
          <EmptyPanel icon={BookOpen} title="No published resources at present"
            body="Approved procurement guides, regulations and templates are published here. Please check back." />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {resources.map((r) => (
              <li key={r.id} className="border border-border bg-card p-6">
                <Badge tone="outline">{RESOURCE_KINDS.find((k) => k.id === r.kind)?.title}</Badge>
                <h2 className="mt-2 font-display text-h3 text-ink">
                  <Link to={`/opportunities/procurement/resources/${r.id}`} className="underline-offset-4 hover:text-primary hover:underline">{r.title}</Link>
                </h2>
                <p className="mt-2 text-body text-ink-soft">{r.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ResourceDetailView({ id }: { id: string }) {
  const [resource, setResource] = useState<ProcurementResource | null | undefined>(undefined);
  useEffect(() => { fetchResources().then((all) => setResource(all.find((r) => r.id === id) ?? null)); }, [id]);
  return (
    <section className="container py-section-sm lg:py-section">
      <Crumb current="Resource detail" />
      {resource === undefined ? (
        <p className="text-muted-foreground">Loading resource…</p>
      ) : resource === null ? (
        <EmptyPanel as="h1" icon={BookOpen} title="Resource not available"
          body="This resource is not currently published. Published resources are listed on the resources page." />
      ) : (
        <article className="max-w-3xl">
          <Badge tone="outline">{RESOURCE_KINDS.find((k) => k.id === resource.kind)?.title}</Badge>
          <h1 className="mt-3 font-display text-h1">{resource.title}</h1>
          <p className="mt-4 text-lead text-ink-soft">{resource.summary}</p>
          {resource.documentUrl && <Button asChild className="mt-6"><a href={resource.documentUrl}>Open document <ArrowRight /></a></Button>}
        </article>
      )}
      <Button asChild variant="secondary" className="mt-10"><Link to="/opportunities/procurement/resources">All resources</Link></Button>
    </section>
  );
}

function FaqsView() {
  return <section className="container py-section"><Crumb current="FAQs" /><h1 className="font-display text-h1">Procurement FAQs</h1><p className="mt-4 text-lead text-ink-soft">Find procurement questions and participation guidance in Opportunities.</p><Button asChild className="mt-6"><Link to="/opportunities#procurement-faqs">View procurement FAQs <ArrowRight /></Link></Button></section>;
}

export default function Procurement() {
  const { sub, id } = useParams<{ sub?: string; id?: string }>();
  if (sub === "notices" && id) return <NoticeDetailView id={id} />;
  if (sub === "resources" && id) return <ResourceDetailView id={id} />;
  switch (sub) {
    case "notices": return <NoticesView />;
    case "plans": return <PlansView />;
    case "awards": return <AwardsView />;
    case "projects": return <ProjectsView />;
    case "resources": return <ResourcesView />;
    case "faqs": return <FaqsView />;
    default: return <NoticesView overview />;
  }
}
