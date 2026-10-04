/* SAMPLE library records — illustrative placeholders only. Replace with the authorised
   document repository keeping these shapes. Restricted records are filtered out by
   `publicDocuments` and must never be rendered. */

export const DOC_TYPES = ["Audit Report", "Annual Report", "Special Report", "Guidance", "Policy", "Publication", "Statement", "Other authorized document"] as const;
export type DocType = (typeof DOC_TYPES)[number];
export type Access = "public" | "restricted";
export type DocStatus = "Final" | "Updated" | "Superseded";
export type SectionKind = "Executive summary" | "Audit finding" | "Recommendation" | "Management response" | "Methodology" | "Body text";

export type LibraryDoc = {
  id: string; ref: string; title: string; type: DocType; year: number; institution: string; country: string;
  auditType?: "Financial" | "Compliance" | "Performance" | "Special";
  topics: string[]; languages: ("English" | "French" | "Portuguese")[]; status: DocStatus; access: Access;
  summary: string; pages: number; sizeMb: number; published: string;
  toc?: string[]; sections: { kind: SectionKind; text: string }[];
  relatedAudits?: string[]; recommendations?: { title: string; status: "Implemented" | "In progress" | "Not started" }[];
  cover: "green" | "ocean" | "brown" | "slate" | "orange" | "sky";
};

const D: LibraryDoc[] = [
  { id: "fa-commission-2025", ref: "OAG/FA/2025/014", title: "Financial audit of the ECOWAS Commission, 2025", type: "Audit Report", year: 2025, institution: "ECOWAS Commission", country: "Nigeria", auditType: "Financial", topics: ["Financial reporting", "Asset management"], languages: ["English", "French", "Portuguese"], status: "Final", access: "public", summary: "Sample summary: opinion on the financial statements, with observations on asset registers and reconciliations.", pages: 84, sizeMb: 3.1, published: "2025-09-12", cover: "green",
    toc: ["Executive summary", "Audit opinion", "Key findings", "Recommendations", "Management responses", "Annexes"],
    sections: [{ kind: "Executive summary", text: "overview of financial statements and audit opinion" }, { kind: "Audit finding", text: "asset register not reconciled with general ledger" }, { kind: "Recommendation", text: "strengthen asset register reconciliation quarterly" }],
    relatedAudits: ["OAG/FA/2024/011 · Financial audit, 2024", "OAG/CA/2025/003 · Fixed assets compliance review"],
    recommendations: [{ title: "Strengthen asset register reconciliation", status: "In progress" }, { title: "Document year-end closing procedures", status: "Implemented" }] },
  { id: "pa-health-procurement", ref: "OAG/PA/2025/006", title: "Performance audit: regional health procurement", type: "Audit Report", year: 2025, institution: "West African Health Organisation (WAHO)", country: "Burkina Faso", auditType: "Performance", topics: ["Procurement", "Health"], languages: ["English", "French"], status: "Final", access: "public", summary: "Sample summary: economy and efficiency of pooled procurement of medical supplies.", pages: 62, sizeMb: 2.4, published: "2025-07-03", cover: "ocean",
    toc: ["Summary", "Audit scope", "Findings", "Recommendations", "Response"],
    sections: [{ kind: "Audit finding", text: "procurement approval thresholds applied inconsistently" }, { kind: "Recommendation", text: "formalise procurement approval thresholds and supplier evaluation" }],
    relatedAudits: ["OAG/CA/2024/008 · Procurement compliance, WAHO"], recommendations: [{ title: "Formalise procurement approval thresholds", status: "Implemented" }] },
  { id: "annual-2025", ref: "OAG/AR/2025", title: "Annual Report of the Auditor General 2025", type: "Annual Report", year: 2025, institution: "All institutions", country: "Regional", topics: ["Accountability", "Financial reporting"], languages: ["English", "French", "Portuguese"], status: "Final", access: "public", summary: "Sample summary: the Office's yearly account of audits, recommendations and follow-up.", pages: 120, sizeMb: 3.2, published: "2025-10-01", cover: "brown",
    toc: ["Foreword", "Year in review", "Audit results by institution", "Recommendation follow-up", "Outlook"],
    sections: [{ kind: "Body text", text: "year in review accountability across institutions" }, { kind: "Recommendation", text: "follow-up on implementation status of recommendations" }] },
  { id: "annual-2024", ref: "OAG/AR/2024", title: "Annual Report of the Auditor General 2024", type: "Annual Report", year: 2024, institution: "All institutions", country: "Regional", topics: ["Accountability"], languages: ["English", "French"], status: "Superseded", access: "public", summary: "Sample summary: the prior year's account of the Office's work.", pages: 108, sizeMb: 2.9, published: "2024-10-04", cover: "slate",
    sections: [{ kind: "Body text", text: "year in review accountability" }] },
  { id: "compliance-ebid", ref: "OAG/CA/2025/009", title: "Compliance report: ECOWAS Bank for Investment and Development", type: "Audit Report", year: 2025, institution: "ECOWAS Bank for Investment and Development", country: "Togo", auditType: "Compliance", topics: ["Governance", "Procurement"], languages: ["English", "French"], status: "Final", access: "public", summary: "Sample summary: compliance with financial regulations and governance rules.", pages: 46, sizeMb: 1.8, published: "2025-05-20", cover: "orange",
    sections: [{ kind: "Audit finding", text: "board approval records incomplete for governance decisions" }, { kind: "Management response", text: "management agreed to update governance registers" }],
    recommendations: [{ title: "Complete board approval registers", status: "Not started" }] },
  { id: "guide-follow-up", ref: "OAG/GD/2025/002", title: "Guide to audit follow-up for institutions", type: "Guidance", year: 2025, institution: "All institutions", country: "Regional", topics: ["Accountability", "Methodology"], languages: ["English", "French", "Portuguese"], status: "Final", access: "public", summary: "Sample summary: how institutions report progress and evidence on recommendations.", pages: 28, sizeMb: 0.9, published: "2025-03-14", cover: "sky",
    toc: ["Purpose", "Roles", "Evidence requirements", "Timelines"], sections: [{ kind: "Methodology", text: "evidence requirements for recommendation follow-up" }] },
  { id: "special-court-ict", ref: "OAG/SR/2024/001", title: "Special report: ICT systems at the ECOWAS Court of Justice", type: "Special Report", year: 2024, institution: "ECOWAS Court of Justice", country: "Nigeria", auditType: "Special", topics: ["ICT", "Governance"], languages: ["English"], status: "Final", access: "public", summary: "Sample summary: review of information systems controls and continuity.", pages: 38, sizeMb: 1.4, published: "2024-11-30", cover: "slate",
    sections: [{ kind: "Audit finding", text: "backup and continuity controls not tested" }, { kind: "Recommendation", text: "test ICT continuity plan annually" }], recommendations: [{ title: "Test ICT continuity plan annually", status: "In progress" }] },
  { id: "policy-access", ref: "OAG/PL/2024/003", title: "Policy on public access to audit information", type: "Policy", year: 2024, institution: "Office of the Auditor General", country: "Regional", topics: ["Transparency"], languages: ["English", "French", "Portuguese"], status: "Updated", access: "public", summary: "Sample summary: what the Office publishes and how requests are handled.", pages: 14, sizeMb: 0.5, published: "2024-06-02", cover: "green",
    sections: [{ kind: "Body text", text: "publication of audit reports and transparency requests" }] },
  { id: "statement-parliament", ref: "OAG/ST/2025/004", title: "Statement to the ECOWAS Parliament on audit results", type: "Statement", year: 2025, institution: "ECOWAS Parliament", country: "Nigeria", topics: ["Accountability"], languages: ["English", "French"], status: "Final", access: "public", summary: "Sample summary: remarks presenting the year's principal audit results.", pages: 6, sizeMb: 0.2, published: "2025-10-15", cover: "ocean",
    sections: [{ kind: "Body text", text: "principal audit results presented to parliament" }] },
  { id: "pub-lessons", ref: "OAG/PB/2025/007", title: "Five lessons from three years of recommendation tracking", type: "Publication", year: 2025, institution: "All institutions", country: "Regional", topics: ["Accountability", "Methodology"], languages: ["English"], status: "Final", access: "public", summary: "Sample summary: themes drawn from tracking recommendation implementation.", pages: 18, sizeMb: 0.7, published: "2025-08-21", cover: "brown",
    sections: [{ kind: "Body text", text: "lessons from recommendation tracking" }] },
  { id: "pa-energy-2023", ref: "OAG/PA/2023/004", title: "Performance audit: regional energy programme", type: "Audit Report", year: 2023, institution: "ECOWAS Commission", country: "Nigeria", auditType: "Performance", topics: ["Energy", "Programme management"], languages: ["English", "French"], status: "Final", access: "public", summary: "Sample summary: delivery of a regional energy programme against objectives.", pages: 70, sizeMb: 2.6, published: "2023-12-08", cover: "orange",
    sections: [{ kind: "Audit finding", text: "programme indicators lacked baselines" }, { kind: "Recommendation", text: "define baselines for programme management indicators" }], recommendations: [{ title: "Define baselines for programme indicators", status: "Implemented" }] },
  { id: "internal-investigation", ref: "OAG/RS/2025/001", title: "Restricted investigation file", type: "Other authorized document", year: 2025, institution: "Restricted", country: "Restricted", topics: [], languages: ["English"], status: "Final", access: "restricted", summary: "", pages: 0, sizeMb: 0, published: "2025-01-01", cover: "slate", sections: [] },
];

/** Only public records leave this module. */
export const publicDocuments: LibraryDoc[] = D.filter((d) => d.access === "public");
export const getPublicDoc = (id?: string) => publicDocuments.find((d) => d.id === id);

const uniq = <T,>(a: T[]) => Array.from(new Set(a));
export const FACETS = {
  type: DOC_TYPES.filter((t) => publicDocuments.some((d) => d.type === t)) as string[],
  year: uniq(publicDocuments.map((d) => String(d.year))).sort().reverse(),
  institution: uniq(publicDocuments.map((d) => d.institution)).sort(),
  country: uniq(publicDocuments.map((d) => d.country)).sort(),
  auditType: uniq(publicDocuments.flatMap((d) => (d.auditType ? [d.auditType] : []))).sort(),
  topic: uniq(publicDocuments.flatMap((d) => d.topics)).sort(),
  language: ["English", "French", "Portuguese"],
  status: uniq(publicDocuments.map((d) => d.status)),
};
export type FacetKey = keyof typeof FACETS;
export const FACET_LABELS: Record<FacetKey, string> = { type: "Document type", year: "Year", institution: "Institution", country: "Country", auditType: "Audit type", topic: "Topic", language: "Language", status: "Status" };

export function facetValues(d: LibraryDoc, k: FacetKey): string[] {
  switch (k) {
    case "type": return [d.type]; case "year": return [String(d.year)]; case "institution": return [d.institution];
    case "country": return [d.country]; case "auditType": return d.auditType ? [d.auditType] : []; case "topic": return d.topics;
    case "language": return d.languages; case "status": return [d.status];
  }
}

/** Returns why a document matched the query, or null. */
export function matchReason(d: LibraryDoc, q: string): string | null {
  const t = q.trim().toLowerCase();
  if (!t) return "";
  if (d.title.toLowerCase().includes(t)) return "Matched in title";
  if (d.ref.toLowerCase().includes(t)) return "Matched in reference number";
  const s = d.sections.find((x) => x.text.toLowerCase().includes(t));
  if (s) return s.kind === "Body text" ? "Matched in document text" : `Matched in ${s.kind.toLowerCase()} section`;
  if (d.recommendations?.some((r) => r.title.toLowerCase().includes(t))) return "Matched in recommendation section";
  if (d.topics.some((x) => x.toLowerCase().includes(t))) return "Matched in topic";
  if (d.institution.toLowerCase().includes(t)) return "Matched in institution";
  if (d.summary.toLowerCase().includes(t)) return "Matched in summary";
  return null;
}

export function relatedDocs(d: LibraryDoc, n = 3) {
  return publicDocuments
    .filter((x) => x.id !== d.id)
    .map((x) => ({ x, s: x.topics.filter((t) => d.topics.includes(t)).length * 2 + (x.institution === d.institution ? 3 : 0) + (x.type === d.type ? 1 : 0) }))
    .filter((r) => r.s > 0).sort((a, b) => b.s - a.s).slice(0, n).map((r) => r.x);
}
