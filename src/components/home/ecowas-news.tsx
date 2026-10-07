import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { ecowasNewsPath, fetchEcowasNews, type EcowasNewsItem } from "@/lib/ecowas-news-data";
import { NewsDate, NewsImage } from "@/components/ds/ecowas-editorial";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";

const ACCENTS = ["border-t-ecowas-green", "border-t-ecowas-yellow", "border-t-ecowas-brown", "border-t-ecowas-ocean"];

export function EcowasNews() {
  const [items, setItems] = useState<EcowasNewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [position, setPosition] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    setItems(null);
    setFailed(false);
    setPosition(0);
    fetchEcowasNews(12, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setItems(data); })
      .catch(() => { if (!controller.signal.aborted) { setItems([]); setFailed(true); } });
    return () => controller.abort();
  }, [retry]);

  function slide(direction: number) {
    const el = track.current;
    if (!el) return;
    const width = el.querySelector("article")?.getBoundingClientRect().width ?? el.clientWidth;
    const end = el.scrollWidth - el.clientWidth;
    const target = direction > 0 && el.scrollLeft >= end - 4 ? 0 : direction < 0 && el.scrollLeft < 4 ? end : el.scrollLeft + direction * (width + 20);
    el.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
  }

  useEffect(() => {
    if (paused || interacting || reduced || !items?.length) return;
    const timer = window.setInterval(() => slide(1), 7000);
    return () => window.clearInterval(timer);
  }, [paused, interacting, reduced, items]);

  return (
    <section aria-labelledby="ecowas-news-title" className="relative border-y border-border bg-ecowas-yellow-12 py-section-lg">
      <div className="absolute inset-x-0 top-0 h-1.5 band" aria-hidden />
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-ecowas-green pb-6">
          <div>
            <p className="overline text-primary">From across the Community</p>
            <h2 id="ecowas-news-title" className="mt-2 font-display text-h1">ECOWAS News</h2>
          </div>
          <Button asChild variant="tertiary"><Link to="/knowledge/ecowas-news">All Community news <ArrowRight aria-hidden /></Link></Button>
        </div>
        <div className="mt-7" aria-busy={items === null}>
          {items === null ? (
            <div role="status" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <span className="sr-only">Loading ECOWAS news…</span>
              {[0, 1, 2, 3].map((item) => <div key={item} className="h-96 animate-pulse bg-muted motion-reduce:animate-none" aria-hidden />)}
            </div>
          ) : failed ? (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-4 border-l-2 border-status-critical bg-card p-5">
              <p className="text-small text-ink-soft">ECOWAS news is temporarily unavailable.</p>
              <Button variant="secondary" size="sm" onClick={() => setRetry((count) => count + 1)}>Try again <ArrowRight /></Button>
            </div>
          ) : !items.length ? (
            <p className="border border-dashed border-border bg-card p-6 text-small text-muted-foreground">No ECOWAS news is available at the moment.</p>
          ) : (
            <div role="region" aria-roledescription="carousel" aria-label="Latest Community news" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
              <div ref={track} onScroll={() => {
                const el = track.current;
                if (!el) return;
                const width = el.querySelector("article")?.getBoundingClientRect().width ?? 1;
                setPosition(Math.round(el.scrollLeft / (width + 20)));
              }} className="grid auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto snap-x snap-mandatory pb-3 sm:auto-cols-[calc((100%-20px)/2)] lg:auto-cols-[calc((100%-60px)/4)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((item, index) => <article key={item.id} aria-roledescription="slide" aria-label={`${index + 1} of ${items.length}`} className={cn("min-w-0 snap-start border border-border border-t-4 bg-card", ACCENTS[index % ACCENTS.length])}>
                  <Link to={ecowasNewsPath(item.id)} className="group flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                    <NewsImage item={item} className="aspect-[4/3] w-full" />
                    <div className="flex flex-1 flex-col p-5">
                      <p className="border-l-2 border-ecowas-green pl-2 text-xs font-semibold text-primary">{item.source}</p>
                      <div className="mt-2"><NewsDate value={item.publishedAt} /></div>
                      <h3 className="mt-4 line-clamp-4 break-words font-display text-lg font-bold leading-snug text-ink group-hover:text-primary">{item.title}</h3>
                      <p className="mt-3 line-clamp-3 text-small text-ink-soft">{item.summary}</p>
                      <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-small font-semibold text-primary">Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden /></span>
                    </div>
                  </Link>
                </article>)}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-ecowas-green/25 pt-5">
                <p className="text-small font-semibold text-primary">Latest Community updates</p>
                <div className="flex items-center gap-2">
                  <span className="mr-2 font-mono text-xs text-muted-foreground" aria-live={paused ? "polite" : "off"}>{position + 1} / {items.length}</span>
                  {!reduced && <Button variant="ghost" size="icon" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play news slider" : "Pause news slider"} title={paused ? "Play news slider" : "Pause news slider"}>{paused ? <Play /> : <Pause />}</Button>}
                  <Button variant="secondary" size="icon" onClick={() => slide(-1)} aria-label="Previous news" title="Previous news"><ArrowLeft /></Button>
                  <Button size="icon" onClick={() => slide(1)} aria-label="Next news" title="Next news"><ArrowRight /></Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
