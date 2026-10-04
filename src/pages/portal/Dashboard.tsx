import { Link } from "react-router-dom";
import { ArrowUpRight, AlertOctagon } from "lucide-react";
import { ChartPatterns, StackedRows, TrendChart } from "@/components/ds/charts";
import { Metric, PageHead, Panel, RiskTag, Gate } from "@/components/portal/parts";
import { useAccess } from "@/lib/portal/access";
import { ALERTS, AUDITS, CASES, DOCS, RECS, RISK_PROFILES, QUARTERS, daysFrom } from "@/lib/portal/portal-data";

export default function Dashboard() {
  const { can, inScope, session } = useAccess();
  const audits = AUDITS.filter((a) => inScope(a.institution));
  const recs = RECS.filter((r) => inScope(r.institution));
  const overdue = recs.filter((r) => r.status === "Overdue");
  const openCases = CASES.filter((c) => c.stage !== "Closed");
  const institutions = new Set(audits.map((a) => a.institution));
  const highRisk = RISK_PROFILES.filter((p) => p.overall >= 60 && inScope(p.institution));
  const byInst = [...new Set(recs.map((r) => r.institution))].map((i) => {
    const rs = recs.filter((r) => r.institution === i);
    return { label: i.replace("ECOWAS ", ""), values: [rs.filter((r) => ["Closed", "Verified"].includes(r.status)).length, rs.filter((r) => ["In progress", "Evidence submitted", "Open"].includes(r.status)).length, rs.filter((r) => r.status === "Overdue").length] };
  });

  return (
    <Gate need="dashboard.view">
      <ChartPatterns />
      <PageHead overline="Executive observatory" title={`Good evening, ${session.role.label}`} lead="Authorised view across audit, recommendation, risk and investigation activity. Figures respect your role and institutional scope." />
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Metric label="Active audits" value={audits.filter((a) => a.stage !== "Published").length} sub={`${audits.length} in scope`} />
        <Metric label="Institutions covered" value={institutions.size} sub="of 12 in mandate" />
        <Metric label="High-risk areas" value={highRisk.length} sub="score ≥ 60" tone="warning" />
        <Metric label="Recs implemented" value={`${Math.round((recs.filter((r) => ["Closed", "Verified"].includes(r.status)).length / Math.max(1, recs.length)) * 100)}%`} sub={`${recs.length} tracked`} tone="positive" />
        <Metric label="Overdue actions" value={overdue.length} sub="past due date" tone="critical" />
        <Metric label="Investigations" value={can("inv.view") ? openCases.length : "—"} sub={can("inv.view") ? "open cases" : "restricted"} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Alerts" meta={`${ALERTS.length} active`}>
          <ul className="divide-y divide-border">
            {ALERTS.map((a) => (
              <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <AlertOctagon className={a.level === "Critical" ? "mt-0.5 size-4 text-status-critical" : "mt-0.5 size-4 text-status-warning"} aria-hidden />
                <div className="min-w-0 flex-1"><p className="text-small font-semibold">{a.title}</p><p className="text-xs text-muted-foreground">{a.context}</p></div>
                <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">{a.at}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Audit activity" meta="audits vs reports">
          <TrendChart data={QUARTERS.map((q, i) => ({ label: q, values: [[6, 7, 8, 9, 11][i], [3, 4, 4, 6, 7][i]] }))} series={[{ name: "Audits", className: "text-primary" }, { name: "Reports", className: "text-accent" }]} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Recommendation status by institution" className="xl:col-span-2">
          <StackedRows rows={byInst} keys={[{ name: "Implemented", className: "text-status-positive" }, { name: "In progress", className: "text-ecowas-sky" }, { name: "Overdue", className: "text-status-critical" }]} />
        </Panel>
        <Panel title="Overdue actions" action={<Link to="/portal/recommendations" className="text-xs font-semibold text-primary hover:underline">All</Link>}>
          <ul className="grid gap-3">
            {overdue.map((r) => (
              <li key={r.id} className="border-l-2 border-status-critical pl-3">
                <p className="font-mono text-xs text-muted-foreground">{r.id} · {r.institution}</p>
                <p className="text-small font-semibold leading-snug">{r.title}</p>
                <p className="num text-xs text-status-critical">{-daysFrom(r.due)} days overdue</p>
              </li>
            ))}
            {!overdue.length && <li className="text-small text-muted-foreground">Nothing overdue in your scope.</li>}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="High-risk areas">
          <ul className="grid gap-2.5">
            {highRisk.map((p) => (
              <li key={p.institution} className="flex items-center justify-between gap-3 text-small">
                <span className="truncate">{p.institution}</span>
                <span className="flex items-center gap-2"><span className="num font-semibold">{p.overall}</span><RiskTag r={p.overall >= 70 ? "Critical" : "High"} /></span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Investigation workload">
          {can("inv.view") ? (
            <ul className="grid gap-2 text-small">
              {(["Intake", "Triage", "Assessment", "Investigation", "Review"] as const).map((s) => {
                const n = CASES.filter((c) => c.stage === s).length;
                return <li key={s} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3"><span>{s}</span><span className="h-2 bg-muted"><span className="block h-full bg-ecowas-ocean" style={{ width: `${n * 30}%` }} /></span><span className="num text-right font-semibold">{n}</span></li>;
              })}
            </ul>
          ) : <p className="text-small text-muted-foreground">Case-level workload is restricted for your role.</p>}
        </Panel>
        <Panel title="Recent publications">
          <ul className="grid gap-3">
            {DOCS.filter((d) => d.classification === "Public").map((d) => (
              <li key={d.id}><Link to="/portal/documents" className="group flex items-start justify-between gap-2 text-small"><span className="font-semibold group-hover:text-primary">{d.title}</span><ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden /></Link><p className="font-mono text-xs text-muted-foreground">{d.updated}</p></li>
            ))}
          </ul>
        </Panel>
      </div>
    </Gate>
  );
}
