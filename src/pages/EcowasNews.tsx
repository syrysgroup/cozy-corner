import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Search } from "lucide-react";
import { Container } from "@/components/ds/shell/layout-parts";
import { Button } from "@/components/ds/primitives";
import { ecowasNewsPath, fetchEcowasArticle, fetchEcowasNews, type EcowasNewsItem } from "@/lib/ecowas-news-data";

import { EditorialLead, EditorialHeadlines, NewsImage, NewsDate } from "@/components/ds/ecowas-editorial";
import { EcowasNewsGrid } from "@/components/ds/ecowas-news-grid";

export default function EcowasNewsPage() {
  const { id } = useParams();
  const [items, setItems] = useState<EcowasNewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setItems(null);
    setFailed(false);
    const request = id ? fetchEcowasArticle(id, controller.signal).then((article) => article ? [article] : []) : fetchEcowasNews(24, controller.signal);
    request.then(setItems).catch(() => { if (!controller.signal.aborted) { setFailed(true); setItems([]); } });
    return () => controller.abort();
  }, [id, retry]);
  const article = items?.[0];
  const filtered = (items ?? []).filter((item) => `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase()));
  if (!id) return <Container as="section" className="py-section-lg">
    <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-small text-primary hover:underline"><ArrowLeft className="size-4" />Home</Link>
    <header className="mt-6 border-b-2 border-ink pb-6">
      <p className="overline text-primary">Official updates from the Community</p>
      <h1 className="mt-3 font-display text-h1">ECOWAS News</h1>
    </header>
    <EcowasNewsGrid />
  </Container>;
  return (
    <Container as="section" className="py-section-lg">
      <Link to={id ? "/knowledge/ecowas-news" : "/"} className="inline-flex min-h-11 items-center gap-2 text-small text-primary hover:underline"><ArrowLeft className="size-4" />{id ? "ECOWAS News" : "Home"}</Link>
      <p className="overline mt-6 text-primary">Official updates from the Community</p>
      {!id && <div className="mt-3 flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-6"><h1 className="font-display text-h1">ECOWAS News</h1><p className="max-w-sm text-small text-muted-foreground">Official Community dispatches · ECOWAS</p></div>}
      {items === null ? <p role="status" className="py-12 text-muted-foreground">Loading ECOWAS news…</p> : failed ? (
        <div role="alert" className="my-8 border-l-2 border-status-critical py-4 pl-5"><p>ECOWAS news is temporarily unavailable.</p><Button variant="secondary" className="mt-4" onClick={() => setRetry((value) => value + 1)}>Try again <ArrowRight /></Button></div>
      ) : !article ? <div className="py-12"><h1 className="font-display text-h2">{id ? "Article not found" : "No news available"}</h1><p className="mt-4 text-muted-foreground">{id ? "This update is not available in the official ECOWAS news feed." : "Check back for the latest Community updates."}</p></div> : id ? (
        <article className="mt-4">
          <header className="border-b-2 border-ink pb-8">
            <h1 className="max-w-5xl font-display text-3xl font-bold leading-tight md:text-5xl">{article.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-4"><NewsDate value={article.publishedAt} /><span className="text-xs font-semibold text-primary">Published by ECOWAS</span></div>
          </header>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="min-w-0">
              <NewsImage item={article} className="aspect-[16/9] w-full" />
              <div className="mx-auto mt-8 max-w-3xl space-y-6 text-body leading-relaxed text-ink-soft">
                {article.body.length ? article.body.map((block, index) => block.type === "heading" ? <h2 key={index} className="pt-4 font-display text-h3 text-ink">{block.text}</h2> : block.type === "quote" ? <blockquote key={index} className="border-l-2 border-primary pl-6 text-lead">{block.text}</blockquote> : block.type === "list" ? <ul key={index} className="list-disc space-y-2 pl-6">{block.items?.map((text, i) => <li key={i}>{text}</li>)}</ul> : <p key={index} className={index === 0 ? "text-lead font-semibold text-ink" : undefined}>{block.text}</p>) : <><p className="text-lead">{article.summary}</p><p className="text-small text-muted-foreground">Only the official summary is available here. Read the original for the complete article.</p></>}
              </div>
            </div>
            <aside className="self-start border-t-2 border-primary pt-4 lg:sticky lg:top-20">
              <p className="overline text-primary">Official source</p>
              <p className="mt-3 text-small text-ink-soft">Economic Community of West African States</p>
              <Button asChild variant="tertiary" className="mt-4 max-w-full whitespace-normal text-left"><a href={article.href} target="_blank" rel="noreferrer">Read original <ExternalLink /><span className="sr-only">(opens in a new tab)</span></a></Button>
              <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">Available text reproduced from the official ECOWAS feed. This is Community reporting, not an OAG audit finding.</p>
              <Link to="/knowledge/ecowas-news" className="mt-6 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary">All dispatches <ArrowRight className="size-4" /></Link>
            </aside>
          </div>
        </article>
      ) : (
        <>
          <label className="mt-8 flex max-w-lg items-center gap-3 border border-input px-3"><Search className="size-4 text-muted-foreground" aria-hidden /><span className="sr-only">Search Community news</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Community news" className="h-11 min-w-0 flex-1 bg-background text-small outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
          {filtered.length ? <>
            <div className="mt-8 grid gap-10 border-b border-border pb-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"><EditorialLead item={filtered[0]} />{filtered.length > 1 && <EditorialHeadlines items={filtered.slice(1, 4)} />}</div>
            <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">{filtered.slice(4).map((item) => <article key={item.id}><Link to={ecowasNewsPath(item.id)} className="group block"><NewsImage item={item} className="mb-4 aspect-[16/9] w-full" /><NewsDate value={item.publishedAt} /><h2 className="mt-2 font-display text-xl font-bold leading-snug group-hover:text-primary">{item.title}</h2><p className="mt-3 line-clamp-3 text-small text-muted-foreground">{item.summary}</p><span className="mt-4 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary">Read article <ArrowRight className="size-4" /></span></Link></article>)}</div>
          </> : <div className="py-12"><p>No Community news matches your search.</p><Button variant="tertiary" className="mt-4" onClick={() => setQuery("")}>Clear search</Button></div>}
        </>
      )}
    </Container>
  );
}