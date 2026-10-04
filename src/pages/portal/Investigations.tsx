import { useState } from "react";
import { EyeOff, Lock, ShieldCheck, UserPlus, KeyRound, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ds/primitives";
import { Gate, Metric, PageHead, Panel, RiskTag, Table } from "@/components/portal/parts";
import { useAccess } from "@/lib/portal/access";
import { CASES, daysFrom, type CaseStage, type InvCase } from "@/lib/portal/portal-data";

const STAGES: CaseStage[] = ["Intake", "Triage", "Assessment", "Investigation", "Review", "Closed"];
const INVESTIGATORS = ["Investigator 01", "Investigator 02", "Investigator 03"];

function CaseCard({ c, onOpen, active }: { c: InvCase; onOpen: () => void; active: boolean }) {
  const d = daysFrom(c.deadline);
  return (
    <button onClick={onOpen} className={cn("w-full border border-border bg-card p-3 text-left hover:border-ink/40", active && "border-primary ring-1 ring-primary")}>
      <div className="flex items-center justify-between gap-2"><span className="font-mono text-xs">{c.id}</span><RiskTag r={c.priority} /></div>
      <p className="mt-2 text-small font-semibold leading-snug">{c.category}</p>
      <p className="text-xs text-muted-foreground">{c.institution}</p>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={c.assignee ? "text-ink-soft" : "font-semibold text-status-warning"}>{c.assignee ?? "Unassigned"}</span>
        <span className={cn("num font-mono", c.stage !== "Closed" && d < 7 ? "text-status-critical" : "text-muted-foreground")}>{c.stage === "Closed" ? "closed" : `${d}d`}</span>
      </div>
    </button>
  );
}

export function Investigations() {
  const { can } = useAccess();
  const [cases, setCases] = useState(CASES);
  const [sel, setSel] = useState<string | null>(CASES[0].id);
  const c = cases.find((x) => x.id === sel);
  const patch = (id: string, p: Partial<InvCase>) => setCases((cs) => cs.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <Gate need="inv.view">
      <PageHead overline="Investigations" title="Case pipeline" lead="Triage through closure. Reporter identity is never displayed here; cases reference protected reporter IDs." />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Open cases" value={cases.filter((x) => x.stage !== "Closed").length} />
        <Metric label="Awaiting triage" value={cases.filter((x) => ["Intake", "Triage"].includes(x.stage)).length} tone="warning" />
        <Metric label="Unassigned" value={cases.filter((x) => !x.assignee).length} tone="critical" />
        <Metric label="Deadline < 14 days" value={cases.filter((x) => x.stage !== "Closed" && daysFrom(x.deadline) < 14).length} />
      </div>
      <div className="mt-5 grid gap-3 overflow-x-auto pb-2 [grid-template-columns:repeat(6,minmax(13rem,1fr))]">
        {STAGES.map((s) => (
          <section key={s} aria-label={s} className="min-w-0">
            <h2 className="mb-2 flex items-center justify-between border-b-2 border-ink pb-1.5 text-xs font-bold uppercase tracking-[0.08em]">{s}<span className="num">{cases.filter((x) => x.stage === s).length}</span></h2>
            <div className="grid gap-2">{cases.filter((x) => x.stage === s).map((x) => <CaseCard key={x.id} c={x} active={sel === x.id} onOpen={() => setSel(x.id)} />)}</div>
          </section>
        ))}
      </div>
      {c && (
        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_22rem]">
          <Panel title={`${c.id} · ${c.category}`} meta={c.source}>
            <dl className="grid grid-cols-2 gap-4 text-small md:grid-cols-4">
              <div><dt className="text-xs text-muted-foreground">Reporter</dt><dd className="flex items-center gap-1.5 font-mono font-semibold"><EyeOff className="size-3.5" aria-hidden />{c.reporterId}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Institution</dt><dd className="font-semibold">{c.institution}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Opened</dt><dd className="font-mono">{c.opened}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Deadline</dt><dd className="font-mono">{c.deadline}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Evidence items</dt><dd className="font-semibold">{c.evidence} (encrypted)</dd></div>
              <div><dt className="text-xs text-muted-foreground">Findings</dt><dd className="font-semibold">{c.findings}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Stage</dt><dd className="font-semibold">{c.stage}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Last activity</dt><dd>{c.lastActivity}</dd></div>
            </dl>
            <ol className="mt-5 flex gap-1">{STAGES.map((s, i) => <li key={s} className="flex-1 text-[0.65rem]"><span className={cn("mb-1 block h-1.5", i <= STAGES.indexOf(c.stage) ? "bg-primary" : "bg-muted")} />{s}</li>)}</ol>
          </Panel>
          <Panel title="Case actions">
            {can("inv.assign") ? (
              <div className="grid gap-3">
                <label className="grid gap-1 text-xs font-semibold">Assign investigator
                  <select value={c.assignee ?? ""} onChange={(e) => { patch(c.id, { assignee: e.target.value || null }); toast.success("Assignment recorded"); }} className="h-9 border border-border bg-card px-2 text-small font-normal">
                    <option value="">Unassigned</option>{INVESTIGATORS.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </label>
                <Button size="sm" variant="secondary" disabled={c.stage === "Closed"} onClick={() => patch(c.id, { stage: STAGES[STAGES.indexOf(c.stage) + 1] })}><UserPlus />Advance to {STAGES[STAGES.indexOf(c.stage) + 1] ?? "—"}</Button>
              </div>
            ) : <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><Lock className="mt-0.5 size-3.5 shrink-0" />Triage, assignment and stage changes require inv.assign. You can work on cases assigned to you.</p>}
          </Panel>
        </div>
      )}
    </Gate>
  );
}

export function IntegrityCases() {
  const { can } = useAccess();
  const il = CASES.filter((c) => c.source === "IntegrityLine");
  const [sel, setSel] = useState(il[0].id);
  const [requested, setRequested] = useState<string[]>([]);
  const c = il.find((x) => x.id === sel)!;
  return (
    <Gate need="il.view">
      <PageHead overline="IntegrityLine · protected" title="Case management" lead="Investigator interface. Identity is held in a separate vault and is never shown by default." actions={<span className="inline-flex items-center gap-1.5 border border-primary/40 bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary"><ShieldCheck className="size-3.5" />Access is logged</span>} />
      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_26rem]">
        <Panel>
          <Table head={["Protected ID", "Case", "Category", "Mode", "Stage", "Priority", "Deadline"]}>
            {il.map((x) => (
              <tr key={x.id} onClick={() => setSel(x.id)} className={cn("cursor-pointer", sel === x.id && "bg-primary-soft")}>
                <td className="font-mono text-xs font-semibold"><span className="inline-flex items-center gap-1.5"><EyeOff className="size-3.5" />{x.reporterId}</span></td>
                <td className="font-mono text-xs">{x.id}</td><td>{x.category}</td>
                <td className="text-xs capitalize">{x.identityMode}</td><td>{x.stage}</td><td><RiskTag r={x.priority} /></td><td className="font-mono text-xs">{x.deadline}</td>
              </tr>
            ))}
          </Table>
        </Panel>
        <aside className="grid gap-4 self-start">
          <Panel title="Reporter" meta={c.reporterId}>
            <div className="border border-dashed border-border bg-surface-sunken p-4 text-small">
              <p className="flex items-center gap-2 font-semibold"><EyeOff className="size-4" />Identity withheld</p>
              <p className="mt-1 text-xs text-ink-soft">{c.identityMode === "anonymous" ? "Anonymous report — no identity exists in the vault." : "Identity is sealed in the vault. Reveal requires a documented legal basis and dual approval by the Auditor General and Integrity Officer."}</p>
              {c.identityMode !== "anonymous" && (can("il.identity.request")
                ? <Button size="sm" variant="secondary" className="mt-3" disabled={requested.includes(c.id)} onClick={() => { setRequested((r) => [...r, c.id]); toast("Reveal request submitted for dual approval"); }}><KeyRound />{requested.includes(c.id) ? "Request pending approval" : "Request identity access"}</Button>
                : <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3.5" />Your role cannot request identity access.</p>)}
            </div>
          </Panel>
          <Panel title="Protected channel">
            <ul className="grid gap-2 text-small">
              <li className="bg-muted p-2.5"><p className="text-xs text-muted-foreground">Investigator · {c.opened}</p>Thank you. Your report has been received and assigned for assessment.</li>
              <li className="border border-border p-2.5"><p className="text-xs text-muted-foreground">Reporter · {c.lastActivity}</p>Additional context provided through the protected portal.</li>
            </ul>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><MessageSquare className="size-3.5" />Never ask for identifying details in messages.</p>
          </Panel>
        </aside>
      </div>
    </Gate>
  );
}
