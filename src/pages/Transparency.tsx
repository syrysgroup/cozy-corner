import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { ArrowRight, FileText, Info, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, PageHeader, LoadingState } from "@/components/ds/shell/layout-parts";
import { Badge, StatusBadge } from "@/components/ds/primitives";
import { BarList, ChartFigure, ChartPatterns, Donut, KpiCard, StackedRows, TrendChart } from "@/components/ds/charts";
import { DATA_NOTICE, fetchTransparencyData, pctOf, recTotal, reportsForCountry, type TransparencyData } from "@/lib/transparency-data";
import type { Country } from "@/lib/home-data";

const TABS = [
  { slug: "dashboard", label: "Overview", title: "Transparency dashboard", lead: "A carefully selected, public view of what the Office audits, what it publishes, and whether recommendations are acted on." },
  { slug: "activity", label: "Audit activity", title: "Audit activity", lead: "How much audit work takes place, what kind, and which themes recur." },
  { slug: "recommendations", label: "Recommendations", title: "Recommendation progress", lead: "Every recommendation is tracked from issue to closure. Here is how they are progressing." },
  { slug: "institutions", label: "Institutional coverage", title: "Institutional coverage", lead: "Which ECOWAS Institutions have published audit information, and how they compare." },
  { slug: "map", label: "ECOWAS audit map", title: "ECOWAS audit map", lead: "Where the Office has published audit activity across Member States." },
] as const;

const REC_KEYS = [
  { name: "Implemented", className: "text-status-positive" },
  { name: "In progress", className: "text-ecowas-orange" },
  { name: "Not started", className: "text-status-neutral" },
];

function Notice() {
  return <p className="flex items-center gap-2 text-xs text-muted-foreground"><Info className="size-3.5" aria-hidden />{DATA_NOTICE}</p>;
}

function Story({ n, kicker, title, children }: { n: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 grid gap-3 md:grid-cols-[1fr_minmax(14rem,0.8fr)] md:items-end">
      <div><p className="overline flex gap-3"><span className="font-mono text-primary">{n}</span>{kicker}</p><h2 className="mt-3 font-display text-h2">{title}</h2></div>
      <p className="text-small text-muted-foreground">{children}</p>
    </div>
  );
}

/* ---------- Sections ---------- */
function Kpis({ d }: { d: TransparencyData }) {
  return <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">{d.kpis.map((k) => <KpiCard key={k.key} {...k} />)}</div>;
}

function ActivitySection({ d, n = "01" }: { d: TransparencyData; n?: string }) {
  const last = d.activity[d.activity.length - 1], first = d.activity[0];
  const top = d.themes[0];
  return (
    <section className="py-section-sm">
      <Story n={n} kicker="Audit activity" title="Is audit coverage growing?">Activity is measured by completed engagements and reports made public after due process.</Story>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ChartFigure question="How has audit activity changed since 2020?" answer={<>Completed audits rose from <strong>{first.audits}</strong> to <strong>{last.audits}</strong>, and published reports kept pace, from {first.reports} to {last.reports}.</>}
          table={{ head: ["Year", "Audits completed", "Reports published"], rows: d.activity.map((a) => [a.year, a.audits, a.reports]) }}>
          <TrendChart data={d.activity.map((a) => ({ label: a.year, values: [a.audits, a.reports] }))} series={[{ name: "Audits", className: "text-primary" }, { name: "Reports", className: "text-ecowas-brown" }]} />
          <p className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground"><span>● solid line, audits completed</span><span>■ dashed line, reports published</span></p>
        </ChartFigure>
        <ChartFigure question="What kinds of audit are carried out?" answer={<>Financial audits remain the core of the mandate; performance audits now make up about one in five.</>}
          table={{ head: ["Audit type", "Count"], rows: d.auditTypes.map((t) => [t.type, t.count]) }}>
          <Donut centre={String(d.auditTypes.reduce((s, t) => s + t.count, 0))} centreLabel="audits, 2025"
            data={d.auditTypes.map((t, i) => ({ label: t.type, value: t.count, className: ["text-primary", "text-ecowas-ocean", "text-ecowas-brown", "text-status-neutral"][i] }))} />
        </ChartFigure>
        <ChartFigure className="lg:col-span-2" question="Which themes appear most frequently in findings?" answer={<><strong>{top.name}</strong> is the most frequent theme ({top.count} findings), followed by procurement and asset management, areas where controls most often need strengthening.</>}
          table={{ head: ["Theme", "Findings"], rows: d.themes.map((t) => [t.name, t.count]) }}>
          <BarList data={d.themes.map((t) => ({ label: t.name, value: t.count }))} highlight={3} />
          <p className="mt-3 text-xs text-muted-foreground">Top three themes shown at full strength.</p>
        </ChartFigure>
      </div>
    </section>
  );
}

function RecommendationSection({ d, n = "02" }: { d: TransparencyData; n?: string }) {
  const t = recTotal(d.recTotals);
  const riskCls = ["text-status-positive", "text-ecowas-yellow", "text-ecowas-orange", "text-status-critical"];
  return (
    <section className="py-section-sm">
      <Story n={n} kicker="Recommendations" title="Are recommendations being acted on?">A recommendation counts as implemented only once the Office has verified the evidence.</Story>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartFigure question="How are recommendations progressing overall?" answer={<><strong>{pctOf(d.recTotals.implemented, t)}%</strong> of {t} tracked recommendations are implemented; a further {pctOf(d.recTotals.inProgress, t)}% are under way.</>}
          table={{ head: ["Status", "Recommendations", "Share"], rows: REC_KEYS.map((k, i) => { const v = [d.recTotals.implemented, d.recTotals.inProgress, d.recTotals.notStarted][i]; return [k.name, v, `${pctOf(v, t)}%`]; }) }}>
          <Donut centre={`${pctOf(d.recTotals.implemented, t)}%`} centreLabel="implemented"
            data={REC_KEYS.map((k, i) => ({ label: k.name, value: [d.recTotals.implemented, d.recTotals.inProgress, d.recTotals.notStarted][i], className: k.className }))} />
        </ChartFigure>
        <ChartFigure question="Is implementation improving year on year?" answer={<>The implemented share has grown every year, from {d.recTrend[0].implemented}% in {d.recTrend[0].year} to {d.recTrend[d.recTrend.length - 1].implemented}%.</>}
          table={{ head: ["Year issued", "Implemented %", "In progress %", "Not started %"], rows: d.recTrend.map((r) => [r.year, r.implemented, r.inProgress, r.notStarted]) }}>
          <StackedRows keys={REC_KEYS} rows={d.recTrend.map((r) => ({ label: r.year, values: [r.implemented, r.inProgress, r.notStarted] }))} />
        </ChartFigure>
        <ChartFigure question="How serious are the issues raised?" answer={<>Most findings are low or moderate risk. <strong>{d.risks[3].count}</strong> were rated critical and are prioritised for follow-up.</>}
          table={{ head: ["Risk rating", "Findings"], rows: d.risks.map((r) => [r.level, r.count]) }}>
          <div className="flex h-44 items-end gap-3" role="img" aria-label={d.risks.map((r) => `${r.level} ${r.count}`).join(", ")}>
            {d.risks.map((r, i) => {
              const max = Math.max(...d.risks.map((x) => x.count));
              return (
                <div key={r.level} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <span className="num text-small font-semibold">{r.count}</span>
                  <span className={cn("w-full origin-bottom animate-rise-in relative border-t-4 border-current motion-reduce:animate-none", riskCls[i])} style={{ height: `${(r.count / max) * 75}%`, animationDelay: `${i * 80}ms` }}><span className="absolute inset-0 bg-current opacity-15" /></span>
                  <span className="text-xs font-semibold">{"▲".repeat(i + 1)}</span>
                  <span className="text-xs text-muted-foreground">{r.level}</span>
                </div>
              );
            })}
          </div>
        </ChartFigure>
        <ChartFigure question="What has happened recently?" answer="Key public milestones in the audit cycle." table={{ head: ["Date", "Milestone", "Type"], rows: d.timeline.map((m) => [m.date, m.title, m.kind]) }}>
          <ol className="relative ml-2 border-l border-border">
            {d.timeline.map((m) => (
              <li key={m.title} className="relative pb-4 pl-5 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-primary bg-card" aria-hidden />
                <p className="text-xs text-muted-foreground">{m.date} · <span className="font-semibold">{m.kind}</span></p>
                <p className="text-small">{m.title}</p>
              </li>
            ))}
          </ol>
        </ChartFigure>
      </div>
    </section>
  );
}

function InstitutionSection({ d, n = "03" }: { d: TransparencyData; n?: string }) {
  const [metric, setMetric] = useState<"reports" | "impl">("reports");
  const rows = [...d.institutions].map((i) => ({ ...i, impl: pctOf(i.recs.implemented, recTotal(i.recs)) }))
    .sort((a, b) => (metric === "reports" ? b.reportsPublished - a.reportsPublished : b.impl - a.impl));
  return (
    <section className="py-section-sm">
      <Story n={n} kicker="Institutional coverage" title="Which institutions have published audit information?">All institutions within the mandate have at least one published report. Compare them by volume or by follow-through.</Story>
      <ChartFigure question={metric === "reports" ? "Which institutions have the most published reports?" : "Which institutions implement recommendations most fully?"}
        answer={metric === "reports" ? <>The {rows[0].short} accounts for the largest share, reflecting the size of its budget and mandate.</> : <>{rows[0].short} leads with {rows[0].impl}% of its recommendations implemented.</>}
        table={{ head: ["Institution", "Audits", "Reports published", "Implemented %", "Last published"], rows: rows.map((i) => [i.name, i.audits, i.reportsPublished, `${i.impl}%`, i.lastPublished]) }}>
        <div role="radiogroup" aria-label="Compare by" className="mb-5 inline-flex border border-border text-small">
          {([["reports", "Reports published"], ["impl", "Implementation rate"]] as const).map(([k, l]) => (
            <button key={k} role="radio" aria-checked={metric === k} onClick={() => setMetric(k)} className={cn("px-3 py-1.5 font-semibold transition-colors", metric === k ? "bg-ink text-background" : "hover:bg-muted")}>{l}</button>
          ))}
        </div>
        <BarList key={metric} unit={metric === "impl" ? "%" : ""} data={rows.map((i) => ({ label: i.short, sub: i.country, value: metric === "reports" ? i.reportsPublished : i.impl }))} />
      </ChartFigure>
    </section>
  );
}

function MapSection({ d, n = "04" }: { d: TransparencyData; n?: string }) {
  const [sel, setSel] = useState<Country | null>(null);
  const [more, setMore] = useState(false);
  useEffect(() => setMore(false), [sel]);
  const reports = sel ? reportsForCountry(sel.name) : [];
  const t = sel ? recTotal(sel.recs) : 0;
  return (
    <section className="py-section-sm">
      <Story n={n} kicker="Regional map" title="Where has OAG published audit activity?">Select a Member State. A short summary appears first; open details only if you need them.</Story>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="border border-border bg-card p-4 md:p-6">
          <svg viewBox="0 0 100 80" className="h-auto w-full" role="group" aria-label="Schematic map of ECOWAS Member States">
            <defs><pattern id="tmap-dots" width="2.5" height="2.5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.35" className="fill-border" /></pattern></defs>
            <path d="M8 22 Q20 14 40 16 L62 18 Q80 22 84 40 Q82 56 72 64 L58 68 Q40 72 26 72 Q14 66 10 54 Q4 40 8 22Z" fill="url(#tmap-dots)" className="stroke-border" strokeWidth="0.3" />
            {d.countries.map((c) => {
              const on = sel?.code === c.code, r = 2 + c.audits * 0.45;
              return (
                <g key={c.code} tabIndex={0} role="button" aria-pressed={on} aria-label={`${c.name}: ${c.audits} audits, ${c.findings} published findings`}
                  onClick={() => setSel(on ? null : c)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(on ? null : c); } }}
                  className="cursor-pointer outline-none [&:focus-visible>circle:last-of-type]:stroke-ring [&:focus-visible>circle:last-of-type]:[stroke-width:1]">
                  {on && <circle cx={c.x} cy={c.y} r={r + 2.5} className="fill-primary/15 motion-safe:animate-pulse" />}
                  <circle cx={c.x} cy={c.y} r={r} strokeWidth="0.5" className={cn("transition-all duration-base", on ? "fill-primary stroke-primary" : "fill-card stroke-primary/60 hover:fill-primary-soft")} />
                  <text x={c.x} y={c.y + r + 3} textAnchor="middle" className={cn("pointer-events-none select-none text-[2.2px] font-semibold", on ? "fill-ink" : "fill-muted-foreground")}>{c.code}</text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-xs text-muted-foreground">Schematic, not to scale. Circle size reflects the number of audits; labels show country codes.</p>
        </div>
        <aside aria-live="polite" className="border border-border bg-card p-6 md:p-7">
          {!sel ? (
            <div className="flex h-full flex-col justify-center">
              <MapPin className="size-6 text-primary" aria-hidden />
              <h3 className="mt-3 font-display text-h4">Choose a Member State</h3>
              <p className="mt-2 text-small text-muted-foreground">Click or press Enter on a circle. Nigeria hosts most institutional headquarters, so it shows the most activity.</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {[...d.countries].sort((a, b) => b.audits - a.audits).slice(0, 4).map((c) => <li key={c.code}><button onClick={() => setSel(c)} className="border border-border px-2.5 py-1 text-xs font-semibold hover:border-primary hover:text-primary">{c.name}</button></li>)}
              </ul>
            </div>
          ) : (
            <div key={sel.code} className="animate-fade-in motion-reduce:animate-none">
              <div className="flex items-start justify-between gap-3">
                <div><p className="overline text-primary">Member State</p><h3 className="mt-2 font-display text-h3">{sel.name}</h3></div>
                <button onClick={() => setSel(null)} aria-label="Clear selection" className="grid size-8 place-items-center hover:bg-muted"><X className="size-4" /></button>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-4">
                <div><dt className="text-xs text-muted-foreground">Audits</dt><dd className="num font-display text-2xl font-bold">{sel.audits}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Published findings</dt><dd className="num font-display text-2xl font-bold">{sel.findings}</dd></div>
              </dl>
              <p className="mt-4 text-small"><strong>{pctOf(sel.recs.implemented, t)}%</strong> of {t} recommendations implemented.</p>
              {!more ? (
                <button onClick={() => setMore(true)} aria-expanded={false} className="mt-4 inline-flex items-center gap-1.5 text-small font-semibold text-primary underline-offset-4 hover:underline">Show institutions and reports <ArrowRight className="size-3.5" /></button>
              ) : (
                <div className="mt-5 grid gap-5 animate-fade-in motion-reduce:animate-none">
                  <div><p className="text-small font-semibold">Institutions</p><ul className="mt-2 flex flex-wrap gap-2">{sel.institutions.map((i) => <li key={i}><Badge tone="outline">{i}</Badge></li>)}</ul></div>
                  <div><p className="text-small font-semibold">Recommendation status</p>
                    <ul className="mt-2 grid gap-1.5 text-small">
                      <li className="flex justify-between"><StatusBadge status="positive" /><span className="num">{sel.recs.implemented}</span></li>
                      <li className="flex justify-between"><StatusBadge status="attention">In progress</StatusBadge><span className="num">{sel.recs.inProgress}</span></li>
                      <li className="flex justify-between"><StatusBadge status="neutral" /><span className="num">{sel.recs.notStarted}</span></li>
                    </ul>
                  </div>
                  <div><p className="text-small font-semibold">Related reports</p>
                    {reports.length ? <ul className="mt-2 grid gap-2">{reports.map((r) => <li key={r.id}><Link to={`/publications/document/${r.id}`} className="flex gap-2 text-small hover:text-primary"><FileText className="mt-0.5 size-4 shrink-0" aria-hidden />{r.title}</Link></li>)}</ul>
                      : <p className="mt-2 text-small text-muted-foreground">No public reports in the library yet. <Link to="/publications" className="text-primary underline-offset-4 hover:underline">Browse all publications</Link></p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
      <details className="mt-6 border border-border bg-card p-5 text-small">
        <summary className="cursor-pointer font-semibold">View map data as a table</summary>
        <div className="mt-4 overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-border text-left"><th className="py-2 pr-4">Member State</th><th className="py-2 pr-4">Audits</th><th className="py-2 pr-4">Findings</th><th className="py-2 pr-4">Implemented</th></tr></thead>
          <tbody>{d.countries.map((c) => <tr key={c.code} className="border-b border-border/60"><th scope="row" className="py-2 pr-4 text-left font-normal">{c.name}</th><td className="num py-2 pr-4">{c.audits}</td><td className="num py-2 pr-4">{c.findings}</td><td className="num py-2 pr-4">{pctOf(c.recs.implemented, recTotal(c.recs))}%</td></tr>)}</tbody></table></div>
      </details>
    </section>
  );
}

/* ---------- Page ---------- */
export default function Transparency() {
  const { sub } = useParams();
  const tab = TABS.find((t) => t.slug === sub) ?? TABS[0];
  const [data, setData] = useState<TransparencyData | null>(null);
  useEffect(() => { fetchTransparencyData().then(setData); }, []);

  return (
    <>
      <ChartPatterns />
      <PageHeader crumbs={[{ label: "Home", to: "/" }, { label: "Transparency", to: "/transparency" }, ...(tab.slug !== "dashboard" ? [{ label: tab.label }] : [])]} overline="Transparency & data intelligence" title={tab.title} lead={tab.lead} />
      <nav aria-label="Transparency sections" className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <Container className="flex gap-1 overflow-x-auto py-2">
          {TABS.map((t) => (
            <NavLink key={t.slug} to={t.slug === "dashboard" ? "/transparency" : `/transparency/${t.slug}`} end
              className={({ isActive }) => cn("whitespace-nowrap border-b-2 px-3 py-2 text-small font-semibold transition-colors", isActive || (t.slug === tab.slug) ? "border-primary text-ink" : "border-transparent text-muted-foreground hover:text-ink")}>{t.label}</NavLink>
          ))}
        </Container>
      </nav>
      <Container className="py-10 md:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3"><Notice />{data && <span className="text-xs text-muted-foreground">{data.updated}</span>}</div>
        {!data ? <LoadingState label="Loading dashboard" /> : (
          <>
            {tab.slug === "dashboard" && (
              <>
                <Kpis d={data} />
                <ActivitySection d={data} />
                <RecommendationSection d={data} />
                <InstitutionSection d={data} />
                <MapSection d={data} />
              </>
            )}
            {tab.slug === "activity" && <><Kpis d={data} /><ActivitySection d={data} /></>}
            {tab.slug === "recommendations" && <RecommendationSection d={data} n="01" />}
            {tab.slug === "institutions" && <InstitutionSection d={data} n="01" />}
            {tab.slug === "map" && <MapSection d={data} n="01" />}
          </>
        )}
      </Container>
    </>
  );
}
