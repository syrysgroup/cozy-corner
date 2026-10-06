import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/ds/shell/layout-parts";
import { Button } from "@/components/ds/primitives";
import { ecowasNewsPath, fetchEcowasArticle, fetchEcowasNews, type EcowasNewsItem } from "@/lib/ecowas-news-data";

function ArticleDate({ item }: { item: EcowasNewsItem }) {
  return <time dateTime={item.publishedAt} className="text-small text-muted-foreground">{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(item.publishedAt))}</time>;
}

export default function EcowasNewsPage() {
  const { id } = useParams();
  const [items, setItems] = useState<EcowasNewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setItems(null);
    setFailed(false);
    const request = id ? fetchEcowasArticle(id, controller.signal).then((article) => article ? [article] : []) : fetchEcowasNews(24, controller.signal);
    request.then(setItems).catch(() => { if (!controller.signal.aborted) { setFailed(true); setItems([]); } });
    return () => controller.abort();
  }, [id, retry]);
  const article = items?.[0];
  return (
    <Container as="section" className="py-section-lg">
      <Link to={id ? "/knowledge/ecowas-news" : "/"} className="inline-flex min-h-11 items-center gap-2 text-small text-primary hover:underline"><ArrowLeft className="size-4" />{id ? "ECOWAS News" : "Home"}</Link>
      <p className="overline mt-6 text-primary">Official updates from the Community</p>
      {!id && <h1 className="mt-3 font-display text-h1">ECOWAS News</h1>}
      {items === null ? <p role="status" className="py-12 text-muted-foreground">Loading ECOWAS news…</p> : failed ? (
        <div role="alert" className="my-8 border-l-2 border-status-critical py-4 pl-5"><p>ECOWAS news is temporarily unavailable.</p><Button variant="secondary" className="mt-4" onClick={() => setRetry((value) => value + 1)}>Try again <ArrowRight /></Button></div>
      ) : !article ? <div className="py-12"><h1 className="font-display text-h2">{id ? "Article not found" : "No news available"}</h1><p className="mt-4 text-muted-foreground">{id ? "This update is not available in the official ECOWAS news feed." : "Check back for the latest Community updates."}</p></div> : id ? (
        <article className="mt-4">
          <h1 className="max-w-4xl font-display text-h1">{article.title}</h1>
          <div className="mt-5 flex flex-wrap gap-4"><ArticleDate item={article} /><span className="text-small text-muted-foreground">Source: ECOWAS</span></div>
          {article.image && <img src={article.image} alt="" className="mt-8 aspect-[16/9] w-full max-w-4xl bg-muted object-cover" />}
          {article.summary && <p className="mt-8 max-w-3xl text-lead leading-relaxed text-ink-soft">{article.summary}</p>}
          <Button asChild size="lg" className="mt-8 max-w-full whitespace-normal text-center"><a href={article.href} target="_blank" rel="noreferrer">Read the full article on ECOWAS <ExternalLink /><span className="sr-only">(opens in a new tab)</span></a></Button>
        </article>
      ) : (
        <div className="mt-8 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.id}><Link to={ecowasNewsPath(item.id)} className="group block">{item.image && <img src={item.image} alt="" loading="lazy" className="mb-4 aspect-[16/9] w-full bg-muted object-cover" />}<ArticleDate item={item} /><h2 className="mt-2 font-display text-h3 group-hover:text-primary">{item.title}</h2><p className="mt-3 text-small text-muted-foreground">{item.summary}</p><span className="mt-4 inline-flex items-center gap-2 text-small font-semibold text-primary">Read brief <ArrowRight className="size-4" /></span></Link></article>)}</div>
      )}
    </Container>
  );
}