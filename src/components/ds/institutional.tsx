import { ArrowDown, Gavel, Landmark, Scale, ShieldCheck, Building2, Network, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Canonical ECOWAS institutional model.
 * ECOWAS has THREE arms of governance. OAG is NOT a fourth arm — it is an
 * independent assurance office within the wider institutional ecosystem.
 */
export const OAG_POSITIONING =
  "OAG is an independent assurance office supporting accountability, good corporate governance and value for money across ECOWAS Institutions.";

export const GOVERNANCE_ARMS = [
  { arm: "Executive", body: "ECOWAS Commission", icon: Briefcase, role: "Performs executive functions and implements Community programmes and activities." },
  { arm: "Legislature", body: "ECOWAS Parliament", icon: Landmark, role: "Provides legislative and representative functions and parliamentary scrutiny." },
  { arm: "Judiciary", body: "Community Court of Justice", icon: Scale, role: "Interprets and applies Community law." },
];

export const ECOSYSTEM = [
  { label: "Other Institutions", icon: Building2 },
  { label: "Specialized Agencies", icon: Network },
  { label: "Offices / Community Entities", icon: Gavel },
];

export const OAG_ROLES = ["Independent Assurance", "Audit", "Investigation", "Recommendations", "Follow-up", "Verification", "Accountability", "Transparency"];

export const ASSURANCE_CHAIN = [
  "ECOWAS Institutions", "OAG Independent Assurance", "Audit / Assurance / Investigation", "Findings", "Recommendations",
  "Management Response", "Corrective Action", "Follow-up", "Verification", "Accountability", "Transparency",
];

export function GovernanceArms() {
  return (
    <section aria-labelledby="gov-heading" className="border border-border bg-card p-6 md:p-8">
      <p className="overline text-muted-foreground">Part 1</p>
      <h3 id="gov-heading" className="mt-2 font-display text-h3">ECOWAS Governance</h3>
      <p className="mt-2 max-w-2xl text-small text-muted-foreground">ECOWAS has three arms of governance.</p>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {GOVERNANCE_ARMS.map(({ arm, body, icon: Icon, role }) => (
          <li key={arm} className="border-t-2 border-ink pt-4">
            <div className="flex items-center gap-2 text-ink-soft"><Icon className="size-4" aria-hidden="true" /><span className="overline">{arm}</span></div>
            <p className="mt-2 font-display text-h4 text-ink">{body}</p>
            <p className="mt-2 text-small text-muted-foreground">{role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function InstitutionalEcosystem() {
  return (
    <section aria-labelledby="eco-heading" className="border border-border bg-surface-sunken p-6 md:p-8">
      <p className="overline text-muted-foreground">Part 2</p>
      <h3 id="eco-heading" className="mt-2 font-display text-h3">ECOWAS Institutional Ecosystem</h3>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <ul className="grid gap-2">
          {ECOSYSTEM.map(({ label, icon: Icon }) => (
            <li key={label} className="flex items-center gap-3 border border-border bg-card px-4 py-3 text-small text-ink-soft"><Icon className="size-4 text-muted-foreground" aria-hidden="true" />{label}</li>
          ))}
        </ul>
        <div className="border-2 border-primary bg-card p-5">
          <div className="flex items-center gap-2 text-primary"><ShieldCheck className="size-5" aria-hidden="true" /><span className="overline">Independent Assurance</span></div>
          <p className="mt-2 font-display text-h4 text-ink">Office of the Auditor General (OAG)</p>
          <p className="mt-2 text-small text-muted-foreground">{OAG_POSITIONING}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="OAG digital role">
            {OAG_ROLES.map((r) => <li key={r} className="border border-primary/40 px-2 py-1 text-xs font-semibold text-primary">{r}</li>)}
          </ul>
        </div>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">OAG provides independent audit and assurance. It is not an arm of ECOWAS governance, does not control the Commission, Parliament or Court, and is not subordinate to Parliament.</p>
    </section>
  );
}

export function AssuranceChain({ className }: { className?: string }) {
  return (
    <ol aria-label="The assurance relationship" className={cn("grid gap-0", className)}>
      {ASSURANCE_CHAIN.map((step, i) => (
        <li key={step} className="flex flex-col items-start">
          <div className={cn("flex w-full items-center gap-3 border px-4 py-2.5 text-small", i === 1 ? "border-primary bg-primary text-primary-foreground font-semibold" : "border-border bg-card text-ink")}>
            <span className={cn("font-mono text-xs", i === 1 ? "" : "text-primary")}>{String(i + 1).padStart(2, "0")}</span>{step}
          </div>
          {i < ASSURANCE_CHAIN.length - 1 && <ArrowDown className="my-1 ml-5 size-3.5 text-muted-foreground" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

export function InstitutionalArchitecture() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="grid gap-6">
        <GovernanceArms />
        <InstitutionalEcosystem />
      </div>
      <div>
        <p className="overline text-primary">How assurance flows</p>
        <h3 className="mt-2 font-display text-h3">From institutions to transparency</h3>
        <AssuranceChain className="mt-5" />
      </div>
    </div>
  );
}
