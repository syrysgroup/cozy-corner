import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartPatterns, TrendChart } from "@/components/ds/charts";
import { Gate, PageHead, Panel, RiskTag } from "@/components/portal/parts";
import { useAccess } from "@/lib/portal/access";
import { ALERTS, QUARTERS, RISK_MATRIX, RISK_PROFILES, THEMES } from "@/lib/portal/portal-data";

const cellTone = (l: number, i: number) => {
  const s = (l + 1) * (i + 1);
  return s >= 15 ? "bg-status-critical/80 text-background" : s >= 8 ? "bg-ecowas-orange/60" : s >= 4 ? "bg-ecowas-yellow/45" : "bg-status-positive/20";
};
const scoreBar = (n: number) => (n >= 70 ? "bg-status-critical" : n >= 55 ? "bg-ecowas-orange" : n >= 40 ? "bg-ecowas-yellow" : "bg-status-positive");

export default function RiskPage() {
  const { inScope } = useAccess();
  const profiles = RISK_PROFILES.filter((p) => inScope(p.institution));
  const [sel, setSel] = useState(profiles[0]?.institution);
  const p = profiles.find((x) => x.institution === sel) ?? profiles[0];
  return (
    <Gate need="risk.view">
      <ChartPatterns />
      <PageHead overline="Risk intelligence" title="Risk dashboard" lead="Composite scores (0–100) derived from findings, overdue actions and integrity signals. Model is illustrative." />
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Panel title="Institution risk profiles" meta="click to inspect">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Risk scores by institution">
            <table className="w-full text-small">
              <thead><tr className="text-left text-xs uppercase tracking-[0.06em] text-muted-foreground"><th className="py-2 pr-3">Institution</th><th className="px-1">Overall</th>{p?.domains.map((d) => <th key={d.name} className="px-1 text-center">{d.name}</th>)}<th className="pl-2">Trend</th></tr></thead>
              <tbody>
                {profiles.map((r) => {
                  const delta = r.trend[r.trend.length - 1] - r.trend[0];
                  return (
                    <tr key={r.institution} onClick={() => setSel(r.institution)} className={cn("cursor-pointer border-t border-border/60 hover:bg-muted/50", sel === r.institution && "bg-primary-soft")}>
                      <th scope="row" className="py-2 pr-3 text-left font-semibold">{r.institution}</th>
                      <td className="num px-1 font-bold">{r.overall}</td>
                      {r.domains.map((d) => <td key={d.name} className="p-0.5"><div className={cn("num grid h-8 place-items-center text-xs font-semibold", d.score >= 70 ? "bg-status-critical/80 text-background" : d.score >= 55 ? "bg-ecowas-orange/50" : d.score >= 40 ? "bg-ecowas-yellow/35" : "bg-status-positive/15")}>{d.score}</div></td>)}
                      <td className={cn("num pl-2 text-xs font-semibold", delta > 0 ? "text-status-critical" : "text-status-positive")}><span className="inline-flex items-center gap-1">{delta > 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}{delta > 0 ? "+" : ""}{delta}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Risk matrix" meta="likelihood × impact · open items">
          <div className="grid grid-cols-[1.5rem_1fr] gap-2">
            <span className="flex items-center justify-center text-[0.65rem] uppercase tracking-wider text-muted-foreground [writing-mode:vertical-rl] rotate-180">Likelihood →</span>
            <div>
              <div className="grid grid-cols-5 gap-1">
                {[...RISK_MATRIX].reverse().map((row, ri) => row.map((n, ci) => {
                  const l = 4 - ri;
                  return <div key={`${ri}-${ci}`} role="img" className={cn("num grid aspect-square place-items-center text-small font-bold", cellTone(l, ci))} aria-label={`Likelihood ${l + 1}, impact ${ci + 1}: ${n} items`}>{n || ""}</div>;
                }))}
              </div>
              <p className="mt-2 text-center text-[0.65rem] uppercase tracking-wider text-muted-foreground">Impact →</p>
            </div>
          </div>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {p && (
          <Panel title={`Trend · ${p.institution}`}>
            <TrendChart data={QUARTERS.map((q, i) => ({ label: q, values: [p.trend[i], 60] }))} series={[{ name: "Score", className: "text-primary" }, { name: "Threshold", className: "text-status-critical" }]} />
            <ul className="mt-4 grid gap-2">{p.domains.map((d) => <li key={d.name} className="grid grid-cols-[6rem_1fr_2rem] items-center gap-2 text-small"><span>{d.name}</span><span className="h-2 bg-muted"><span className={cn("block h-full", scoreBar(d.score))} style={{ width: `${d.score}%` }} /></span><span className="num text-right font-semibold">{d.score}</span></li>)}</ul>
          </Panel>
        )}
        <Panel title="High-risk alerts">
          <ul className="grid gap-3">
            {ALERTS.filter((a) => a.level !== "Moderate").map((a) => <li key={a.id} className="border-l-2 border-status-critical pl-3"><div className="flex items-center justify-between gap-2"><p className="text-small font-semibold">{a.title}</p><RiskTag r={a.level} /></div><p className="text-xs text-muted-foreground">{a.context}</p></li>)}
          </ul>
        </Panel>
        <Panel title="Emerging themes" meta="mentions in findings & reports · QoQ">
          <ul className="grid gap-3">
            {THEMES.map((t) => (
              <li key={t.name} className="flex items-center justify-between gap-3 text-small">
                <span className="font-semibold">{t.name}<span className="block text-xs font-normal text-muted-foreground">{t.mentions} mentions</span></span>
                <span className={cn("num font-mono text-xs font-bold", t.delta > 0 ? "text-status-critical" : "text-status-positive")}>{t.delta > 0 ? "▲" : "▼"} {Math.abs(t.delta)}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Gate>
  );
}
