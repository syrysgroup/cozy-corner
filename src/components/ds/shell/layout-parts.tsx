import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, AlertOctagon, CheckCircle2, SearchX, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ds/primitives";

/* Containers: one site width, one reading width. */
export function Container({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "header" | "footer" | "nav" }) {
  return <Tag className={cn("mx-auto w-full max-w-[82rem] px-5 md:px-8 xl:px-12", className)}>{children}</Tag>;
}
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("max-w-[42rem]", className)}>{children}</div>;
}

export type Crumb = { label: string; to?: string };
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-small text-muted-foreground">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
            {c.to && i < items.length - 1 ? (
              <Link to={c.to} className="underline-offset-4 hover:text-primary hover:underline">{c.label}</Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ crumbs, overline, title, lead }: { crumbs: Crumb[]; overline?: string; title: string; lead?: string }) {
  return (
    <div className="border-b border-border bg-surface-sunken">
      <Container className="py-10 md:py-16">
        <Breadcrumbs items={crumbs} />
        {overline && <p className="overline mt-8 text-primary">{overline}</p>}
        <h1 className="mt-3 max-w-4xl font-display text-h1">{title}</h1>
        {lead && <p className="mt-4 max-w-[42rem] text-lead text-ink-soft">{lead}</p>}
      </Container>
    </div>
  );
}

/* ---------- Global states ---------- */
function StateFrame({ icon, tone, title, children, action }: { icon: ReactNode; tone: string; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-4 border border-border bg-card p-6 md:p-8">
      <span className={cn("grid size-11 place-items-center rounded-full border", tone)} aria-hidden>{icon}</span>
      <div>
        <h3 className="font-display text-h4">{title}</h3>
        {children && <p className="mt-1.5 max-w-md text-small text-muted-foreground">{children}</p>}
      </div>
      {action}
    </div>
  );
}

export function LoadingState({ label = "Loading content" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="border border-border bg-card p-6 md:p-8">
      <span className="sr-only">{label}…</span>
      <div className="grid gap-3" aria-hidden>
        {["w-1/3", "w-11/12", "w-4/5", "w-2/3"].map((w, i) => (
          <div key={i} className={cn("relative h-3.5 overflow-hidden bg-muted", w, i === 0 && "h-5")}>
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-background/70 to-transparent motion-reduce:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}
export function EmptyState({ title = "Nothing here yet", children, action }: { title?: string; children?: ReactNode; action?: ReactNode }) {
  return <StateFrame icon={<Inbox className="size-5" />} tone="border-status-neutral/30 text-status-neutral" title={title} action={action}>{children ?? "When items are published they will appear here."}</StateFrame>;
}
export function ErrorState({ title = "Something went wrong", children, onRetry }: { title?: string; children?: ReactNode; onRetry?: () => void }) {
  return <div role="alert"><StateFrame icon={<AlertOctagon className="size-5" />} tone="border-status-critical/30 text-status-critical" title={title} action={onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button>}>{children ?? "We couldn’t load this content. Please try again."}</StateFrame></div>;
}
export function SuccessState({ title = "Submitted", children, action }: { title?: string; children?: ReactNode; action?: ReactNode }) {
  return <div role="status"><StateFrame icon={<CheckCircle2 className="size-5" />} tone="border-status-positive/30 text-status-positive" title={title} action={action}>{children ?? "Your request has been received."}</StateFrame></div>;
}
export function NotFoundState({ title = "No results found", children, action }: { title?: string; children?: ReactNode; action?: ReactNode }) {
  return <StateFrame icon={<SearchX className="size-5" />} tone="border-status-info/30 text-status-info" title={title} action={action}>{children ?? "Try a different term or browse by category."}</StateFrame>;
}
