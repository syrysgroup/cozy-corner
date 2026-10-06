import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { ArrowRight, ExternalLink, Search } from "lucide-react";
import { Container, PageHeader, EmptyState, NotFoundState, LoadingState } from "@/components/ds/shell/layout-parts";
import { Button } from "@/components/ds/primitives";
import { useI18n } from "@/lib/i18n";
import { NEWS_CATEGORIES, categoryLabel, fetchNews, getNewsBySlug, newsPath, type NewsCategory, type NewsItem } from "@/lib/news-data";

const VIEWS: { slug: string; label: string }[] = [
  { slug: "", label: "Overview" },
  { slug: "latest", label: "Latest" },
  ...NEWS_CATEGORIES.map((c) => ({ slug: c.slug, label: c.label })),
  { slug: "newsletter", label: "Newsletter" },
  { slug: "archive", label: "Archive" },
];
const VIEW_SLUGS = new Set(VIEWS.map((v) => v.slug));

const fmt = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d));

function SectionNav({ current }: { current: string }) {
  return (
    <nav aria-label="Newsroom sections" className="border-b border-border bg-card">
      <Container>
        <ul className="-mx-2 flex gap-1 overflow-x-auto py-2">
          {VIEWS.map((v) => (
            <li key={v.slug}>
              <NavLink to={v.slug ? `/news/${v.slug}` : "/news"} end aria-current={current === v.slug ? "page" : undefined}
                className={`inline-flex min-h-11 items-center whitespace-nowrap px-3 text-small font-semibold underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring ${current === v.slug ? "text-primary underline decoration-2" : "text-ink-soft"}`}>
                {v.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}

function NewsCard({ n }: { n: NewsItem }) {
  return (
    <li className="border-b border-border py-5">
      <Link to={newsPath(n.slug)} className="group block">
        <p className="text-xs text-muted-foreground">{categoryLabel(n.category)} · <time dateTime={n.date}>{fmt(n.date)}</time> · OAG</p>
        <h3 className="mt-1 font-display text-h4 group-hover:text-primary">{n.title}</h3>
        <p className="mt-1 text-small text-muted-foreground">{n.summary}</p>
      </Link>
    </li>
  );
}

function Discovery({ category, archive }: { category?: NewsCategory; archive?: boolean }) {
  const { lang } = useI18n();
  const [q, setQ] = useState("");
  const [year, setYear] = useState<number | undefined>();
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [all, setAll] = useState<NewsItem[]>([]);
  useEffect(() => { fetchNews({ category, lang }).then(setAll); }, [category, lang]);
  useEffect(() => { let on = true; setItems(null); fetchNews({ category, query: q, year, lang }).then((r) => on && setItems(r)); return () => { on = false; }; }, [category, q, year, lang]);
  const years = useMemo(() => [...new Set(all.map((n) => new Date(n.date).getUTCFullYear()))].sort((a, b) => b - a), [all]);
  const filtering = q.trim() !== "" || year !== undefined;

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="flex flex-wrap gap-3">
        <label className="relative min-w-60 flex-1">
          <span className="sr-only">Search OAG news</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search OAG news" className="h-11 w-full border border-input bg-background pl-9 pr-3 text-small focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" />
        </label>
        {(archive || years.length > 0) && (
          <label className="flex items-center gap-2 text-small">
            <span>Year</span>
            <select value={year ?? ""} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)} disabled={years.length === 0} className="h-11 border border-input bg-background px-3">
              <option value="">All years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
        )}
      </form>
      <div className="mt-6" aria-live="polite">
        {items === null ? <LoadingState label="Loading news" />
          : items.length > 0 ? <ul className="border-t border-border">{items.map((n) => <NewsCard key={n.id} n={n} />)}</ul>
          : filtering ? <NotFoundState action={<Button variant="secondary" size="sm" onClick={() => { setQ(""); setYear(undefined); }}>Clear filters</Button>}>No published OAG items match your search.</NotFoundState>
          : <EmptyState title="Nothing published yet">Approved OAG {category ? categoryLabel(category).toLowerCase() : "news"} will appear here once published. Only approved language versions are shown.</EmptyState>}
      </div>
    </div>
  );
}

function Newsletter() {
  return (
    <EmptyState title="Newsletter not yet available">
      The OAG newsletter subscription service has not been launched. No sign-ups are collected on this page. Please check back once it is announced.
    </EmptyState>
  );
}

function Article({ slug }: { slug: string }) {
  const [item, setItem] = useState<NewsItem | null | undefined>();
  useEffect(() => { setItem(undefined); getNewsBySlug(slug).then(setItem); }, [slug]);
  if (item === undefined) return <Container className="py-section"><LoadingState label="Loading article" /></Container>;
  if (!item) return (
    <>
      <PageHeader crumbs={[{ label: "Home", to: "/" }, { label: "News & Media", to: "/news" }, { label: "Not found" }]} title="Article not available" />
      <Container className="py-section"><NotFoundState title="This article is not published" action={<Button asChild variant="secondary" size="sm"><Link to="/news">Back to newsroom <ArrowRight /></Link></Button>}>It may not exist, or it has not been approved for publication.</NotFoundState></Container>
    </>
  );
  return (
    <>
      <PageHeader crumbs={[{ label: "Home", to: "/" }, { label: "News & Media", to: "/news" }, { label: categoryLabel(item.category), to: `/news/${item.category}` }, { label: item.title }]} overline={`${categoryLabel(item.category)} · ${fmt(item.date)} · Office of the Auditor General`} title={item.title} lead={item.summary} />
      <Container className="grid gap-10 border-t-2 border-ink py-section lg:grid-cols-[minmax(0,1fr)_15rem]">
        <article className="max-w-3xl space-y-6 text-body leading-relaxed text-ink-soft">
          {item.image && <img src={item.image} alt="" className="max-h-[36rem] w-full bg-surface-sunken object-contain" />}
          {item.body?.map((p, i) => <p key={i}>{p}</p>)}
        </article>
        <aside className="self-start border-t-2 border-primary pt-4 text-small"><p className="overline text-primary">Official publication</p><p className="mt-3">Office of the Auditor General</p><p className="mt-2 text-muted-foreground">{categoryLabel(item.category)} · <time dateTime={item.date}>{fmt(item.date)}</time></p><Button asChild variant="tertiary" className="mt-5"><Link to="/news">Back to newsroom <ArrowRight /></Link></Button></aside>
      </Container>
    </>
  );
}

export default function NewsPage() {
  const { sub } = useParams();
  if (sub && !VIEW_SLUGS.has(sub)) return <Article slug={sub} />;
  const view = sub ?? "";
  const label = VIEWS.find((v) => v.slug === view)?.label ?? "Overview";
  const category = NEWS_CATEGORIES.some((c) => c.slug === view) ? (view as NewsCategory) : undefined;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "News & Media", to: view ? "/news" : undefined }, ...(view ? [{ label }] : [])]}
        overline="Newsroom · Office of the Auditor General"
        title={view ? label : "News & Media"}
        lead="Approved announcements, statements, speeches, events and media from the Office of the Auditor General of ECOWAS Institutions."
      />
      <SectionNav current={view} />
      <Container className="grid gap-10 py-section lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>{view === "newsletter" ? <Newsletter /> : <Discovery category={category} archive={view === "archive"} />}</div>
        <aside className="space-y-4 text-small">
          <div className="border-l-2 border-ecowas-yellow bg-card p-5">
            <p className="overline text-primary">From the Community</p>
            <p className="mt-2 text-ink-soft">News published by ECOWAS is shown separately, with attribution and links to the original source.</p>
            <Link to="/knowledge/ecowas-news" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline">ECOWAS News <ExternalLink className="size-4" aria-hidden /></Link>
          </div>
          <div className="border border-border bg-card p-5">
            <p className="font-semibold">Media enquiries</p>
            <p className="mt-1 text-muted-foreground">A dedicated press contact has not yet been published. Use the general <Link to="/contact" className="text-primary underline">contact page</Link>.</p>
          </div>
        </aside>
      </Container>
    </>
  );
}
