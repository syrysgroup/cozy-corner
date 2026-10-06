import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight, CalendarDays, ChevronDown, FileText, FolderKanban, Landmark,
  ScrollText, Search, ShieldAlert, Trophy, BookOpen, Building2,
} from "lucide-react";
import { Button, Band, Wordmark, Badge } from "@/components/ds/primitives";
import {
  NOTICE_TYPES, RESOURCE_KINDS, PARTICIPATION_STEPS, AUTHENTICITY_GUIDANCE, PROCUREMENT_FAQS,
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

function FaqList() {
  return (
    <div className="max-w-3xl divide-y divide-border border-y border-border">
      {PROCUREMENT_FAQS.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-h4 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="size-5 shrink-0 transition-transform duration-base group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
          </summary>
          <p className="pb-5 text-body text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

function AuthenticityNotice() {
  return (
    <section className="bg-ecowas-yellow-12">
      <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center">
        <ShieldAlert className="size-8 shrink-0 text-ecowas-brown" aria-hidden />
        <p className="flex-1 text-body text-ink"><strong>Check authenticity.</strong> {AUTHENTICITY_GUIDANCE}</p>
        <Button asChild variant="secondary"><Link to="/integrityline">Report through IntegrityLine</Link></Button>
      </div>
    </section>
  );
}

// ---------- Notices ----------
function NoticesView() {
  const [notices, setNotices] = useState<ProcurementNotice[] | null>(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState<NoticeType | "all">("all");
  const [status, setStatus] = useState<"all" | "open" | "closed">("all");

  useEffect(() => { fetchNotices().then(setNotices); }, []);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (notices ?? []).filter((n) =>
      (type === "all" || n.type === type) &&
      (status === "all" || n.status === status) &&
      (!term || `${n.title} ${n.reference} ${n.institution}`.toLowerCase().includes(term)));
  }, [notices, q, type, status]);

  return (
    <section className="container py-section-sm lg:py-section" aria-labelledby="notices-h">
      <Crumb current="Notices" />
      <p className="overline text-primary">Procurement</p>
      <h1 id="notices-h" className="mt-3 font-display text-h1">Procurement notices</h1>
      <p className="mt-4 max-w-2xl text-lead text-ink-soft">Calls for tenders, expressions of interest and other published procurement opportunities.</p>

      <div className="mt-8 flex flex-wrap items-end gap-4 border-b border-border pb-5">
        <label className="grid min-w-56 flex-1 gap-1 text-small font-semibold text-ink">
          Search notices
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="form-control min-h-11 w-full pl-9" placeholder="Title, reference or institution" />
          </span>
        </label>
        <label className="grid gap-1 text-small font-semibold text-ink">
          Notice type
          <select className="form-control min-h-11" value={type} onChange={(e) => setType(e.target.value as NoticeType | "all")}>
            <option value="all">All types</option>
            {NOTICE_TYPES.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-small font-semibold text-ink">
          Status
          <select className="form-control min-h-11" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </label>
      </div>

      <div className="mt-8" aria-live="polite">
        {notices === null ? (
          <p className="text-muted-foreground">Loading notices…</p>
        ) : filtered.length === 0 ? (
          <EmptyPanel icon={ScrollText} title="No published notices at present"
            body="Approved procurement notices are published here and through official ECOWAS procurement channels. Please check back for new opportunities." />
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
                  <Link to={`/opportunities/procurement/notices/${n.id}`} className="underline-offset-4 hover:text-primary hover:underline">{n.title}</Link>
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
    </section>
  );
}

function NoticeDetailView({ id }: { id: string }) {
  const [notice, setNotice] = useState<ProcurementNotice | null | undefined>(undefined);
  useEffect(() => { fetchNotices().then((all) => setNotice(all.find((n) => n.id === id) ?? null)); }, [id]);

  return (
    <section className="container py-section-sm lg:py-section">
      <Crumb current="Notice detail" />
      {notice === undefined ? (
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
          {notice.documents.length > 0 && (
            <ul className="mt-8 grid gap-2">
              {notice.documents.map((d) => (
                <li key={d.title}><a href={d.url} className="flex items-center gap-3 border border-border bg-card px-4 py-3 text-body text-ink hover:border-primary"><FileText className="size-4 text-primary" aria-hidden />{d.title}</a></li>
              ))}
            </ul>
          )}
        </article>
      )}
      <Button asChild variant="secondary" className="mt-10"><Link to="/opportunities/procurement/notices">All notices</Link></Button>
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

// ---------- FAQs ----------
function FaqsView() {
  return (
    <section className="container py-section-sm lg:py-section" aria-labelledby="faqs-h">
      <Crumb current="FAQs" />
      <p className="overline text-primary">Procurement</p>
      <h1 id="faqs-h" className="mt-3 font-display text-h1">Procurement FAQs</h1>
      <p className="mt-4 max-w-2xl text-lead text-ink-soft">Answers to common questions about participating in OAG procurement.</p>
      <div className="mt-8"><FaqList /></div>
    </section>
  );
}

// ---------- Overview ----------
function Overview() {
  const [notices, setNotices] = useState<ProcurementNotice[] | null>(null);
  const [q, setQ] = useState("");
  useEffect(() => { fetchNotices().then(setNotices); }, []);
  const open = useMemo(() => (notices ?? []).filter((n) => n.status === "open"), [notices]);

  const sections = [
    { to: "/opportunities/procurement/notices", icon: ScrollText, title: "Notices", body: "Calls for tenders, expressions of interest and requests for quotation." },
    { to: "/opportunities/procurement/plans", icon: Landmark, title: "Procurement plans", body: "Annual plans giving advance notice of upcoming opportunities." },
    { to: "/opportunities/procurement/awards", icon: Trophy, title: "Contract awards", body: "Published award decisions and standstill information." },
    { to: "/opportunities/procurement/projects", icon: FolderKanban, title: "Projects", body: "Programmes with procurement activity, including donor-funded operations." },
    { to: "/opportunities/procurement/resources", icon: BookOpen, title: "Resources", body: "Guides, regulations, templates and policies for suppliers." },
    { to: "/opportunities/procurement/faqs", icon: FileText, title: "FAQs", body: "Common questions about participating in OAG procurement." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="container py-section-sm lg:py-section">
        <Crumb current="" />
        <Wordmark />
        <h1 className="mt-8 font-display text-display-lg text-ink">Procurement & opportunities</h1>
        <p className="mt-6 max-w-2xl text-lead text-ink-soft">
          Procurement notices, plans and contract awards from the Office of the Auditor General of ECOWAS Institutions — and how suppliers and partners can take part.
        </p>
        <form className="mt-8 flex max-w-xl gap-3" action="/opportunities/procurement/notices" onSubmit={(e) => { if (!q.trim()) e.preventDefault(); }}>
          <label className="relative flex-1">
            <span className="sr-only">Search procurement notices</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)} className="form-control min-h-12 w-full pl-9" placeholder="Search notices by title, reference or institution" />
          </label>
          <Button type="submit" size="lg">Search</Button>
        </form>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Quick links">
          {sections.map((s) => (
            <li key={s.to}><Link to={s.to} className="inline-flex min-h-11 items-center border border-border bg-card px-4 text-small font-semibold text-ink-soft transition-colors duration-fast hover:border-primary hover:text-primary">{s.title}</Link></li>
          ))}
        </ul>
      </section>

      {/* Open notices */}
      <section className="container pb-section-sm lg:pb-section" aria-labelledby="open-h">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="overline text-primary">Current opportunities</p>
            <h2 id="open-h" className="mt-3 font-display text-h2">Open notices</h2>
          </div>
          <Button asChild variant="secondary"><Link to="/opportunities/procurement/notices">Browse all notices <ArrowRight /></Link></Button>
        </div>
        <div aria-live="polite">
          {notices === null ? (
            <p className="text-muted-foreground">Loading notices…</p>
          ) : open.length === 0 ? (
            <EmptyPanel icon={ScrollText} title="No open notices at present"
              body="Approved procurement notices are published here and through official ECOWAS procurement channels. Please check back for new opportunities." />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {open.slice(0, 4).map((n) => (
                <li key={n.id} className="border border-border border-l-4 border-l-primary bg-card p-6">
                  <p className="font-mono text-small text-muted-foreground">{n.reference}</p>
                  <h3 className="mt-1 font-display text-h3 text-ink">
                    <Link to={`/opportunities/procurement/notices/${n.id}`} className="underline-offset-4 hover:text-primary hover:underline">{n.title}</Link>
                  </h3>
                  <p className="mt-2 text-small text-ink-soft">Deadline: {fmt(n.deadline)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <AuthenticityNotice />

      {/* Sections grid */}
      <section className="container py-section-sm lg:py-section" aria-labelledby="explore-h">
        <p className="overline text-primary">Explore</p>
        <h2 id="explore-h" className="mt-3 font-display text-h2">Procurement information</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ to, icon: Icon, title, body }) => (
            <li key={to}>
              <Link to={to} className="group flex h-full flex-col border border-border bg-card p-6 transition-shadow duration-base hover:shadow-raised">
                <Icon className="size-6 text-primary" aria-hidden />
                <h3 className="mt-4 font-display text-h4 text-ink group-hover:text-primary">{title}</h3>
                <p className="mt-2 flex-1 text-body text-ink-soft">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-small font-semibold text-primary">Open <ArrowRight className="size-4" aria-hidden /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Donor-funded */}
      <section className="bg-surface-sunken">
        <div className="container grid gap-6 py-section-sm md:grid-cols-[auto_1fr] md:items-start lg:py-section">
          <Landmark className="size-10 text-primary" aria-hidden />
          <div>
            <h2 className="font-display text-h2">Donor-funded procurement</h2>
            <p className="mt-4 max-w-3xl text-body text-ink-soft">
              Some procurement is financed under agreements with development partners and follows the procedures required by those agreements. Notices and awards for donor-funded operations are clearly labelled, and eligibility rules may differ from those financed directly by ECOWAS. Published donor-funded notices and projects appear in the Notices and Projects sections once approved.
            </p>
            <Button asChild variant="secondary" className="mt-6"><Link to="/opportunities/procurement/projects">View projects <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>

      {/* Participation */}
      <section className="bg-ecowas-ocean text-background" aria-labelledby="part-h">
        <div className="container py-section-sm lg:py-section">
          <h2 id="part-h" className="font-display text-h2 text-background">How to participate</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {PARTICIPATION_STEPS.map((s, i) => (
              <li key={s.title} className="border-t-2 border-ecowas-sky pt-4">
                <span className="font-mono text-small text-background/80">Step {i + 1}</span>
                <h3 className="mt-1 font-display text-h4 text-background">{s.title}</h3>
                <p className="mt-2 text-body text-background/90">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQs */}
      <section className="container py-section-sm lg:py-section" aria-labelledby="faq-h">
        <h2 id="faq-h" className="font-display text-h2">Frequently asked questions</h2>
        <div className="mt-8"><FaqList /></div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container flex flex-col gap-6 py-section-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-h2 text-primary-foreground">Work with the OAG</h2>
            <p className="mt-2 text-lead text-primary-foreground/90">Published notices and resources appear here as they are approved.</p>
          </div>
          <Button asChild size="lg" variant="inverse"><Link to="/opportunities/procurement/notices">Browse notices <ArrowRight /></Link></Button>
        </div>
      </section>
      <Band aria-hidden />
    </>
  );
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
    default: return <Overview />;
  }
}
