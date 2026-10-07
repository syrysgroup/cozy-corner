/**
 * Homepage content, ILLUSTRATIVE PLACEHOLDER DATA ONLY.
 * None of these figures are real OAG statistics. Replace each export with an
 * authorised data source (e.g. a fetcher returning the same shape) before launch.
 */
export const PLACEHOLDER_NOTICE = "Illustrative placeholder data, not official OAG figures.";

export type Metric = { key: string; label: string; value: number; suffix?: string; note: string };
export const intelligenceMetrics: Metric[] = [
  { key: "audits", label: "Audits", value: 38, note: "engagements in the sample cycle" },
  { key: "institutions", label: "Institutions", value: 12, note: "within the audit mandate" },
  { key: "recommendations", label: "Recommendations", value: 940, note: "issued across reports" },
  { key: "followups", label: "Follow-ups", value: 64, suffix: "%", note: "reviewed this period" },
];

export type RecStatus = { implemented: number; inProgress: number; notStarted: number };
export type Country = {
  code: string; name: string; x: number; y: number;
  institutions: string[]; audits: number; findings: number; recs: RecStatus;
};
/* x/y are positions on a simplified schematic of West Africa (0–100 grid). */
export const countries: Country[] = [
  { code: "SN", name: "Senegal", x: 10, y: 30, institutions: ["Sample regional agency"], audits: 3, findings: 2, recs: { implemented: 14, inProgress: 6, notStarted: 2 } },
  { code: "GM", name: "The Gambia", x: 11, y: 37, institutions: ["Sample institution"], audits: 1, findings: 1, recs: { implemented: 4, inProgress: 2, notStarted: 1 } },
  { code: "GW", name: "Guinea-Bissau", x: 12, y: 43, institutions: ["Sample office"], audits: 1, findings: 1, recs: { implemented: 3, inProgress: 3, notStarted: 2 } },
  { code: "GN", name: "Guinea", x: 19, y: 49, institutions: ["Sample agency"], audits: 2, findings: 1, recs: { implemented: 6, inProgress: 4, notStarted: 2 } },
  { code: "SL", name: "Sierra Leone", x: 18, y: 59, institutions: ["Sample centre"], audits: 1, findings: 1, recs: { implemented: 5, inProgress: 2, notStarted: 1 } },
  { code: "LR", name: "Liberia", x: 24, y: 67, institutions: ["Sample office"], audits: 1, findings: 1, recs: { implemented: 4, inProgress: 3, notStarted: 1 } },
  { code: "CI", name: "Côte d’Ivoire", x: 34, y: 63, institutions: ["Sample development bank"], audits: 3, findings: 2, recs: { implemented: 12, inProgress: 5, notStarted: 3 } },
  { code: "GH", name: "Ghana", x: 45, y: 62, institutions: ["Sample regional unit"], audits: 2, findings: 2, recs: { implemented: 9, inProgress: 4, notStarted: 1 } },
  { code: "TG", name: "Togo", x: 51, y: 60, institutions: ["Sample bank"], audits: 2, findings: 1, recs: { implemented: 8, inProgress: 3, notStarted: 2 } },
  { code: "BJ", name: "Benin", x: 55, y: 57, institutions: ["Sample office"], audits: 1, findings: 1, recs: { implemented: 3, inProgress: 2, notStarted: 1 } },
  { code: "NG", name: "Nigeria", x: 66, y: 52, institutions: ["Sample Commission", "Sample Parliament", "Sample Court"], audits: 9, findings: 6, recs: { implemented: 41, inProgress: 18, notStarted: 7 } },
  { code: "CV", name: "Cabo Verde", x: 2, y: 24, institutions: ["Sample office"], audits: 1, findings: 0, recs: { implemented: 2, inProgress: 1, notStarted: 0 } },
];

export type Publication = { title: string; type: string; year: string; publishedAt?: string; institution: string; language: string; tone: "ocean" | "green" | "brown" | "slate" };
/** Prefer authorised publication dates; existing samples provide only a year. */
export function latestHomepagePublications(records: readonly Publication[]): Publication[] {
  const timestamp = (record: Publication) => {
    const exact = record.publishedAt ? Date.parse(record.publishedAt) : NaN;
    return Number.isFinite(exact) ? exact : Date.UTC(Number(record.year) || 0, 0, 1);
  };
  return [...records].sort((a, b) => timestamp(b) - timestamp(a)).slice(0, 4);
}
export const publications: Publication[] = [
  { title: "Annual Activity Report", type: "Annual report", year: "2025", institution: "Office of the Auditor General", language: "EN · FR · PT", tone: "ocean" },
  { title: "Performance Audit of Regional Programme Delivery", type: "Audit report", year: "2025", institution: "Sample Commission", language: "EN · FR", tone: "green" },
  { title: "Follow-up Review of Prior Recommendations", type: "Follow-up report", year: "2024", institution: "Multiple institutions", language: "EN", tone: "brown" },
  { title: "Guide to Internal Control Self-Assessment", type: "Guidance", year: "2024", institution: "Office of the Auditor General", language: "EN · FR · PT", tone: "slate" },
  { title: "Compliance Audit of Procurement Processes", type: "Audit report", year: "2024", institution: "Sample Agency", language: "FR", tone: "ocean" },
];

export const insights = [
  { topic: "Strengthening grant monitoring", institution: "Sample Agency", type: "Performance audit", date: "Sep 2026", summary: "How clearer reporting milestones help institutions track programme results." },
  { topic: "Asset registers and stewardship", institution: "Sample Commission", type: "Compliance audit", date: "Jul 2026", summary: "Common lessons on keeping fixed-asset records complete and verifiable." },
  { topic: "Closing the recommendation loop", institution: "Multiple institutions", type: "Follow-up review", date: "May 2026", summary: "Practices that shorten the time from finding to implemented action." },
];

export type OppKind = "Careers" | "Procurement" | "Consultancies" | "Tenders";
export const opportunities: { kind: OppKind; title: string; ref: string; closes: string; location: string }[] = [
  { kind: "Careers", title: "Senior Performance Auditor", ref: "OAG/HR/S-01", closes: "30 Nov 2026", location: "Abuja" },
  { kind: "Careers", title: "Graduate Audit Trainee Programme", ref: "OAG/HR/S-02", closes: "15 Dec 2026", location: "Abuja" },
  { kind: "Procurement", title: "Supply of audit analytics licences", ref: "OAG/PR/S-11", closes: "12 Nov 2026", location: "Remote" },
  { kind: "Consultancies", title: "IT audit methodology specialist", ref: "OAG/CN/S-04", closes: "20 Nov 2026", location: "Hybrid" },
  { kind: "Tenders", title: "Translation services framework (EN/FR/PT)", ref: "OAG/TD/S-07", closes: "5 Dec 2026", location: "Regional" },
  { kind: "Consultancies", title: "Training facilitator, public-sector audit", ref: "OAG/CN/S-05", closes: "28 Nov 2026", location: "Regional" },
];
