import { useState, type ReactNode } from "react";
import { Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-motion";

/*
 * Accessible SVG charts. Every chart: (1) has a question as title, (2) direct labels
 * and patterns so colour is never the only cue, (3) a toggleable data table alternative.
 */

/** Pattern defs: solid, diagonal, dots, cross, pair with fills so series differ without colour. */
export function ChartPatterns() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <pattern id="p-diag" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" className="stroke-card" strokeWidth="1.6" /></pattern>
        <pattern id="p-dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.9" className="fill-card" /></pattern>
        <pattern id="p-cross" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 2.5H5M2.5 0V5" className="stroke-card" strokeWidth="0.9" /></pattern>
      </defs>
    </svg>
  );
}
export const PATTERNS = ["", "url(#p-diag)", "url(#p-dots)", "url(#p-cross)"];

export function Swatch({ i, className }: { i: number; className: string }) {
  return (
    <svg width="14" height="14" className={cn("shrink-0", className)} aria-hidden>
      <rect width="14" height="14" className="fill-current" />{PATTERNS[i] && <rect width="14" height="14" fill={PATTERNS[i]} />}
    </svg>
  );
}

export function ChartFigure({ question, answer, children, table, source, className }: {
  question: string; answer: ReactNode; children: ReactNode; table: { head: string[]; rows: (string | number)[][] }; source?: string; className?: string;
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <figure className={cn("flex min-w-0 flex-col border border-border bg-card p-5 md:p-7", className)}>
      <figcaption>
        <h3 className="font-display text-h4">{question}</h3>
        <p className="mt-2 max-w-prose text-small text-ink-soft">{answer}</p>
      </figcaption>
      <div className="mt-6 flex-1">{showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-small">
            <caption className="sr-only">{question}</caption>
            <thead><tr className="border-b border-border text-left">{table.head.map((h) => <th key={h} scope="col" className="py-2 pr-4 font-semibold">{h}</th>)}</tr></thead>
            <tbody>{table.rows.map((r, i) => <tr key={i} className="border-b border-border/60">{r.map((c, j) => j === 0 ? <th key={j} scope="row" className="py-2 pr-4 text-left font-normal">{c}</th> : <td key={j} className="num py-2 pr-4">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : children}</div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
        <span>{source ?? "Source: placeholder data"}</span>
        <button type="button" onClick={() => setShowTable((s) => !s)} aria-pressed={showTable} className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline">
          <Table2 className="size-3.5" aria-hidden />{showTable ? "Show chart" : "View as table"}
        </button>
      </div>
    </figure>
  );
}

export function KpiCard({ label, value, suffix, delta, question }: { label: string; value: number; suffix?: string; delta: string; question: string }) {
  const { ref, value: v } = useCountUp(value);
  return (
    <article className="flex flex-col bg-card p-6 md:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{question}</p>
      <p className="mt-5 font-display text-[clamp(2.5rem,4.5vw,3.5rem)] font-bold leading-none text-ink">
        <span ref={ref as React.RefObject<HTMLSpanElement>} className="num" aria-hidden>{Math.round(v)}{suffix}</span>
        <span className="sr-only">{value}{suffix}</span>
      </p>
      <p className="mt-2 text-small font-semibold">{label}</p>
      <p className="mt-auto pt-4 text-small text-status-positive">▲ <span className="text-muted-foreground">{delta}</span></p>
    </article>
  );
}

/** Two-series line chart with direct end labels and distinct markers (circle vs square). */
export function TrendChart({ data, series }: { data: { label: string; values: number[] }[]; series: { name: string; className: string }[] }) {
  const W = 320, H = 170, P = 26;
  const max = Math.max(...data.flatMap((d) => d.values)) * 1.15;
  const x = (i: number) => P + (i * (W - P * 3.6)) / (data.length - 1);
  const y = (v: number) => H - P - (v / max) * (H - P * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={series.map((s, si) => `${s.name}: ${data.map((d) => `${d.label} ${d.values[si]}`).join(", ")}`).join(". ")}>
      {[0.25, 0.5, 0.75, 1].map((t) => <line key={t} x1={P} x2={W - P} y1={y(max * t / 1.15)} y2={y(max * t / 1.15)} className="stroke-border" strokeWidth="0.5" />)}
      {data.map((d, i) => <text key={d.label} x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[8px]">{d.label}</text>)}
      {series.map((s, si) => {
        const pts = data.map((d, i) => `${x(i)},${y(d.values[si])}`).join(" ");
        const last = data[data.length - 1].values[si];
        return (
          <g key={s.name} className={s.className}>
            <polyline points={pts} fill="none" className={cn("stroke-current", !si && "[stroke-dasharray:600] motion-safe:animate-draw")} strokeWidth="2" strokeDasharray={si ? "5 3" : undefined} />
            {data.map((d, i) => si === 0
              ? <circle key={i} cx={x(i)} cy={y(d.values[si])} r="3" className="fill-card stroke-current" strokeWidth="1.5" />
              : <rect key={i} x={x(i) - 2.5} y={y(d.values[si]) - 2.5} width="5" height="5" className="fill-card stroke-current" strokeWidth="1.5" />)}
            <text x={x(data.length - 1) + 7} y={y(last) + 3} className="fill-current text-[8px] font-semibold">{s.name} {last}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Horizontal ranked bars with values printed on each bar. */
export function BarList({ data, highlight = 0, unit = "" }: { data: { label: string; value: number; sub?: string }[]; highlight?: number; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ol className="grid gap-3" aria-label="Ranked values">
      {data.map((d, i) => (
        <li key={d.label} className="grid grid-cols-[minmax(7rem,10rem)_1fr] items-center gap-3 text-small">
          <span className="truncate">{d.label}{d.sub && <span className="block text-xs text-muted-foreground">{d.sub}</span>}</span>
          <span className="flex items-center gap-2">
            <span className="h-5 origin-left animate-grow-x bg-primary motion-reduce:animate-none" style={{ width: `${(d.value / max) * 85}%`, opacity: i < highlight || highlight === 0 ? 1 : 0.45, animationDelay: `${i * 60}ms` }} />
            <span className="num font-semibold">{d.value}{unit}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Donut with patterned segments, centre total and a legend that carries values. */
export function Donut({ data, centre, centreLabel }: { data: { label: string; value: number; className: string }[]; centre: string; centreLabel: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 42, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,11rem)_1fr]">
      <svg viewBox="0 0 120 120" className="mx-auto w-full max-w-[11rem]" role="img" aria-label={data.map((d) => `${d.label} ${Math.round((d.value / total) * 100)}%`).join(", ")}>
        {data.map((d, i) => {
          const len = (d.value / total) * C; const off = acc; acc += len;
          return (
            <g key={d.label} className={d.className}>
              <circle cx="60" cy="60" r={R} fill="none" strokeWidth="16" className="stroke-current" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} transform="rotate(-90 60 60)" />
              {PATTERNS[i] && <circle cx="60" cy="60" r={R} fill="none" strokeWidth="16" stroke={PATTERNS[i]} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} transform="rotate(-90 60 60)" />}
            </g>
          );
        })}
        <text x="60" y="60" textAnchor="middle" className="fill-ink font-display text-[18px] font-bold">{centre}</text>
        <text x="60" y="73" textAnchor="middle" className="fill-muted-foreground text-[7px]">{centreLabel}</text>
      </svg>
      <ul className="grid gap-2 text-small">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between gap-3 border-b border-border/60 pb-2">
            <span className="flex items-center gap-2"><Swatch i={i} className={d.className} />{d.label}</span>
            <span className="num font-semibold">{d.value} <span className="font-normal text-muted-foreground">({Math.round((d.value / total) * 100)}%)</span></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 100% stacked bars per row with patterned segments and in-bar percentage labels. */
export function StackedRows({ rows, keys }: { rows: { label: string; values: number[] }[]; keys: { name: string; className: string }[] }) {
  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-4 text-xs">{keys.map((k, i) => <li key={k.name} className="flex items-center gap-1.5"><Swatch i={i} className={k.className} />{k.name}</li>)}</ul>
      <div className="grid gap-3">
        {rows.map((r) => {
          const t = r.values.reduce((a, b) => a + b, 0);
          return (
            <div key={r.label} className="grid grid-cols-[4.5rem_1fr] items-center gap-3 text-small">
              <span className="truncate font-semibold">{r.label}</span>
              <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-7 w-full" role="img" aria-label={`${r.label}: ${keys.map((k, i) => `${k.name} ${Math.round((r.values[i] / t) * 100)}%`).join(", ")}`}>
                {(() => { let acc = 0; return r.values.map((v, i) => { const w = (v / t) * 100; const xx = acc; acc += w; return (
                  <g key={i} className={keys[i].className}><rect x={xx} y="0" width={w} height="10" className="fill-current" />{PATTERNS[i] && <rect x={xx} y="0" width={w} height="10" fill={PATTERNS[i]} />}<rect x={xx} y="0" width={w} height="10" fill="none" className="stroke-card" strokeWidth="0.4" vectorEffect="non-scaling-stroke" /></g>
                ); }); })()}
              </svg>
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid grid-cols-[4.5rem_1fr] gap-3 text-xs text-muted-foreground"><span /><span className="flex justify-between"><span>0%</span><span>50%</span><span>100%</span></span></div>
    </div>
  );
}
