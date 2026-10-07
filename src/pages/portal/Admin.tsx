import { useState } from "react";
import { Check, Minus, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ds/primitives";
import { Gate, PageHead, Panel, Seg, Table } from "@/components/portal/parts";
import { ROLES, useAccess, type Permission } from "@/lib/portal/access";
import { ACCESS_LOG, INTEGRATIONS, USERS } from "@/lib/portal/portal-data";

const PERMS: { group: string; items: Permission[] }[] = [
  { group: "Audit", items: ["audit.view", "audit.edit"] },
  { group: "Recommendations", items: ["rec.view", "rec.update", "rec.verify"] },
  { group: "Risk", items: ["risk.view"] },
  { group: "Investigations", items: ["inv.view", "inv.assign"] },
  { group: "IntegrityLine", items: ["il.view", "il.identity.request"] },
  { group: "Documents", items: ["docs.view", "docs.restricted"] },
  { group: "Admin", items: ["admin.view", "admin.manage"] },
];

const TABS = ["Users", "Roles (RBAC)", "Policies (ABAC)", "Integrations", "Access log"] as const;

export default function Admin() {
  const { can } = useAccess();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Users");
  const manage = can("admin.manage");
  return (
    <Gate need="admin.view">
      <PageHead overline="Administration" title="Access & configuration" lead="Roles grant capabilities; attribute policies narrow them by institution, clearance and assignment. The identity provider and policy engine are authoritative." />
      {!manage && <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3.5" />Read-only, changes require admin.manage.</p>}
      <div className="mt-5"><Seg label="Admin section" value={tab} options={TABS} onChange={setTab} /></div>
      <div className="mt-4">
        {tab === "Users" && (
          <Panel>
            <Table head={["User", "Role", "Institution scope", "Clearance", "MFA", "Last active", "Status"]}>
              {USERS.map((u) => (
                <tr key={u.id}>
                  <td className="font-semibold">{u.name}</td><td>{u.role}</td><td className="text-xs">{u.scope}</td><td>{u.clearance}</td>
                  <td>{u.mfa ? <Check className="size-4 text-status-positive" aria-label="Enabled" /> : <span className="text-xs font-semibold text-status-critical">Missing</span>}</td>
                  <td className="font-mono text-xs">{u.lastActive}</td>
                  <td><StatusBadge status={u.status === "Active" ? "positive" : u.status === "Pending" ? "attention" : "neutral"}>{u.status}</StatusBadge></td>
                </tr>
              ))}
            </Table>
          </Panel>
        )}
        {tab === "Roles (RBAC)" && (
          <Panel title="Role × permission matrix">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr><th />{PERMS.map((g) => <th key={g.group} colSpan={g.items.length} className="border-b border-border px-1 py-1 text-center font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</th>)}</tr>
                  <tr><th className="py-2 pr-3 text-left">Role</th>{PERMS.flatMap((g) => g.items).map((p) => <th key={p} className="px-1 py-2 font-mono font-normal text-muted-foreground">{p.split(".").slice(1).join(".")}</th>)}</tr>
                </thead>
                <tbody>
                  {ROLES.map((r) => (
                    <tr key={r.key} className="border-t border-border/60">
                      <th scope="row" className="py-2 pr-3 text-left"><span className="block text-small font-semibold">{r.label}</span><span className="block max-w-56 font-normal text-muted-foreground">{r.description}</span></th>
                      {PERMS.flatMap((g) => g.items).map((p) => {
                        const has = r.permissions.includes(p);
                        return <td key={p} className="px-1 text-center"><span className={cn("mx-auto grid size-6 place-items-center", has ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} aria-label={has ? "Granted" : "Not granted"}>{has ? <Check className="size-3.5" /> : <Minus className="size-3" />}</span></td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
        {tab === "Policies (ABAC)" && (
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Institutional scope", "user.institutions ∋ resource.institution", "Audits, recommendations, risk profiles and documents outside scope are hidden or redacted."],
              ["Clearance", "user.clearance ≥ resource.classification", "Restricted documents require clearance ‘restricted’ or higher."],
              ["Case assignment", "resource.assignee = user OR user.role ∈ {Integrity Officer, AG}", "Investigators see full detail only for assigned cases."],
              ["Identity vault", "dual_approval(AG, Integrity Officer) AND legal_basis", "Reporter identity never enters case views; reveals are time-boxed and logged."],
              ["Segregation of duties", "recommendation.updated_by ≠ recommendation.verified_by", "The person logging evidence cannot verify closure."],
              ["Admin isolation", "role = administrator ⇒ ¬content.read", "Administrators manage access without reading audit or case content."],
            ].map(([t, rule, d]) => (
              <article key={t} className="border border-border bg-card p-4">
                <h3 className="text-small font-semibold">{t}</h3>
                <code className="mt-2 block bg-ink px-3 py-2 font-mono text-xs text-background">{rule}</code>
                <p className="mt-2 text-xs text-ink-soft">{d}</p>
              </article>
            ))}
          </div>
        )}
        {tab === "Integrations" && (
          <Panel title="Systems of record" meta="read-only consumption">
            <Table head={["System", "Mode", "Status", "Last sync"]}>
              {INTEGRATIONS.map((i) => <tr key={i.name}><td className="font-semibold">{i.name}</td><td>{i.mode}</td><td><StatusBadge status={i.status === "Healthy" ? "positive" : "warning"}>{i.status}</StatusBadge></td><td className="font-mono text-xs">{i.synced}</td></tr>)}
            </Table>
          </Panel>
        )}
        {tab === "Access log" && (
          <Panel>
            <Table head={["Time", "Actor", "Action", "Target", "Outcome"]}>
              {ACCESS_LOG.map((e, i) => <tr key={i}><td className="font-mono text-xs">{e.at}</td><td>{e.actor}</td><td>{e.action}</td><td className="font-mono text-xs">{e.target}</td><td><StatusBadge status={e.outcome === "Allowed" ? "positive" : e.outcome === "Denied" ? "critical" : "attention"}>{e.outcome}</StatusBadge></td></tr>)}
            </Table>
          </Panel>
        )}
      </div>
    </Gate>
  );
}
