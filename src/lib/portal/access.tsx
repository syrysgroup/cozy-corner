/**
 * Portal access model — PLACEHOLDER for the enterprise IAM.
 * RBAC: roles grant permissions. ABAC: attributes (institution scope, clearance) narrow data.
 * Swap `useAccess` source for the real identity provider / policy decision point; keep shapes.
 * The UI only hides/explains — the backend must enforce every check.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Permission =
  | "dashboard.view" | "audit.view" | "audit.edit" | "rec.view" | "rec.update" | "rec.verify"
  | "risk.view" | "inv.view" | "inv.assign" | "il.view" | "il.identity.request"
  | "docs.view" | "docs.restricted" | "knowledge.view" | "tasks.view" | "admin.view" | "admin.manage";

export type RoleKey = "auditor_general" | "audit_manager" | "auditor" | "investigator" | "integrity_officer" | "executive" | "administrator";

export type Role = { key: RoleKey; label: string; description: string; permissions: Permission[] };

const ALL: Permission[] = ["dashboard.view", "audit.view", "audit.edit", "rec.view", "rec.update", "rec.verify", "risk.view", "inv.view", "inv.assign", "il.view", "il.identity.request", "docs.view", "docs.restricted", "knowledge.view", "tasks.view", "admin.view", "admin.manage"];

export const ROLES: Role[] = [
  { key: "auditor_general", label: "Auditor General", description: "Full oversight across modules. Identity access still requires dual approval.", permissions: ALL.filter((p) => p !== "admin.manage") },
  { key: "audit_manager", label: "Audit Manager", description: "Leads audits, verifies recommendations within assigned institutions.", permissions: ["dashboard.view", "audit.view", "audit.edit", "rec.view", "rec.update", "rec.verify", "risk.view", "docs.view", "docs.restricted", "knowledge.view", "tasks.view"] },
  { key: "auditor", label: "Auditor", description: "Works on assigned audits; cannot verify closure.", permissions: ["dashboard.view", "audit.view", "audit.edit", "rec.view", "rec.update", "docs.view", "knowledge.view", "tasks.view"] },
  { key: "investigator", label: "Investigator", description: "Handles assigned investigation cases.", permissions: ["dashboard.view", "inv.view", "il.view", "docs.view", "knowledge.view", "tasks.view"] },
  { key: "integrity_officer", label: "Integrity Officer", description: "Triages IntegrityLine reports and assigns cases.", permissions: ["dashboard.view", "inv.view", "inv.assign", "il.view", "il.identity.request", "docs.view", "knowledge.view", "tasks.view"] },
  { key: "executive", label: "Executive viewer", description: "Read-only aggregates. No case or document detail.", permissions: ["dashboard.view", "risk.view", "rec.view", "knowledge.view"] },
  { key: "administrator", label: "System administrator", description: "Manages access. No access to audit or case content.", permissions: ["dashboard.view", "admin.view", "admin.manage", "tasks.view"] },
];

export type Attributes = { institutions: string[] | "all"; clearance: "standard" | "restricted" | "secret" };

export type Session = { name: string; role: Role; attrs: Attributes };

const DEMO_ATTRS: Record<RoleKey, Attributes> = {
  auditor_general: { institutions: "all", clearance: "secret" },
  audit_manager: { institutions: ["ECOWAS Commission", "EBID", "WAHO", "ERERA"], clearance: "restricted" },
  auditor: { institutions: ["ECOWAS Commission", "WAHO"], clearance: "standard" },
  investigator: { institutions: "all", clearance: "restricted" },
  integrity_officer: { institutions: "all", clearance: "secret" },
  executive: { institutions: "all", clearance: "standard" },
  administrator: { institutions: [], clearance: "standard" },
};

type Ctx = { session: Session; setRole: (k: RoleKey) => void; can: (p: Permission) => boolean; inScope: (institution: string) => boolean };
const AccessCtx = createContext<Ctx | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [roleKey, setRole] = useState<RoleKey>("auditor_general");
  const value = useMemo<Ctx>(() => {
    const role = ROLES.find((r) => r.key === roleKey)!;
    const attrs = DEMO_ATTRS[roleKey];
    return {
      session: { name: "Demo user", role, attrs },
      setRole,
      can: (p) => role.permissions.includes(p),
      inScope: (inst) => attrs.institutions === "all" || attrs.institutions.includes(inst),
    };
  }, [roleKey]);
  return <AccessCtx.Provider value={value}>{children}</AccessCtx.Provider>;
}

export function useAccess() {
  const c = useContext(AccessCtx);
  if (!c) throw new Error("useAccess outside AccessProvider");
  return c;
}
