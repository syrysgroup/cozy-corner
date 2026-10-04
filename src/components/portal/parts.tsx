import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ds/primitives";
import { riskStatus, type Risk } from "@/lib/portal/portal-data";
import { useAccess, type Permission } from "@/lib/portal/access";

export function PageHead({ overline, title, lead, actions }: { overline: string; title: string; lead?: string; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">{overline}</p>
        <h1 className="mt-2 font-display text-h2 text-ink">{title}</h1>
        {lead && <p className="mt-2 max-w-2xl text-small text-ink-soft">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({ title, meta, children, className, action }: { title?: string; meta?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={cn("min-w-0 border border-border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-small font-semibold text-ink">{title}{meta && <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">{meta}</span>}</h2>
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Metric({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: string; tone?: "critical" | "warning" | "positive" }) {
  return (
    <div className="border border-border bg-card px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className={cn("num mt-2 font-display text-[1.9rem] font-bold leading-none text-ink", tone === "critical" && "text-status-critical", tone === "warning" && "text-status-warning", tone === "positive" && "text-status-positive")}>{value}</p>
      {sub && <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function RiskTag({ r }: { r: Risk }) {
  return <StatusBadge status={riskStatus(r)}>{r}</StatusBadge>;
}

export function Restricted({ need, title = "Access restricted", children }: { need: Permission; title?: string; children?: ReactNode }) {
  const { session } = useAccess();
  return (
    <div className="grid place-items-center border border-dashed border-border bg-surface-sunken px-6 py-16 text-center">
      <Lock className="size-6 text-muted-foreground" aria-hidden />
      <h2 className="mt-3 font-display text-h4">{title}</h2>
      <p className="mt-2 max-w-md text-small text-ink-soft">{children ?? <>Your role (<strong>{session.role.label}</strong>) does not include <code className="font-mono text-xs">{need}</code>. Request access from an administrator if this is part of your duties.</>}</p>
    </div>
  );
}

/** Renders children only when allowed; otherwise an explanation. */
export function Gate({ need, children }: { need: Permission; children: ReactNode }) {
  const { can } = useAccess();
  return can(need) ? <>{children}</> : <Restricted need={need} />;
}

export function Table({ head, children, className }: { head: string[]; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-small">
        <thead><tr className="border-b border-border text-left text-xs uppercase tracking-[0.06em] text-muted-foreground">{head.map((h) => <th key={h} scope="col" className="whitespace-nowrap px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
        <tbody className="[&>tr]:border-b [&>tr]:border-border/60 [&>tr:hover]:bg-muted/50 [&_td]:px-3 [&_td]:py-2.5 [&_td]:align-middle">{children}</tbody>
      </table>
    </div>
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full bg-muted", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}

export function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: readonly T[]; onChange: (v: NoInfer<T>) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap border border-border bg-card p-0.5">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)}
          className={cn("min-h-9 px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ink", value === o && "bg-ink text-background hover:text-background")}>{o}</button>
      ))}
    </div>
  );
}
