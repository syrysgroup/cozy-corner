import type { Vacancy, CareerArea, ContractType } from "./careers-data";
import type { ProcurementNotice, NoticeType, NoticeStatus } from "./procurement-data";

export const DEFAULT_VACANCY_FILTERS = { area: "all", contract: "all" } as const;
export const DEFAULT_NOTICE_FILTERS = { q: "", type: "all", status: "all" } as const;

export function filterVacancies(records: Vacancy[], area: CareerArea | "all", contract: ContractType | "all") {
  return records.filter((record) => (area === "all" || record.area === area) && (contract === "all" || record.contract === contract));
}

export function filterNotices(records: ProcurementNotice[], q: string, type: NoticeType | "all", status: NoticeStatus | "all") {
  const term = q.trim().toLowerCase();
  return records.filter((record) => (type === "all" || record.type === type) && (status === "all" || record.status === status) && (!term || `${record.title} ${record.reference} ${record.institution}`.toLowerCase().includes(term)));
}

export function noticeSearchParams(params: URLSearchParams, q: string) {
  const next = new URLSearchParams(params);
  q ? next.set("q", q) : next.delete("q");
  return next;
}