import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Newspaper } from "lucide-react";
import { ecowasNewsPath, type EcowasNewsItem } from "@/lib/ecowas-news-data";
import { cn } from "@/lib/utils";

export function NewsDate({ value }: { value: string }) {
  return <time dateTime={value} className="text-xs text-muted-foreground">{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value))}</time>;
}

export function NewsImage({ item, className }: { item: EcowasNewsItem; className?: string }) {
  const [failed, setFailed] = useState(false);
  return <div className={cn("overflow-hidden bg-surface-sunken", className)}>{item.image && !failed ? <img src={item.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" onError={() => setFailed(true)} /> : <div className="grid h-full min-h-28 place-items-center border border-border text-muted-foreground"><Newspaper className="size-8" aria-hidden /></div>}</div>;
}

export function EditorialLead({ item }: { item: EcowasNewsItem }) {
  return <article className="min-w-0">
    <Link to={ecowasNewsPath(item.id)} className="group block">
      <NewsImage item={item} className="aspect-[16/9] w-full" />
      <div className="mt-5 flex flex-wrap items-center gap-3"><span className="overline text-primary">In focus</span><span className="h-3 border-l border-border" aria-hidden /><NewsDate value={item.publishedAt} /></div>
      <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-ink group-hover:text-primary md:text-3xl">{item.title}</h3>
      {item.summary && <p className="mt-4 max-w-2xl text-body leading-relaxed text-ink-soft">{item.summary}</p>}
      <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary">Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden /></span>
    </Link>
  </article>;
}

export function EditorialHeadlines({ items }: { items: EcowasNewsItem[] }) {
  return <div className="min-w-0 border-t-2 border-primary pt-4">
    <p className="overline text-primary">Latest dispatches</p>
    <ul className="mt-2 divide-y divide-border">{items.map((item) => <li key={item.id}>
      <Link to={ecowasNewsPath(item.id)} className="group block py-5">
        <NewsDate value={item.publishedAt} />
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink group-hover:text-primary">{item.title}</h3>
        <div className="mt-3 flex items-start gap-4">
          <NewsImage item={item} className="aspect-[4/3] w-24 shrink-0" />
          <p className="line-clamp-3 min-w-0 text-small leading-relaxed text-muted-foreground">{item.summary}</p>
        </div>
      </Link>
    </li>)}</ul>
  </div>;
}