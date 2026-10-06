import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { ecowasNewsPath, fetchEcowasNews, type EcowasNewsItem } from "@/lib/ecowas-news-data";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function ArticleDate({ value }: { value: string }) {
  return <time dateTime={value} className="text-xs text-muted-foreground">{formatDate(value)}</time>;
}

export function EcowasNews() {
  const [items, setItems] = useState<EcowasNewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setItems(null);
    setFailed(false);
    fetchEcowasNews(4, controller.signal)
      .then(setItems)
      .catch(() => {
        if (!controller.signal.aborted) {
          setItems([]);
          setFailed(true);
        }
      });
    return () => controller.abort();
  }, [retry]);

  const [feature, ...recent] = items ?? [];

  return (
    <section aria-labelledby="ecowas-news-title" className="border-y border-border bg-surface-sunken py-section-lg">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
          <div>
            <p className="overline text-primary">Official updates from the Community</p>
            <h2 id="ecowas-news-title" className="mt-2 font-display text-h1">ECOWAS News</h2>
          </div>
          <Link to="/knowledge/ecowas-news" className="group inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary underline-offset-4 hover:underline">
            More from ECOWAS <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <div className="mt-8" aria-live="polite">
          {items === null ? (
            <div role="status" className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <span className="sr-only">Loading ECOWAS news…</span>
              <div className="aspect-[16/9] animate-pulse bg-muted motion-reduce:animate-none" aria-hidden />
              <div className="grid content-start gap-5" aria-hidden>
                {[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse border-b border-border bg-muted/70 motion-reduce:animate-none" />)}
              </div>
            </div>
          ) : failed ? (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-4 border-l-2 border-status-critical bg-card p-5">
              <p className="text-small text-ink-soft">ECOWAS news is temporarily unavailable.</p>
              <Button variant="secondary" size="sm" onClick={() => setRetry((count) => count + 1)}>Try again <ArrowRight /></Button>
            </div>
          ) : !feature ? (
            <p className="border border-dashed border-border bg-card p-6 text-small text-muted-foreground">No ECOWAS news is available at the moment.</p>
          ) : (
            <div className="grid gap-9 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
              <article>
                <Link to={ecowasNewsPath(feature.id)} className="group block">
                  {feature.image && <img src={feature.image} alt="" loading="lazy" decoding="async" className="aspect-[16/9] w-full bg-muted object-cover" />}
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="overline text-primary">Latest</span>
                    <span className="size-1 rounded-full bg-ecowas-yellow" aria-hidden />
                    <ArticleDate value={feature.publishedAt} />
                  </div>
                  <h3 className="mt-2 max-w-3xl font-display text-h2 group-hover:text-primary">{feature.title}</h3>
                  {feature.summary && <p className="mt-3 max-w-2xl text-small leading-relaxed text-muted-foreground">{feature.summary}</p>}
                  <span className="mt-5 inline-flex items-center gap-2 text-small font-semibold text-primary">Read brief <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
                </Link>
              </article>

              {recent.length > 0 && (
                <ul className="divide-y divide-border border-y border-border">
                  {recent.map((item) => (
                    <li key={item.id}>
                      <Link to={ecowasNewsPath(item.id)} className="group grid min-h-28 grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 py-4">
                        {item.image && <img src={item.image} alt="" loading="lazy" decoding="async" className="aspect-square w-20 bg-muted object-cover" />}
                        <span className="min-w-0">
                          <ArticleDate value={item.publishedAt} />
                          <span className="mt-1 block font-display text-h4 group-hover:text-primary">{item.title}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}