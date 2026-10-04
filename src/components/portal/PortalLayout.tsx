import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, FileSearch, ListChecks, Radar, Scale, ShieldCheck, FolderLock, BookOpen, CheckSquare, Bell, Settings2, Lock, Menu, X, Search, Database, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band } from "@/components/ds/primitives";
import { AccessProvider, ROLES, useAccess, type Permission, type RoleKey } from "@/lib/portal/access";
import { NOTICES, PORTAL_NOTICE } from "@/lib/portal/portal-data";

export const PORTAL_NAV: { to: string; label: string; icon: React.ElementType; need: Permission }[] = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, need: "dashboard.view" },
  { to: "/portal/audits", label: "Audit Intelligence", icon: FileSearch, need: "audit.view" },
  { to: "/portal/recommendations", label: "Recommendations", icon: ListChecks, need: "rec.view" },
  { to: "/portal/risk", label: "Risk", icon: Radar, need: "risk.view" },
  { to: "/portal/investigations", label: "Investigations", icon: Scale, need: "inv.view" },
  { to: "/portal/integrityline", label: "IntegrityLine", icon: ShieldCheck, need: "il.view" },
  { to: "/portal/documents", label: "Documents", icon: FolderLock, need: "docs.view" },
  { to: "/portal/knowledge", label: "Knowledge", icon: BookOpen, need: "knowledge.view" },
  { to: "/portal/assistant", label: "Ask OAG Intelligence", icon: Landmark, need: "assistant.view" },
  { to: "/portal/tasks", label: "Tasks", icon: CheckSquare, need: "tasks.view" },
  { to: "/portal/notifications", label: "Notifications", icon: Bell, need: "dashboard.view" },
  { to: "/portal/admin", label: "Administration", icon: Settings2, need: "admin.view" },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { can } = useAccess();
  const unread = NOTICES.filter((n) => !n.read).length;
  return (
    <nav aria-label="Portal" className="flex h-full flex-col bg-ink text-background">
      <Band />
      <Link to="/portal" onClick={onNavigate} className="flex items-center gap-3 px-5 py-5">
        <span className="grid size-9 place-items-center rounded-full border-2 border-ecowas-yellow text-[0.65rem] font-bold text-ecowas-yellow">OAG</span>
        <span className="leading-tight"><span className="block text-small font-bold">Intelligence Portal</span><span className="block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-background/55">Internal · Protected</span></span>
      </Link>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-2">
        {PORTAL_NAV.map((n) => {
          const allowed = can(n.need);
          const Icon = n.icon;
          return (
            <li key={n.to}>
              <NavLink to={n.to} end={n.to === "/portal"} onClick={onNavigate}
                className={({ isActive }) => cn("group flex items-center gap-3 rounded-sm px-3 py-2 text-small font-medium text-background/75 hover:bg-background/10 hover:text-background",
                  isActive && "bg-background/10 text-background shadow-[inset_2px_0_0_hsl(var(--ecowas-yellow))]", !allowed && "text-background/35")}>
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1">{n.label}</span>
                {!allowed && <Lock className="size-3" aria-label="Restricted" />}
                {allowed && n.label === "Notifications" && unread > 0 && <span className="num rounded-xs bg-ecowas-yellow px-1.5 text-[0.65rem] font-bold text-ink">{unread}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
      <div className="m-3 border border-background/15 p-3 text-[0.7rem] leading-relaxed text-background/60">
        <Database className="mb-1.5 size-3.5" aria-hidden />
        Intelligence layer only. SAP and ECOWAS enterprise systems remain the systems of record.
      </div>
    </nav>
  );
}

function RoleSwitcher() {
  const { session, setRole } = useAccess();
  return (
    <label className="flex min-w-0 items-center gap-2 text-xs">
      <span className="hidden font-mono uppercase tracking-[0.1em] text-muted-foreground md:inline">Viewing as</span>
      <span className="sr-only md:hidden">Viewing as</span>
      <select value={session.role.key} onChange={(e) => setRole(e.target.value as RoleKey)} className="h-9 w-full max-w-[8.5rem] truncate border border-border bg-card px-2 text-small font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-none">
        {ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
      </select>
    </label>
  );
}

function Shell() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { session } = useAccess();
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }); }, [pathname]);
  return (
    <div className="min-h-screen bg-surface-sunken text-ink lg:grid lg:grid-cols-[15.5rem_1fr]">
      <aside className="sticky top-0 hidden h-screen lg:block"><Sidebar /></aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-ink/50" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72"><Sidebar onNavigate={() => setOpen(false)} /></div>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur sm:gap-3 md:px-6">
          <button className="grid size-11 shrink-0 place-items-center lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2 border border-border bg-card px-3 text-small text-muted-foreground md:max-w-md">
            <Search className="size-4 shrink-0" aria-hidden /><span className="truncate">Search audits, REC-, INV-, institutions…</span>
          </div>
          <div className="min-w-0 shrink"><RoleSwitcher /></div>
          <span className="hidden items-center gap-1.5 border border-border px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-ink-soft xl:inline-flex">
            Clearance · {session.attrs.clearance}
          </span>
        </header>
        <div className="border-b border-ecowas-yellow/40 bg-ecowas-yellow/10 px-4 py-1.5 text-xs text-ink-soft md:px-6">{PORTAL_NOTICE} Role switcher is a demo of permission-aware UI.</div>
        <main id="main" key={pathname} className="animate-rise-in p-4 motion-reduce:animate-none md:p-6 xl:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

export function PortalLayout() {
  return <AccessProvider><Shell /></AccessProvider>;
}
