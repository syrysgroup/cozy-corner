import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Database, FileText, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ds/primitives";
import { Gate, Metric, PageHead, Panel, Progress, RiskTag, Seg, Table, Restricted } from "@/components/portal/parts";
import { useAccess } from "@/lib/portal/access";
import { AUDITS, DOCS, RECS, TASKS, recStatusTone, daysFrom, type AuditStage } from "@/lib/portal/portal-data";

const STAGES = ["All", "Planning", "Fieldwork", "Reporting", "Published", "Follow-up"] as const;

export function AuditList() {
  const { inScope } = useAccess();
  const [stage, setStage] = useState<(typeof STAGES)[number]>("All");
  const [q, setQ] = useState("");
  const rows = useMemo(() => AUDITS.filter((a) => inScope(a.institution) && (stage === "All" || a.stage === stage) && (a.title + a.id + a.institution).toLowerCase().includes(q.toLowerCase())), [stage, q, inScope]);
  const hidden = AUDITS.filter((a) => !inScope(a.institution)).length;
  return (
    <Gate need="audit.view">
      <PageHead overline="Audit intelligence" title="Audit workspace" lead="Engagements consumed from source systems with findings, recommendations and follow-up in one place." />
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Seg label="Stage" value={stage} options={STAGES} onChange={setStage} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by ID, title, institution" aria-label="Filter audits" className="h-9 min-w-56 flex-1 border border-border bg-card px-3 text-small outline-none focus-visible:ring-2 focus-visible:ring-ring md:max-w-xs" />
        {hidden > 0 && <span className="text-xs text-muted-foreground">{hidden} audits outside your institutional scope are hidden.</span>}
      </div>
      <Panel className="mt-4">
        <Table head={["ID", "Audit", "Institution", "Type", "Stage", "Risk", "Progress", "Due"]}>
          {rows.map((a) => (
            <tr key={a.id}>
              <td className="font-mono text-xs"><Link to={`/portal/audits/${a.id}`} className="text-primary hover:underline">{a.id}</Link></td>
              <td className="min-w-64 font-semibold"><Link to={`/portal/audits/${a.id}`} className="hover:text-primary">{a.title}</Link></td>
              <td className="whitespace-nowrap">{a.institution}</td>
              <td>{a.type}</td>
              <td><span className="whitespace-nowrap border border-border px-2 py-0.5 text-xs font-semibold">{a.stage}</span></td>
              <td><RiskTag r={a.risk} /></td>
              <td className="w-32"><div className="flex items-center gap-2"><Progress value={a.progress} /><span className="num text-xs">{a.progress}%</span></div></td>
              <td className="num whitespace-nowrap font-mono text-xs">{a.due}</td>
            </tr>
          ))}
        </Table>
        {!rows.length && <p className="py-10 text-center text-small text-muted-foreground">No audits match.</p>}
      </Panel>
    </Gate>
  );
}

const TABS = ["Findings", "Recommendations", "Documents", "Timeline", "Tasks", "Follow-up"] as const;

export function AuditDetail() {
  const { id } = useParams();
  const { inScope, can, session } = useAccess();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Findings");
  const a = AUDITS.find((x) => x.id === id);
  if (!can("audit.view")) return <Restricted need="audit.view" />;
  if (!a) return <Restricted need="audit.view" title="Audit not found" >This audit does not exist or has been withdrawn.</Restricted>;
  if (!inScope(a.institution)) return <Restricted need="audit.view" title="Outside your scope">{a.institution} is not in the institutional scope assigned to your account.</Restricted>;
  const recs = RECS.filter((r) => r.auditId === a.id);
  const docs = DOCS.filter((d) => d.linked === a.id);
  const tasks = TASKS.filter((t) => t.ref === a.id);
  const clear = session.attrs.clearance !== "standard";

  return (
    <div>
      <Link to="/portal/audits" className="mb-4 inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden />All audits</Link>
      <PageHead overline={`${a.id} · ${a.type}`} title={a.title} lead={`${a.institution} · Lead ${a.lead}`} actions={<span className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-xs text-ink-soft"><Database className="size-3.5" aria-hidden />Source: {a.source}</span>} />
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Metric label="Stage" value={<span className="text-[1.3rem]">{a.stage}</span>} />
        <Metric label="Progress" value={`${a.progress}%`} />
        <Metric label="Findings" value={a.findings.length} />
        <Metric label="Recommendations" value={recs.length} />
        <Metric label="Days to due" value={daysFrom(a.due)} tone={daysFrom(a.due) < 20 ? "warning" : undefined} />
      </div>
      <div role="tablist" aria-label="Audit sections" className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("-mb-px whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-small font-semibold text-ink-soft hover:text-ink", tab === t && "border-primary text-primary")}>{t}</button>
        ))}
      </div>
      <div className="mt-4" role="tabpanel">
        {tab === "Findings" && (
          <Panel>
            {a.findings.length ? <Table head={["#", "Finding", "Area", "Risk"]}>{a.findings.map((f) => <tr key={f.id}><td className="font-mono text-xs">{f.id}</td><td className="font-semibold">{f.title}</td><td>{f.area}</td><td><RiskTag r={f.risk} /></td></tr>)}</Table> : <p className="text-small text-muted-foreground">No findings recorded yet, audit is in {a.stage.toLowerCase()}.</p>}
          </Panel>
        )}
        {tab === "Recommendations" && (
          <Panel>{recs.length ? <Table head={["ID", "Recommendation", "Owner", "Due", "Status"]}>{recs.map((r) => <tr key={r.id}><td className="font-mono text-xs">{r.id}</td><td className="font-semibold">{r.title}</td><td>{r.owner}</td><td className="font-mono text-xs">{r.due}</td><td><StatusBadge status={recStatusTone(r.status)}>{r.status}</StatusBadge></td></tr>)}</Table> : <p className="text-small text-muted-foreground">Recommendations are issued at reporting stage.</p>}</Panel>
        )}
        {tab === "Documents" && (
          <Panel>
            <ul className="divide-y divide-border">
              {docs.map((d) => {
                const locked = d.classification === "Restricted" && (!can("docs.restricted") || !clear);
                return <li key={d.id} className="flex items-center gap-3 py-2.5 text-small"><FileText className="size-4 text-muted-foreground" aria-hidden /><span className={cn("flex-1 font-semibold", locked && "text-muted-foreground")}>{locked ? "Restricted document" : d.title}</span><span className="text-xs">{d.classification}</span></li>;
              })}
              {!docs.length && <li className="text-small text-muted-foreground">No linked documents.</li>}
            </ul>
          </Panel>
        )}
        {tab === "Timeline" && (
          <Panel>
            <ol className="grid gap-0 md:grid-cols-5">
              {a.timeline.map((t) => (
                <li key={t.label} className="relative border-t-2 pt-3 pr-3 md:border-t-2" style={{}}>
                  <span className={cn("absolute -top-[9px] left-0 bg-card", t.done ? "text-primary" : "text-muted-foreground")}>{t.done ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}</span>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">{t.date}</p><p className="text-small font-semibold">{t.label}</p>
                </li>
              ))}
            </ol>
          </Panel>
        )}
        {tab === "Tasks" && <Panel>{tasks.length ? <ul className="grid gap-2">{tasks.map((t) => <li key={t.id} className="flex items-center justify-between text-small"><span>{t.title}</span><RiskTag r={t.priority} /></li>)}</ul> : <p className="text-small text-muted-foreground">No open tasks for this audit.</p>}</Panel>}
        {tab === "Follow-up" && (
          <Panel>
            <p className="text-small text-ink-soft">Follow-up status of recommendations issued by this audit.</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Metric label="Implemented" value={recs.filter((r) => ["Closed", "Verified"].includes(r.status)).length} tone="positive" />
              <Metric label="In progress" value={recs.filter((r) => ["In progress", "Evidence submitted", "Open"].includes(r.status)).length} />
              <Metric label="Overdue" value={recs.filter((r) => r.status === "Overdue").length} tone="critical" />
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

export type { AuditStage };
