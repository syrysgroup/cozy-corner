import { useMemo, useState } from "react";
import { X, Paperclip, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button, StatusBadge } from "@/components/ds/primitives";
import { Gate, Metric, PageHead, Panel, RiskTag, Seg, Table } from "@/components/portal/parts";
import { useAccess } from "@/lib/portal/access";
import { RECS, recStatusTone, daysFrom, type Recommendation, type RecStatus } from "@/lib/portal/portal-data";

const VIEWS = ["All", "Overdue", "Awaiting verification", "Open", "Closed"] as const;
const FLOW: RecStatus[] = ["Open", "In progress", "Evidence submitted", "Verified", "Closed"];

export default function Recommendations() {
  const { inScope, can } = useAccess();
  const [data, setData] = useState(RECS);
  const [view, setView] = useState<(typeof VIEWS)[number]>("All");
  const [sel, setSel] = useState<string | null>(null);
  const scoped = data.filter((r) => inScope(r.institution));
  const rows = useMemo(() => scoped.filter((r) =>
    view === "All" ? true : view === "Overdue" ? r.status === "Overdue" : view === "Awaiting verification" ? r.verification === "Pending" : view === "Open" ? !["Closed", "Verified"].includes(r.status) : ["Closed", "Verified"].includes(r.status)
  ).sort((a, b) => a.due.localeCompare(b.due)), [scoped, view]);
  const current = data.find((r) => r.id === sel);
  const update = (id: string, patch: Partial<Recommendation>) => setData((d) => d.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <Gate need="rec.view">
      <PageHead overline="Recommendation tracking" title="Recommendations" lead="Every recommendation from issue to verified closure. Updates are recorded here; status in source systems is not altered." />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Tracked" value={scoped.length} />
        <Metric label="Overdue" value={scoped.filter((r) => r.status === "Overdue").length} tone="critical" />
        <Metric label="Awaiting verification" value={scoped.filter((r) => r.verification === "Pending").length} tone="warning" />
        <Metric label="Closed / verified" value={scoped.filter((r) => ["Closed", "Verified"].includes(r.status)).length} tone="positive" />
      </div>
      <div className="mt-5"><Seg label="View" value={view} options={VIEWS} onChange={setView} /></div>
      <div className={cn("mt-4 grid gap-4", current && "xl:grid-cols-[1fr_24rem]")}>
        <Panel>
          <Table head={["ID", "Recommendation", "Institution", "Risk", "Responsible", "Due", "Status", "Evidence", "Verification"]}>
            {rows.map((r) => {
              const d = daysFrom(r.due);
              return (
                <tr key={r.id} onClick={() => setSel(r.id)} className={cn("cursor-pointer", sel === r.id && "bg-primary-soft")}>
                  <td className="font-mono text-xs"><button className="text-primary hover:underline" onClick={() => setSel(r.id)}>{r.id}</button></td>
                  <td className="min-w-64 font-semibold leading-snug">{r.title}</td>
                  <td className="whitespace-nowrap">{r.institution}</td>
                  <td><RiskTag r={r.risk} /></td>
                  <td className="whitespace-nowrap">{r.owner}</td>
                  <td className="whitespace-nowrap font-mono text-xs">{r.due}<span className={cn("block", d < 0 && !["Closed", "Verified"].includes(r.status) ? "text-status-critical" : "text-muted-foreground")}>{["Closed", "Verified"].includes(r.status) ? "done" : d < 0 ? `${-d}d late` : `in ${d}d`}</span></td>
                  <td><StatusBadge status={recStatusTone(r.status)}>{r.status}</StatusBadge></td>
                  <td className="num"><span className="inline-flex items-center gap-1"><Paperclip className="size-3.5" aria-hidden />{r.evidence}</span></td>
                  <td className="whitespace-nowrap text-xs">{r.verification}</td>
                </tr>
              );
            })}
          </Table>
        </Panel>
        {current && (
          <aside className="border border-border bg-card xl:sticky xl:top-20 xl:self-start" aria-label="Recommendation detail">
            <div className="flex items-start justify-between gap-3 border-b border-border p-4">
              <div><p className="font-mono text-xs text-muted-foreground">{current.id} · {current.auditId}</p><h2 className="mt-1 font-display text-h4 leading-snug">{current.title}</h2></div>
              <button onClick={() => setSel(null)} aria-label="Close detail" className="grid size-8 place-items-center hover:bg-muted"><X className="size-4" /></button>
            </div>
            <div className="grid gap-5 p-4">
              <ol className="grid grid-cols-5 gap-1" aria-label="Lifecycle">
                {FLOW.map((s, i) => {
                  const idx = FLOW.indexOf(current.status === "Overdue" ? "In progress" : current.status);
                  return <li key={s} className="text-[0.65rem] leading-tight"><span className={cn("mb-1 block h-1.5", i <= idx ? "bg-primary" : "bg-muted")} />{s}</li>;
                })}
              </ol>
              <dl className="grid grid-cols-2 gap-3 text-small">
                <div><dt className="text-xs text-muted-foreground">Institution</dt><dd className="font-semibold">{current.institution}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Responsible</dt><dd className="font-semibold">{current.owner}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Risk</dt><dd><RiskTag r={current.risk} /></dd></div>
                <div><dt className="text-xs text-muted-foreground">Due</dt><dd className="font-mono">{current.due}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Evidence</dt><dd className="font-semibold">{current.evidence} files</dd></div>
                <div><dt className="text-xs text-muted-foreground">Verification</dt><dd className="font-semibold">{current.verification}</dd></div>
              </dl>
              <div className="grid gap-2 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Actions</p>
                {can("rec.update") ? (
                  <Button size="sm" variant="secondary" onClick={() => { update(current.id, { evidence: current.evidence + 1, status: "Evidence submitted", verification: "Pending" }); toast.success("Evidence logged (placeholder)"); }}><Paperclip />Log evidence received</Button>
                ) : <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3.5" />Updating requires rec.update</p>}
                {can("rec.verify") ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" disabled={current.verification !== "Pending"} onClick={() => { update(current.id, { verification: "Accepted", status: "Verified" }); toast.success("Verified"); }}><ShieldCheck />Verify</Button>
                    <Button size="sm" variant="ghost" disabled={current.verification !== "Pending"} onClick={() => { update(current.id, { verification: "Returned", status: "In progress" }); toast("Returned for more evidence"); }}>Return</Button>
                    <Button size="sm" variant="success" className="col-span-2" disabled={current.status !== "Verified"} onClick={() => { update(current.id, { status: "Closed", closedOn: "2026-10-04" }); toast.success("Closed"); }}>Close recommendation</Button>
                  </div>
                ) : <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3.5" />Verification and closure require rec.verify (segregation of duties).</p>}
              </div>
            </div>
          </aside>
        )}
      </div>
    </Gate>
  );
}
