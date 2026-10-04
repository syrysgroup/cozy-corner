import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
  className,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 grid gap-4 border-b border-border pb-5 md:grid-cols-[1fr_minmax(14rem,0.7fr)] md:items-end", className)}>
      <div>
        <p className="overline mb-3 flex items-center gap-3"><span className="font-mono text-primary">{index}</span>{eyebrow}</p>
        <h2 className="font-display text-h2">{title}</h2>
      </div>
      {children && <p className="max-w-xl text-small text-muted-foreground">{children}</p>}
    </div>
  );
}

export function Specimen({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 border-t border-border pt-4", className)}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function MetricCard({ label, value, change, note }: { label: string; value: string; change: string; note: string }) {
  return (
    <article className="metric-card min-w-0 border-l-2 border-primary pl-4">
      <p className="text-small text-muted-foreground">{label}</p>
      <p className="num mt-2 font-display text-3xl font-bold text-ink">{value}</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 text-small">
        <span className="font-semibold text-status-positive">{change}</span>
        <span className="text-muted-foreground">{note}</span>
      </p>
    </article>
  );
}

export function EditorialCard({ image, imageAlt, category, title, summary, date }: {
  image: string;
  imageAlt: string;
  category: string;
  title: string;
  summary: string;
  date: string;
}) {
  return (
    <article className="group overflow-hidden border border-border bg-card transition-shadow duration-base hover:shadow-raised">
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        <img src={image} alt={imageAlt} className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-[1.025]" />
      </div>
      <div className="p-5 md:p-6">
        <p className="overline text-primary">{category}</p>
        <h3 className="mt-3 font-display text-h3">{title}</h3>
        <p className="mt-2 text-small text-muted-foreground">{summary}</p>
        <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">{date}</p>
      </div>
    </article>
  );
}

export function DocumentCard({ title, kind, code, year }: { title: string; kind: string; code: string; year: string }) {
  return (
    <article className="flex h-full flex-col border border-border bg-card p-5 transition-shadow duration-base hover:shadow-raised">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-11 shrink-0 place-items-center border border-border bg-surface-sunken font-mono text-xs font-bold text-accent">PDF</span>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{kind}</span>
      </div>
      <h3 className="mt-5 font-display text-h4">{title}</h3>
      <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <span>{code}</span><span>{year}</span>
      </div>
    </article>
  );
}

export function Field({ label, id, hint, error, children }: { label: string; id: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-small font-semibold text-ink">{label}</label>
      {children}
      {error ? <p className="text-xs font-semibold text-status-critical" role="alert">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function FormControl({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("form-control w-full", className)} />;
}