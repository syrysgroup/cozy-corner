/**
 * Transparency & data intelligence, ILLUSTRATIVE PLACEHOLDER DATA ONLY.
 * None of these figures are official OAG statistics.
 * Integration point: replace the body of `fetchTransparencyData` with a call to an
 * authorised API that returns the same `TransparencyData` shape. Pages only consume
 * the fetcher, never the constants directly.
 */
import { countries, type Country } from "@/lib/home-data";
import { publicDocuments } from "@/lib/library-data";

export const DATA_NOTICE = "Illustrative placeholder data, not official OAG figures.";

export type Kpi = { key: string; label: string; value: number; suffix?: string; delta: string; question: string };
export type YearPoint = { year: string; audits: number; reports: number };
export type Theme = { name: string; count: number };
export type RecSplit = { implemented: number; inProgress: number; notStarted: number };
export type RecTrend = { year: string } & RecSplit;
export type Risk = { level: "Low" | "Moderate" | "High" | "Critical"; count: number };
export type Institution = { name: string; short: string; country: string; audits: number; reportsPublished: number; recs: RecSplit; lastPublished: string };
export type Milestone = { date: string; title: string; kind: "Report" | "Follow-up" | "Plan" | "Annual" };

export type TransparencyData = {
  updated: string;
  kpis: Kpi[];
  activity: YearPoint[];
  auditTypes: { type: string; count: number }[];
  themes: Theme[];
  recTotals: RecSplit;
  recTrend: RecTrend[];
  risks: Risk[];
  institutions: Institution[];
  timeline: Milestone[];
  countries: Country[];
};

const DATA: TransparencyData = {
  updated: "Sample snapshot · Q3 2026",
  kpis: [
    { key: "audits", label: "Audits completed", value: 38, delta: "+6 on prior cycle", question: "How much audit work was done?" },
    { key: "reports", label: "Reports published", value: 126, delta: "+14 this year", question: "What has been made public?" },
    { key: "impl", label: "Recommendations implemented", value: 61, suffix: "%", delta: "+9 pts year on year", question: "Are findings acted on?" },
    { key: "coverage", label: "Institutions covered", value: 12, delta: "of 12 in mandate", question: "Who falls within scope?" },
  ],
  activity: [
    { year: "2020", audits: 18, reports: 11 },
    { year: "2021", audits: 22, reports: 15 },
    { year: "2022", audits: 27, reports: 19 },
    { year: "2023", audits: 30, reports: 24 },
    { year: "2024", audits: 32, reports: 26 },
    { year: "2025", audits: 38, reports: 31 },
  ],
  auditTypes: [
    { type: "Financial", count: 16 },
    { type: "Compliance", count: 11 },
    { type: "Performance", count: 8 },
    { type: "Special review", count: 3 },
  ],
  themes: [
    { name: "Financial reporting", count: 42 },
    { name: "Procurement", count: 35 },
    { name: "Asset management", count: 27 },
    { name: "Human resources", count: 21 },
    { name: "IT governance", count: 16 },
    { name: "Programme delivery", count: 13 },
  ],
  recTotals: { implemented: 573, inProgress: 254, notStarted: 113 },
  recTrend: [
    { year: "2021", implemented: 38, inProgress: 34, notStarted: 28 },
    { year: "2022", implemented: 45, inProgress: 32, notStarted: 23 },
    { year: "2023", implemented: 51, inProgress: 30, notStarted: 19 },
    { year: "2024", implemented: 56, inProgress: 29, notStarted: 15 },
    { year: "2025", implemented: 61, inProgress: 27, notStarted: 12 },
  ],
  risks: [
    { level: "Low", count: 312 },
    { level: "Moderate", count: 386 },
    { level: "High", count: 188 },
    { level: "Critical", count: 54 },
  ],
  institutions: [
    { name: "ECOWAS Commission", short: "Commission", country: "Nigeria", audits: 9, reportsPublished: 28, recs: { implemented: 41, inProgress: 18, notStarted: 7 }, lastPublished: "Sep 2025" },
    { name: "ECOWAS Parliament", short: "Parliament", country: "Nigeria", audits: 4, reportsPublished: 12, recs: { implemented: 19, inProgress: 8, notStarted: 3 }, lastPublished: "Jun 2025" },
    { name: "ECOWAS Court of Justice", short: "Court", country: "Nigeria", audits: 3, reportsPublished: 9, recs: { implemented: 14, inProgress: 4, notStarted: 2 }, lastPublished: "Mar 2025" },
    { name: "ECOWAS Bank for Investment and Development", short: "EBID", country: "Togo", audits: 4, reportsPublished: 11, recs: { implemented: 17, inProgress: 6, notStarted: 4 }, lastPublished: "Aug 2025" },
    { name: "West African Health Organisation", short: "WAHO", country: "Burkina Faso", audits: 3, reportsPublished: 10, recs: { implemented: 12, inProgress: 7, notStarted: 2 }, lastPublished: "Jul 2025" },
    { name: "GIABA", short: "GIABA", country: "Senegal", audits: 3, reportsPublished: 8, recs: { implemented: 11, inProgress: 5, notStarted: 3 }, lastPublished: "May 2025" },
    { name: "ECOWAS Regional Electricity Regulatory Authority", short: "ERERA", country: "Ghana", audits: 2, reportsPublished: 6, recs: { implemented: 7, inProgress: 4, notStarted: 1 }, lastPublished: "Feb 2025" },
    { name: "Sample regional agency", short: "Agency", country: "Côte d’Ivoire", audits: 2, reportsPublished: 5, recs: { implemented: 6, inProgress: 5, notStarted: 3 }, lastPublished: "Nov 2024" },
  ],
  timeline: [
    { date: "Jan 2025", title: "Annual audit plan approved", kind: "Plan" },
    { date: "Mar 2025", title: "Court of Justice financial audit published", kind: "Report" },
    { date: "Jul 2025", title: "WAHO procurement performance audit published", kind: "Report" },
    { date: "Sep 2025", title: "Commission financial audit published", kind: "Report" },
    { date: "Nov 2025", title: "Follow-up review of prior recommendations", kind: "Follow-up" },
    { date: "Feb 2026", title: "Annual Activity Report released", kind: "Annual" },
  ],
  countries,
};

/** Swap for an authorised API call; keep the return shape. */
export async function fetchTransparencyData(): Promise<TransparencyData> {
  return Promise.resolve(DATA);
}

/** Only public library documents may be linked from dashboards. */
export function reportsForCountry(country: string) {
  return publicDocuments.filter((d) => d.country === country).slice(0, 3);
}

export const recTotal = (r: RecSplit) => r.implemented + r.inProgress + r.notStarted;
export const pctOf = (n: number, t: number) => (t ? Math.round((n / t) * 100) : 0);
