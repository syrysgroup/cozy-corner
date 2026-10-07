import { useState } from "react";
import { FileText, Lock, Bell, CalendarClock, UserCheck, Cog, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Gate, PageHead, Panel, RiskTag, Seg, Table } from "@/components/portal/parts";
import { useAccess } from "@/lib/portal/access";
import { DOCS, KNOWLEDGE, NOTICES, TASKS, daysFrom } from "@/lib/portal/portal-data";

export function Documents() {
  const { can, inScope, session } = useAccess();
  return (
    <Gate need="docs.view">
      <PageHead overline="Documents" title="Document register" lead="Pointers to documents held in ECOWAS document management. Classification and clearance are enforced per item." />
      <Panel className="mt-5">
        <Table head={["Document", "Type", "Institution", "Classification", "Linked", "Updated"]}>
          {DOCS.map((d) => {
            const locked = (d.classification === "Restricted" && (!can("docs.restricted") || session.attrs.clearance === "standard")) || (d.institution !== "OAG" && !inScope(d.institution));
            return (
              <tr key={d.id}>
                <td className={cn("font-semibold", locked && "text-muted-foreground")}><span className="inline-flex items-center gap-2">{locked ? <Lock className="size-4" /> : <FileText className="size-4 text-primary" />}{locked ? "Restricted, insufficient clearance or scope" : d.title}</span></td>
                <td>{d.kind}</td><td>{locked ? "N/A" : d.institution}</td>
                <td><span className={cn("border px-2 py-0.5 text-xs font-semibold", d.classification === "Restricted" ? "border-status-critical/40 text-status-critical" : d.classification === "Internal" ? "border-ecowas-orange/40 text-status-warning" : "border-border")}>{d.classification}</span></td>
                <td className="font-mono text-xs">{locked ? "N/A" : d.linked}</td><td className="font-mono text-xs">{d.updated}</td>
              </tr>
            );
          })}
        </Table>
      </Panel>
    </Gate>
  );
}

export function KnowledgePage() {
  const [q, setQ] = useState("");
  const items = KNOWLEDGE.filter((k) => (k.title + k.summary + k.tags.join(" ")).toLowerCase().includes(q.toLowerCase()));
  return (
    <Gate need="knowledge.view">
      <PageHead overline="Knowledge" title="Methods, lessons & guidance" lead="Institutional memory for audit and investigation practice." />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search knowledge" aria-label="Search knowledge" className="mt-5 h-10 w-full max-w-md border border-border bg-card px-3 text-small outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((k) => (
          <article key={k.id} className="flex flex-col border border-border bg-card p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">{k.kind}</p>
            <h2 className="mt-2 font-display text-h4 leading-snug">{k.title}</h2>
            <p className="mt-2 flex-1 text-small text-ink-soft">{k.summary}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">{k.tags.map((t) => <li key={t} className="bg-muted px-2 py-0.5 text-xs">{t}</li>)}</ul>
          </article>
        ))}
      </div>
    </Gate>
  );
}

export function Tasks() {
  const [tasks, setTasks] = useState(TASKS);
  const [view, setView] = useState<"Open" | "Done" | "All">("Open");
  const rows = tasks.filter((t) => view === "All" || (view === "Done" ? t.done : !t.done)).sort((a, b) => a.due.localeCompare(b.due));
  return (
    <Gate need="tasks.view">
      <PageHead overline="Tasks" title="My work" lead="Actions assigned to you across modules." />
      <div className="mt-5"><Seg label="Filter" value={view} options={["Open", "Done", "All"] as const} onChange={setView} /></div>
      <Panel className="mt-4">
        <ul className="divide-y divide-border">
          {rows.map((t) => {
            const d = daysFrom(t.due);
            return (
              <li key={t.id} className="flex items-center gap-3 py-2.5">
                <input type="checkbox" checked={t.done} onChange={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} className="size-4 accent-primary" aria-label={`Mark ${t.title} done`} />
                <div className="min-w-0 flex-1"><p className={cn("text-small font-semibold", t.done && "text-muted-foreground line-through")}>{t.title}</p><p className="font-mono text-xs text-muted-foreground">{t.module} · {t.ref}</p></div>
                <RiskTag r={t.priority} />
                <span className={cn("num w-16 text-right font-mono text-xs", !t.done && d < 3 ? "text-status-critical" : "text-muted-foreground")}>{t.done ? "done" : d < 0 ? `${-d}d late` : `${d}d`}</span>
              </li>
            );
          })}
        </ul>
      </Panel>
    </Gate>
  );
}

const ICON = { assignment: UserCheck, deadline: CalendarClock, system: Cog, verification: ShieldCheck };
export function Notifications() {
  const [items, setItems] = useState(NOTICES);
  return (
    <Gate need="dashboard.view">
      <PageHead overline="Notifications" title="Inbox" actions={<button onClick={() => setItems((n) => n.map((x) => ({ ...x, read: true })))} className="text-small font-semibold text-primary hover:underline">Mark all read</button>} />
      <Panel className="mt-5">
        <ul className="divide-y divide-border">
          {items.map((n) => {
            const Icon = ICON[n.kind] ?? Bell;
            return (
              <li key={n.id} className={cn("flex gap-3 py-3", !n.read && "")}>
                <span className={cn("grid size-8 shrink-0 place-items-center", n.read ? "bg-muted text-muted-foreground" : "bg-primary-soft text-primary")}><Icon className="size-4" /></span>
                <div className="flex-1"><p className={cn("text-small", !n.read && "font-semibold")}>{n.title}</p><p className="text-xs text-muted-foreground">{n.body}</p></div>
                <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">{n.at}</span>
                {!n.read && <span className="mt-1.5 size-2 rounded-full bg-primary" aria-label="Unread" />}
              </li>
            );
          })}
        </ul>
      </Panel>
    </Gate>
  );
}
