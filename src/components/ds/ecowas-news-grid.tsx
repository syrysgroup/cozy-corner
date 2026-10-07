import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { NewsDate, NewsImage } from "@/components/ds/ecowas-editorial";
import { ecowasNewsPath, fetchEcowasNewsPage, type EcowasNewsPageResult } from "@/lib/ecowas-news-data";

const PAGE_SIZES = [10, 20, 30, 50];

export function EcowasNewsGrid() {
  const [params, setParams] = useSearchParams();
  const requestedPage = Number(params.get("page") ?? 1);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const requestedSize = Number(params.get("limit") ?? 20);
  const limit = PAGE_SIZES.includes(requestedSize) ? requestedSize : 20;
  const query = params.get("q") ?? "";
  const [draft, setDraft] = useState(query);
  const [result, setResult] = useState<EcowasNewsPageResult | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => setDraft(query), [query]);
  useEffect(() => {
    const controller = new AbortController();
    setResult(null);
    setFailed(false);
    fetchEcowasNewsPage({ page, limit, query, signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setResult(data); })
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [page, limit, query, retry]);

  function update(next: { page?: number; limit?: number; query?: string }) {
    const updated = new URLSearchParams(params);
    updated.set("page", String(next.page ?? 1));
    updated.set("limit", String(next.limit ?? limit));
    const term = (next.query ?? query).trim();
    if (term) updated.set("q", term); else updated.delete("q");
    setParams(updated);
  }

  const start = (page - 1) * limit + 1;
  const end = start + (result?.items.length ?? 0) - 1;
  const numberedPages = result?.totalPages ? Array.from({ length: Math.min(5, result.totalPages) }, (_, index) => Math.max(1, Math.min(page - 2, result.totalPages - 4)) + index) : [];

  return <>
    <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
      <form onSubmit={(event) => { event.preventDefault(); update({ query: draft }); }} className="flex w-full max-w-lg items-center gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="sr-only">Search Community news</span>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Search Community news" className="h-11 min-w-0 flex-1 bg-transparent text-small outline-none" />
        </label>
        <Button type="submit" size="icon" className="h-11 w-11 shrink-0" aria-label="Search news" title="Search news"><Search /></Button>
        {query && <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" onClick={() => update({ query: "" })} aria-label="Clear search" title="Clear search"><RotateCcw /></Button>}
      </form>
      <label className="flex items-center gap-3 text-small text-ink-soft">Stories per page
        <select aria-label="Stories per page" value={limit} onChange={(event) => update({ limit: Number(event.target.value) })} className="h-11 rounded-md border border-input bg-background px-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
    </div>
    <div aria-live="polite" aria-busy={!result && !failed}>
      <div className="flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
        <p>{result ? result.items.length ? `${start}–${end}${result.total !== null ? ` of ${result.total}` : ""} stories${query ? ` for “${query}”` : ""}` : "No stories found" : failed ? "News unavailable" : "Loading stories…"}</p>
        <p>Page {page}{result?.totalPages ? ` of ${result.totalPages}` : ""}</p>
      </div>
      {failed ? <div role="alert" className="border-l-2 border-status-critical py-8 pl-5"><p>ECOWAS news is temporarily unavailable.</p><Button variant="secondary" className="mt-4" onClick={() => setRetry((value) => value + 1)}>Try again <ArrowRight /></Button></div>
        : !result ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" role="status"><span className="sr-only">Loading ECOWAS news…</span>{Array.from({ length: limit }, (_, index) => <div key={index} aria-hidden className="space-y-4"><div className="aspect-[4/3] animate-pulse bg-muted motion-reduce:animate-none" /><div className="h-3 w-2/3 animate-pulse bg-muted motion-reduce:animate-none" /><div className="h-16 animate-pulse bg-muted motion-reduce:animate-none" /></div>)}</div>
        : result.items.length ? <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" aria-label="News stories">
          {result.items.map((item) => <article key={item.id} className="min-w-0 border-b border-border pb-5">
            <Link to={ecowasNewsPath(item.id)} className="group flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <NewsImage item={item} className="aspect-[4/3] w-full" />
              <div className="mt-4 flex flex-col items-start gap-2"><span className="border-l-2 border-primary pl-2 text-xs font-semibold text-primary">{item.source}</span><NewsDate value={item.publishedAt} /></div>
              <h2 className="mt-3 break-words font-display text-lg font-bold leading-snug text-ink group-hover:text-primary">{item.title}</h2>
              <p className="mt-3 line-clamp-3 text-small leading-relaxed text-muted-foreground">{item.summary}</p>
              <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-small font-semibold text-primary">Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden /></span>
            </Link>
          </article>)}
        </div> : <div className="py-12"><p>{query ? "No Community news matches your search." : "No Community news is available on this page."}</p><Button variant="tertiary" className="mt-4 min-h-11" onClick={() => update({ query: "" })}>{query ? "Clear search" : "Return to first page"}</Button></div>}
    </div>
    <nav aria-label="News pagination" className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-6">
      <Button variant="secondary" disabled={page === 1 || !result} onClick={() => update({ page: page - 1 })}><ArrowLeft /> Previous</Button>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {numberedPages.length ? numberedPages.map((number) => <Button key={number} variant={number === page ? "primary" : "ghost"} size="icon" className="h-11 w-11" aria-label={`Page ${number}`} aria-current={number === page ? "page" : undefined} onClick={() => update({ page: number })}>{number}</Button>) : <span className="text-small text-muted-foreground">Page {page}</span>}
      </div>
      <Button variant="secondary" disabled={!result?.hasNext} onClick={() => update({ page: page + 1 })}>Next <ArrowRight /></Button>
    </nav>
  </>;
}