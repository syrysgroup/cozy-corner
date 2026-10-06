import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { fetchEcowasNews, type EcowasNewsItem } from "@/lib/ecowas-news-data";
import { EditorialLead, EditorialHeadlines } from "@/components/ds/ecowas-editorial";

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
    <section aria-labelledby="ecowas-news-title" className="border-y border-border bg-background py-section-lg">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-ink pb-6">
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
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
              <EditorialLead item={feature} />
              {recent.length > 0 && <EditorialHeadlines items={recent} />}
            </div>
          )}
        </div>
        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">Published by ECOWAS · Community news, distinct from Office of the Auditor General announcements.</p>
      </Container>
    </section>
  );
}