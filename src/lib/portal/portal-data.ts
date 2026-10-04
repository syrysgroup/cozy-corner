/**
 * OAG Intelligence Portal data — ILLUSTRATIVE PLACEHOLDER ONLY.
 * The portal is an intelligence layer: SAP and ECOWAS enterprise systems remain systems of record.
 * Replace `fetchPortal` with authorised integration endpoints returning the same shapes.
 */
export const PORTAL_NOTICE = "Illustrative placeholder data. Systems of record: SAP & ECOWAS enterprise systems.";

export type Risk = "Low" | "Moderate" | "High" | "Critical";
export type AuditStage = "Planning" | "Fieldwork" | "Reporting" | "Published" | "Follow-up";
export type Finding = { id: string; title: string; risk: Risk; area: string };
export type TimelineItem = { date: string; label: string; done: boolean };
export type Audit = { id: string; title: string; institution: string; type: "Financial" | "Compliance" | "Performance" | "Special review"; stage: AuditStage; lead: string; start: string; due: string; risk: Risk; progress: number; findings: Finding[]; timeline: TimelineItem[]; source: string };

export type RecStatus = "Open" | "In progress" | "Evidence submitted" | "Verified" | "Closed" | "Overdue";
export type Recommendation = { id: string; auditId: string; title: string; institution: string; risk: Risk; owner: string; due: string; status: RecStatus; evidence: number; verification: "Not started" | "Pending" | "Accepted" | "Returned"; closedOn?: string };

export type CaseStage = "Intake" | "Triage" | "Assessment" | "Investigation" | "Review" | "Closed";
export type InvCase = { id: string; reporterId: string; source: "IntegrityLine" | "Referral" | "Audit finding"; category: string; institution: string; stage: CaseStage; priority: Risk; assignee: string | null; opened: string; deadline: string; evidence: number; findings: number; identityMode: "anonymous" | "confidential" | "identified"; lastActivity: string };

export type RiskProfile = { institution: string; overall: number; trend: number[]; domains: { name: string; score: number }[] };
export type Alert = { id: string; level: Risk; title: string; context: string; at: string; module: "risk" | "recommendations" | "investigations" | "audits" };
export type Task = { id: string; title: string; module: string; due: string; priority: Risk; done: boolean; ref: string };
export type Notice = { id: string; title: string; body: string; at: string; read: boolean; kind: "assignment" | "deadline" | "system" | "verification" };
export type Doc = { id: string; title: string; kind: string; institution: string; classification: "Public" | "Internal" | "Restricted"; updated: string; linked: string };
export type Knowledge = { id: string; title: string; kind: "Methodology" | "Lesson learned" | "Guidance" | "Template"; tags: string[]; summary: string };
export type UserRow = { id: string; name: string; role: string; scope: string; clearance: string; mfa: boolean; lastActive: string; status: "Active" | "Suspended" | "Pending" };
export type AccessEvent = { at: string; actor: string; action: string; target: string; outcome: "Allowed" | "Denied" | "Pending approval" };

const T = (d: string, label: string, done: boolean): TimelineItem => ({ date: d, label, done });

export const AUDITS: Audit[] = [
  { id: "AUD-2026-014", title: "Financial statements audit FY2025", institution: "ECOWAS Commission", type: "Financial", stage: "Fieldwork", lead: "A. Mensah", start: "2026-06-02", due: "2026-11-28", risk: "High", progress: 58, source: "SAP FI/CO",
    findings: [{ id: "F-1", title: "Unreconciled suspense accounts", risk: "High", area: "Financial reporting" }, { id: "F-2", title: "Late asset capitalisation", risk: "Moderate", area: "Asset management" }, { id: "F-3", title: "Override of payment approval limits", risk: "Critical", area: "Internal control" }],
    timeline: [T("Jun 02", "Engagement letter", true), T("Jul 15", "Planning memo approved", true), T("Sep 30", "Fieldwork", false), T("Oct 30", "Draft report", false), T("Nov 28", "Final report", false)] },
  { id: "AUD-2026-011", title: "Procurement compliance review", institution: "WAHO", type: "Compliance", stage: "Reporting", lead: "F. Diallo", start: "2026-04-10", due: "2026-10-20", risk: "Critical", progress: 82, source: "SAP MM / e-procurement",
    findings: [{ id: "F-1", title: "Split contracts below threshold", risk: "Critical", area: "Procurement" }, { id: "F-2", title: "Missing evaluation committee minutes", risk: "High", area: "Procurement" }],
    timeline: [T("Apr 10", "Engagement letter", true), T("May 20", "Planning", true), T("Aug 14", "Fieldwork", true), T("Oct 01", "Draft report", true), T("Oct 20", "Final report", false)] },
  { id: "AUD-2026-009", title: "Performance audit: regional health programme", institution: "WAHO", type: "Performance", stage: "Published", lead: "K. Owusu", start: "2026-01-12", due: "2026-07-01", risk: "Moderate", progress: 100, source: "Programme MIS",
    findings: [{ id: "F-1", title: "Weak output indicators", risk: "Moderate", area: "Programme delivery" }],
    timeline: [T("Jan 12", "Engagement", true), T("Mar 02", "Fieldwork", true), T("May 20", "Draft", true), T("Jul 01", "Published", true)] },
  { id: "AUD-2026-016", title: "IT general controls", institution: "EBID", type: "Compliance", stage: "Planning", lead: "S. Traoré", start: "2026-09-15", due: "2027-02-10", risk: "High", progress: 12, source: "IAM / SAP GRC",
    findings: [], timeline: [T("Sep 15", "Engagement", true), T("Oct 30", "Planning memo", false), T("Dec 15", "Fieldwork", false), T("Feb 10", "Final report", false)] },
  { id: "AUD-2025-031", title: "Payroll and HR compliance", institution: "ECOWAS Parliament", type: "Compliance", stage: "Follow-up", lead: "M. Bello", start: "2025-08-01", due: "2026-12-15", risk: "Moderate", progress: 90, source: "SAP HCM",
    findings: [{ id: "F-1", title: "Ghost allowance payments", risk: "High", area: "Human resources" }, { id: "F-2", title: "Incomplete personnel files", risk: "Low", area: "Human resources" }],
    timeline: [T("Aug 01", "Engagement", true), T("Jan 20", "Published", true), T("Jun 30", "Follow-up 1", true), T("Dec 15", "Follow-up 2", false)] },
  { id: "AUD-2026-012", title: "Tariff methodology performance audit", institution: "ERERA", type: "Performance", stage: "Fieldwork", lead: "A. Sow", start: "2026-05-05", due: "2026-12-01", risk: "Low", progress: 45, source: "Regulatory DB",
    findings: [{ id: "F-1", title: "Undocumented tariff assumptions", risk: "Moderate", area: "Governance" }],
    timeline: [T("May 05", "Engagement", true), T("Jun 30", "Planning", true), T("Oct 15", "Fieldwork", false), T("Dec 01", "Final", false)] },
  { id: "AUD-2026-007", title: "Grants management special review", institution: "GIABA", type: "Special review", stage: "Reporting", lead: "C. Ndiaye", start: "2026-03-01", due: "2026-10-31", risk: "High", progress: 74, source: "Grants system",
    findings: [{ id: "F-1", title: "Ineligible expenditure claimed", risk: "High", area: "Grants" }],
    timeline: [T("Mar 01", "Engagement", true), T("Jul 20", "Fieldwork", true), T("Oct 05", "Draft", false), T("Oct 31", "Final", false)] },
  { id: "AUD-2026-005", title: "Court registry financial audit", institution: "ECOWAS Court of Justice", type: "Financial", stage: "Published", lead: "E. Kouassi", start: "2026-01-05", due: "2026-05-30", risk: "Low", progress: 100, source: "SAP FI",
    findings: [{ id: "F-1", title: "Cash handling segregation", risk: "Moderate", area: "Internal control" }], timeline: [T("Jan 05", "Engagement", true), T("May 30", "Published", true)] },
];

export const RECS: Recommendation[] = [
  { id: "REC-0412", auditId: "AUD-2025-031", title: "Recover ghost allowance payments and review payroll master data", institution: "ECOWAS Parliament", risk: "High", owner: "Director, HR", due: "2026-08-30", status: "Overdue", evidence: 1, verification: "Returned" },
  { id: "REC-0413", auditId: "AUD-2025-031", title: "Digitise and complete personnel files", institution: "ECOWAS Parliament", risk: "Low", owner: "HR Records", due: "2026-12-15", status: "In progress", evidence: 2, verification: "Not started" },
  { id: "REC-0388", auditId: "AUD-2026-009", title: "Redefine programme output indicators with baselines", institution: "WAHO", risk: "Moderate", owner: "Programmes Directorate", due: "2026-10-15", status: "Evidence submitted", evidence: 4, verification: "Pending" },
  { id: "REC-0391", auditId: "AUD-2026-005", title: "Segregate cash collection and recording duties", institution: "ECOWAS Court of Justice", risk: "Moderate", owner: "Chief Registrar", due: "2026-09-01", status: "Closed", evidence: 3, verification: "Accepted", closedOn: "2026-09-12" },
  { id: "REC-0356", auditId: "AUD-2025-022", title: "Enforce payment approval limits in SAP workflow", institution: "ECOWAS Commission", risk: "Critical", owner: "Finance Commissioner", due: "2026-07-31", status: "Overdue", evidence: 0, verification: "Not started" },
  { id: "REC-0357", auditId: "AUD-2025-022", title: "Monthly reconciliation of suspense accounts", institution: "ECOWAS Commission", risk: "High", owner: "Director, Finance", due: "2026-11-30", status: "In progress", evidence: 1, verification: "Not started" },
  { id: "REC-0340", auditId: "AUD-2025-018", title: "Adopt procurement threshold monitoring", institution: "WAHO", risk: "Critical", owner: "Procurement Unit", due: "2026-10-01", status: "Overdue", evidence: 1, verification: "Pending" },
  { id: "REC-0333", auditId: "AUD-2025-015", title: "Board-approved credit risk appetite statement", institution: "EBID", risk: "High", owner: "Risk Committee", due: "2026-12-31", status: "Open", evidence: 0, verification: "Not started" },
  { id: "REC-0321", auditId: "AUD-2025-012", title: "Publish tariff assumptions annex", institution: "ERERA", risk: "Moderate", owner: "Regulatory Council", due: "2026-09-30", status: "Verified", evidence: 2, verification: "Accepted" },
  { id: "REC-0318", auditId: "AUD-2025-010", title: "Grant eligibility checklist before disbursement", institution: "GIABA", risk: "High", owner: "Finance & Admin", due: "2026-11-15", status: "Evidence submitted", evidence: 3, verification: "Pending" },
  { id: "REC-0302", auditId: "AUD-2025-008", title: "Fixed asset tagging and annual count", institution: "ECOWAS Commission", risk: "Moderate", owner: "General Services", due: "2026-06-30", status: "Closed", evidence: 5, verification: "Accepted", closedOn: "2026-07-08" },
  { id: "REC-0299", auditId: "AUD-2025-008", title: "Access review for SAP privileged users", institution: "EBID", risk: "High", owner: "IT Directorate", due: "2026-10-10", status: "In progress", evidence: 1, verification: "Not started" },
];

export const CASES: InvCase[] = [
  { id: "INV-26-041", reporterId: "PR-7F82A", source: "IntegrityLine", category: "Procurement irregularities", institution: "WAHO", stage: "Investigation", priority: "Critical", assignee: "Investigator 03", opened: "2026-09-12", deadline: "2026-11-12", evidence: 6, findings: 2, identityMode: "anonymous", lastActivity: "2h ago" },
  { id: "INV-26-044", reporterId: "PR-C19D0", source: "IntegrityLine", category: "Conflict of interest", institution: "ECOWAS Commission", stage: "Triage", priority: "High", assignee: null, opened: "2026-10-01", deadline: "2026-10-08", evidence: 1, findings: 0, identityMode: "confidential", lastActivity: "1d ago" },
  { id: "INV-26-039", reporterId: "—", source: "Audit finding", category: "Financial misconduct", institution: "ECOWAS Commission", stage: "Assessment", priority: "Critical", assignee: "Investigator 01", opened: "2026-08-28", deadline: "2026-10-15", evidence: 9, findings: 1, identityMode: "identified", lastActivity: "5h ago" },
  { id: "INV-26-045", reporterId: "PR-4B6EE", source: "IntegrityLine", category: "Abuse of authority", institution: "ECOWAS Parliament", stage: "Intake", priority: "Moderate", assignee: null, opened: "2026-10-03", deadline: "2026-10-10", evidence: 0, findings: 0, identityMode: "anonymous", lastActivity: "6h ago" },
  { id: "INV-26-033", reporterId: "PR-91A2F", source: "IntegrityLine", category: "Bribery", institution: "EBID", stage: "Review", priority: "High", assignee: "Investigator 02", opened: "2026-07-04", deadline: "2026-10-20", evidence: 12, findings: 3, identityMode: "confidential", lastActivity: "3d ago" },
  { id: "INV-26-030", reporterId: "—", source: "Referral", category: "Misuse of ECOWAS resources", institution: "GIABA", stage: "Investigation", priority: "Moderate", assignee: "Investigator 03", opened: "2026-06-21", deadline: "2026-10-30", evidence: 4, findings: 1, identityMode: "identified", lastActivity: "1d ago" },
  { id: "INV-26-021", reporterId: "PR-0DE77", source: "IntegrityLine", category: "Fraud", institution: "ERERA", stage: "Closed", priority: "High", assignee: "Investigator 01", opened: "2026-03-10", deadline: "2026-08-10", evidence: 8, findings: 2, identityMode: "anonymous", lastActivity: "Aug 04" },
];

export const RISK_PROFILES: RiskProfile[] = [
  { institution: "ECOWAS Commission", overall: 74, trend: [62, 66, 69, 71, 74], domains: [{ name: "Financial", score: 78 }, { name: "Procurement", score: 70 }, { name: "IT", score: 66 }, { name: "Governance", score: 61 }, { name: "HR", score: 58 }] },
  { institution: "WAHO", overall: 71, trend: [58, 60, 64, 69, 71], domains: [{ name: "Financial", score: 60 }, { name: "Procurement", score: 86 }, { name: "IT", score: 52 }, { name: "Governance", score: 64 }, { name: "HR", score: 55 }] },
  { institution: "EBID", overall: 63, trend: [66, 64, 63, 62, 63], domains: [{ name: "Financial", score: 68 }, { name: "Procurement", score: 50 }, { name: "IT", score: 72 }, { name: "Governance", score: 59 }, { name: "HR", score: 44 }] },
  { institution: "ECOWAS Parliament", overall: 58, trend: [48, 52, 55, 57, 58], domains: [{ name: "Financial", score: 52 }, { name: "Procurement", score: 46 }, { name: "IT", score: 40 }, { name: "Governance", score: 55 }, { name: "HR", score: 79 }] },
  { institution: "GIABA", overall: 55, trend: [50, 51, 54, 56, 55], domains: [{ name: "Financial", score: 62 }, { name: "Procurement", score: 48 }, { name: "IT", score: 41 }, { name: "Governance", score: 57 }, { name: "HR", score: 45 }] },
  { institution: "ERERA", overall: 39, trend: [44, 42, 41, 40, 39], domains: [{ name: "Financial", score: 35 }, { name: "Procurement", score: 32 }, { name: "IT", score: 45 }, { name: "Governance", score: 48 }, { name: "HR", score: 30 }] },
  { institution: "ECOWAS Court of Justice", overall: 36, trend: [41, 40, 38, 37, 36], domains: [{ name: "Financial", score: 40 }, { name: "Procurement", score: 30 }, { name: "IT", score: 38 }, { name: "Governance", score: 34 }, { name: "HR", score: 33 }] },
];

/** 5×5 likelihood × impact matrix: counts of open risk items. [likelihood 1..5][impact 1..5] */
export const RISK_MATRIX: number[][] = [
  [4, 3, 2, 1, 0],
  [3, 6, 4, 2, 1],
  [2, 5, 7, 4, 2],
  [1, 2, 5, 6, 3],
  [0, 1, 2, 4, 3],
];

export const THEMES = [
  { name: "Procurement splitting", delta: +38, mentions: 22 },
  { name: "Privileged system access", delta: +27, mentions: 17 },
  { name: "Grant eligibility", delta: +19, mentions: 11 },
  { name: "Payroll master data", delta: +12, mentions: 9 },
  { name: "Asset tagging", delta: -15, mentions: 6 },
];

export const QUARTERS = ["Q3·25", "Q4·25", "Q1·26", "Q2·26", "Q3·26"];

export const ALERTS: Alert[] = [
  { id: "al1", level: "Critical", title: "Payment approval override recurring", context: "ECOWAS Commission · REC-0356 overdue 65 days", at: "Today 09:12", module: "recommendations" },
  { id: "al2", level: "Critical", title: "Procurement risk score crossed threshold", context: "WAHO · Procurement 86 / 100", at: "Today 07:40", module: "risk" },
  { id: "al3", level: "High", title: "Triage SLA breach in 4 days", context: "INV-26-044 unassigned", at: "Yesterday", module: "investigations" },
  { id: "al4", level: "Moderate", title: "Draft report due in 16 days", context: "AUD-2026-011 · WAHO", at: "Yesterday", module: "audits" },
];

export const TASKS: Task[] = [
  { id: "t1", title: "Review draft report chapter 3", module: "Audit", due: "2026-10-07", priority: "High", done: false, ref: "AUD-2026-011" },
  { id: "t2", title: "Verify evidence for indicator redesign", module: "Recommendation", due: "2026-10-09", priority: "Moderate", done: false, ref: "REC-0388" },
  { id: "t3", title: "Assign triage owner", module: "Investigation", due: "2026-10-06", priority: "Critical", done: false, ref: "INV-26-044" },
  { id: "t4", title: "Approve planning memo", module: "Audit", due: "2026-10-30", priority: "Moderate", done: false, ref: "AUD-2026-016" },
  { id: "t5", title: "Send follow-up request to HR", module: "Recommendation", due: "2026-10-05", priority: "High", done: true, ref: "REC-0412" },
  { id: "t6", title: "Quarterly risk refresh sign-off", module: "Risk", due: "2026-10-14", priority: "Low", done: false, ref: "Q3·26" },
];

export const NOTICES: Notice[] = [
  { id: "n1", kind: "assignment", title: "You were assigned INV-26-041 review", body: "Stage moved to Investigation by Integrity Officer.", at: "2h ago", read: false },
  { id: "n2", kind: "verification", title: "Evidence submitted for REC-0388", body: "4 files from WAHO Programmes Directorate await verification.", at: "5h ago", read: false },
  { id: "n3", kind: "deadline", title: "AUD-2026-011 final report due Oct 20", body: "Draft review pending sign-off.", at: "Yesterday", read: false },
  { id: "n4", kind: "system", title: "SAP FI integration synced", body: "Ledger snapshot refreshed. 0 errors.", at: "Yesterday", read: true },
  { id: "n5", kind: "system", title: "Access policy updated", body: "Restricted documents now require clearance ‘restricted’.", at: "Oct 01", read: true },
];

export const DOCS: Doc[] = [
  { id: "d1", title: "Final report — Court registry financial audit", kind: "Report", institution: "ECOWAS Court of Justice", classification: "Public", updated: "2026-05-30", linked: "AUD-2026-005" },
  { id: "d2", title: "Working papers — procurement sampling", kind: "Working paper", institution: "WAHO", classification: "Restricted", updated: "2026-09-18", linked: "AUD-2026-011" },
  { id: "d3", title: "Management letter FY2025", kind: "Letter", institution: "ECOWAS Commission", classification: "Internal", updated: "2026-09-02", linked: "AUD-2026-014" },
  { id: "d4", title: "Evidence pack REC-0388", kind: "Evidence", institution: "WAHO", classification: "Internal", updated: "2026-10-02", linked: "REC-0388" },
  { id: "d5", title: "IT controls planning memo (draft)", kind: "Memo", institution: "EBID", classification: "Restricted", updated: "2026-09-29", linked: "AUD-2026-016" },
  { id: "d6", title: "Annual activity report 2025", kind: "Report", institution: "OAG", classification: "Public", updated: "2026-02-14", linked: "—" },
];

export const KNOWLEDGE: Knowledge[] = [
  { id: "k1", title: "Detecting contract splitting", kind: "Methodology", tags: ["Procurement", "Data analytics"], summary: "Threshold clustering tests and vendor-date pattern analysis on e-procurement extracts." },
  { id: "k2", title: "What we learned from payroll follow-ups", kind: "Lesson learned", tags: ["HR", "Follow-up"], summary: "Recoveries stall without master-data owners; assign one named owner per recommendation." },
  { id: "k3", title: "Evidence sufficiency for recommendation closure", kind: "Guidance", tags: ["Recommendations", "Verification"], summary: "Closure requires operating evidence, not only policy adoption." },
  { id: "k4", title: "Performance audit planning memo", kind: "Template", tags: ["Performance", "Planning"], summary: "Standard structure aligned with ISSAI 3000." },
  { id: "k5", title: "Handling protected reporter communication", kind: "Guidance", tags: ["IntegrityLine", "Protection"], summary: "Never ask for identifying details; route all contact through the protected channel." },
];

export const USERS: UserRow[] = [
  { id: "u1", name: "Auditor General", role: "Auditor General", scope: "All institutions", clearance: "Secret", mfa: true, lastActive: "Now", status: "Active" },
  { id: "u2", name: "A. Mensah", role: "Audit Manager", scope: "Commission, EBID, WAHO, ERERA", clearance: "Restricted", mfa: true, lastActive: "12m", status: "Active" },
  { id: "u3", name: "F. Diallo", role: "Auditor", scope: "Commission, WAHO", clearance: "Standard", mfa: true, lastActive: "1h", status: "Active" },
  { id: "u4", name: "Investigator 03", role: "Investigator", scope: "Assigned cases", clearance: "Restricted", mfa: true, lastActive: "2h", status: "Active" },
  { id: "u5", name: "Integrity Officer", role: "Integrity Officer", scope: "IntegrityLine", clearance: "Secret", mfa: true, lastActive: "30m", status: "Active" },
  { id: "u6", name: "New staff", role: "Auditor", scope: "—", clearance: "Standard", mfa: false, lastActive: "Never", status: "Pending" },
  { id: "u7", name: "Former consultant", role: "Auditor", scope: "WAHO", clearance: "Standard", mfa: true, lastActive: "64d", status: "Suspended" },
];

export const ACCESS_LOG: AccessEvent[] = [
  { at: "09:41", actor: "Investigator 03", action: "Open case", target: "INV-26-041", outcome: "Allowed" },
  { at: "09:22", actor: "F. Diallo", action: "Open restricted document", target: "d5 · EBID memo", outcome: "Denied" },
  { at: "08:57", actor: "Integrity Officer", action: "Request identity reveal", target: "PR-91A2F", outcome: "Pending approval" },
  { at: "08:30", actor: "A. Mensah", action: "Verify recommendation", target: "REC-0321", outcome: "Allowed" },
];

export const INTEGRATIONS = [
  { name: "SAP S/4HANA (FI/CO, MM, HCM)", mode: "Read-only API", status: "Healthy", synced: "08:00" },
  { name: "ECOWAS document management", mode: "Read-only API", status: "Healthy", synced: "07:45" },
  { name: "IntegrityLine secure vault", mode: "Brokered, no identity", status: "Healthy", synced: "Live" },
  { name: "Identity provider (SSO / MFA)", mode: "OIDC", status: "Degraded", synced: "Live" },
];

export const riskStatus = (r: Risk) => ({ Low: "positive", Moderate: "attention", High: "warning", Critical: "critical" } as const)[r];
export const recStatusTone = (s: RecStatus) => ({ Open: "neutral", "In progress": "info", "Evidence submitted": "attention", Verified: "positive", Closed: "positive", Overdue: "critical" } as const)[s];
export const daysFrom = (iso: string, now = new Date("2026-10-04")) => Math.round((new Date(iso).getTime() - now.getTime()) / 86400000);
