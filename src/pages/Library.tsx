import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Download, Eye, Search, SlidersHorizontal, X, Sparkles, LayoutGrid, List } from "lucide-react";
import { Badge, Button } from "@/components/ds/primitives";
import { Container, NotFoundState, PageHeader } from "@/components/ds/shell/layout-parts";
import { DocCover } from "@/components/ds/library/DocCover";
import { cn } from "@/lib/utils";
import { FACETS, FACET_LABELS, facetValues, matchReason, publicDocuments, type FacetKey, type LibraryDoc } from "@/lib/library-data";

const PRESET: Record<string, Partial<Record<FacetKey, string[]>>> = {
  reports: { type: ["Audit Report", "Special Report"] },
  annual: { type: ["Annual Report"] },
};
const KEYS = Object.keys(FACETS) as FacetKey[];

export function downloadDoc(d: LibraryDoc) {
  // Placeholder until the document repository is connected.
  import("sonner").then(({ toast }) => toast.info(`Download of ${d.ref} will be available when the document repository is connected.`));
}

export default function Library() {
  const { sub } = useParams();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sel, setSel] = useState<Partial<Record<FacetKey, string[]>>>(PRESET[sub ?? ""] ?? {});
  const [sort, setSort] = useState<"recent" | "oldest" | "title">("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = (k: FacetKey, v: string) =>
    setSel((s) => { const cur = s[k] ?? []; return { ...s, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] }; });
  const active = KEYS.flatMap((k) => (sel[k] ?? []).map((v) => [k, v] as const));

  const results = useMemo(() => {
    const out = publicDocuments
      .map((d) => ({ d, why: matchReason(d, q) }))
      .filter(({ d, why }) => why !== null && KEYS.every((k) => !(sel[k]?.length) || facetValues(d, k).some((v) => sel[k]!.includes(v))));
    out.sort((a, b) => sort === "title" ? a.d.title.localeCompare(b.d.title) : sort === "oldest" ? a.d.published.localeCompare(b.d.published) : b.d.published.localeCompare(a.d.published));
    return out;
  }, [q, sel, sort]);

  const count = (k: FacetKey, v: string) => publicDocuments.filter((d) => facetValues(d, k).includes(v)).length;
  const featured = publicDocuments.find((d) => d.type === "Annual Report");

  const filters = (
    <div className="grid gap-6">
      {KEYS.map((k) => (
        <fieldset key={k}>
          <legend className="overline mb-2.5">{FACET_LABELS[k]}</legend>
          <div className="flex flex-wrap gap-1.5">
            {FACETS[k].map((v) => (
              <Button key={v} type="button" size="sm" variant="filter" data-active={sel[k]?.includes(v)} aria-pressed={!!sel[k]?.includes(v)} onClick={() => toggle(k, v)} className="h-auto min-h-8 max-w-full whitespace-normal px-2.5 py-1 text-left">
                {v}<span className="text-muted-foreground">{count(k, v)}</span>
              </Button>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );

  return (
    <>
      <PageHeader crumbs={[{ label: "Home", to: "/" }, { label: "Publications" }]} overline="Digital Audit Library" title="Publications and audit reports" lead="Search the Office's public audit reports, annual reports, guidance and statements." />

      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <Container className="py-4">
          <form role="search" onSubmit={(e) => { e.preventDefault(); setParams(q ? { q } : {}); }} className="flex items-center gap-3 border border-ink/20 bg-card px-4 focus-within:border-primary focus-within:shadow-focus">
            <Search className="size-5 text-primary" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} type="text" aria-label="Search the library" placeholder="Search titles, findings, recommendations, reference numbers…" className="h-13 min-w-0 flex-1 bg-transparent py-3.5 text-lead text-ink outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none placeholder:text-muted-foreground" />
            {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="grid size-9 place-items-center text-muted-foreground hover:text-ink"><X className="size-4" /></button>}
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-small">
            <span className="text-muted-foreground">Try:</span>
            {["procurement", "asset register", "OAG/PA", "governance"].map((s) => (
              <button key={s} type="button" onClick={() => setQ(s)} className="rounded-xs border border-border px-2 py-0.5 text-ink-soft hover:border-primary hover:text-primary">{s}</button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[17rem_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">{filters}</aside>

          <div className="min-w-0">
            {!q && !active.length && featured && (
              <Link to={`/publications/document/${featured.id}`} className="group mb-10 grid items-center gap-6 border border-border bg-surface-sunken p-5 transition-shadow hover:shadow-raised sm:grid-cols-[9rem_1fr] md:p-7">
                <DocCover doc={featured} className="w-36 transition-transform duration-base group-hover:-translate-y-1" />
                <div>
                  <p className="overline text-primary">Featured · Latest annual report</p>
                  <h2 className="mt-2 text-h3 text-ink group-hover:text-primary">{featured.title}</h2>
                  <p className="mt-2 text-body text-ink-soft">{featured.summary}</p>
                  <p className="mt-3 text-small text-muted-foreground">{featured.languages.join(" · ")} · {featured.pages} pages</p>
                </div>
              </Link>
            )}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-body text-ink" aria-live="polite"><strong>{results.length}</strong> document{results.length === 1 ? "" : "s"}{q && <> for “{q}”</>}</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen}><SlidersHorizontal />Filters{active.length ? ` (${active.length})` : ""}</Button>
                <label className="sr-only" htmlFor="sort">Sort</label>
                <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-9 border border-border bg-card px-2 text-small text-ink">
                  <option value="recent">Most recent</option><option value="oldest">Oldest</option><option value="title">Title A–Z</option>
                </select>
                <div className="flex border border-border" role="group" aria-label="Layout">
                  <button type="button" aria-pressed={view === "grid"} aria-label="Grid view" onClick={() => setView("grid")} className={cn("grid size-9 place-items-center", view === "grid" ? "bg-primary-soft text-primary" : "text-ink-soft")}><LayoutGrid className="size-4" /></button>
                  <button type="button" aria-pressed={view === "list"} aria-label="List view" onClick={() => setView("list")} className={cn("grid size-9 place-items-center", view === "list" ? "bg-primary-soft text-primary" : "text-ink-soft")}><List className="size-4" /></button>
                </div>
              </div>
            </div>

            {filtersOpen && <div className="mb-8 border border-border bg-card p-5 lg:hidden">{filters}</div>}

            {active.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {active.map(([k, v]) => (
                  <button key={k + v} type="button" onClick={() => toggle(k, v)} className="inline-flex items-center gap-1.5 rounded-xs bg-primary-soft px-2.5 py-1 text-small font-semibold text-primary" aria-label={`Remove filter ${v}`}>
                    {v}<X className="size-3.5" aria-hidden />
                  </button>
                ))}
                <Button variant="tertiary" size="sm" onClick={() => setSel({})}>Clear all</Button>
              </div>
            )}

            {results.length ? (
              <ul className={cn(view === "grid" ? "grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3" : "grid divide-y divide-border border-y border-border")}>
                {results.map(({ d, why }) => (
                  <li key={d.id}>
                    <article className={cn("group flex h-full", view === "grid" ? "flex-col" : "gap-5 py-5")}>
                      <Link to={`/publications/document/${d.id}`} tabIndex={-1} aria-hidden className={cn(view === "grid" ? "block bg-surface-sunken px-10 pt-8" : "w-24 shrink-0")}>
                        <DocCover doc={d} className="transition-transform duration-base ease-institutional group-hover:-translate-y-1.5" />
                      </Link>
                      <div className={cn("flex flex-1 flex-col", view === "grid" && "pt-4")}>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge tone="brand">{d.type}</Badge><Badge tone="outline">{d.year}</Badge>
                        </div>
                        {why && (
                          <p className="mt-2 inline-flex items-center gap-1.5 text-small font-semibold text-accent"><Sparkles className="size-3.5" aria-hidden />{why}</p>
                        )}
                        <h3 className="mt-2 text-h4 text-ink"><Link to={`/publications/document/${d.id}`} className="hover:text-primary hover:underline underline-offset-4">{d.title}</Link></h3>
                        <p className="mt-1 text-small text-muted-foreground">{d.institution} · {d.languages.map((l) => l.slice(0, 2).toUpperCase()).join(" / ")}</p>
                        <p className="mt-2 line-clamp-2 text-small text-ink-soft">{d.summary}</p>
                        <div className="mt-auto flex gap-2 pt-4">
                          <Button asChild size="sm"><Link to={`/publications/document/${d.id}`}><Eye />View</Link></Button>
                          <Button size="sm" variant="secondary" onClick={() => downloadDoc(d)} aria-label={`Download ${d.title}`}><Download />PDF · {d.sizeMb} MB</Button>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <NotFoundState action={<Button variant="secondary" onClick={() => { setQ(""); setSel({}); }}>Reset search</Button>}>No public documents match. Try a broader term or remove a filter.</NotFoundState>
            )}

            <p className="mt-12 border-l-2 border-ecowas-yellow pl-4 text-small text-muted-foreground">Sample records shown for design purposes. Only documents authorised for public release appear in this library.</p>
          </div>
        </div>
      </Container>
    </>
  );
}
