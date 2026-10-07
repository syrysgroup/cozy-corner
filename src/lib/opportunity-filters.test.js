import { test, expect } from "bun:test";
import { filterVacancies, filterNotices, noticeSearchParams, DEFAULT_VACANCY_FILTERS, DEFAULT_NOTICE_FILTERS } from "./opportunity-filters";
import { fetchNotices } from "./procurement-data";

// Isolated fixtures, never imported by the application.
const vacancies = [{ id: "test-financial", career_area: "financial", employment_status: "Permanent" }, { id: "test-it", career_area: "it", employment_status: "Consultancy" }];
const notices = [
  { id: "test-open", title: "Audit equipment", reference: "TEST-001", institution: "Test Office", type: "tender", status: "open" },
  { id: "test-closed", title: "Translation", reference: "TEST-002", institution: "Test Parliament", type: "request-for-quotation", status: "closed" },
];
test("career area filters published vacancies", () => expect(filterVacancies(vacancies, "it", "all").map(v => v.id)).toEqual(["test-it"]));
test("contract filters combine with career area", () => expect(filterVacancies(vacancies, "it", "Permanent")).toEqual([]));
test("vacancy reset restores all records", () => expect(filterVacancies(vacancies, DEFAULT_VACANCY_FILTERS.area, DEFAULT_VACANCY_FILTERS.contract)).toHaveLength(2));
for (const q of [" AUDIT ", "test-001", "test office"]) test(`notice search matches title, reference or institution: ${q}`, () => expect(filterNotices(notices, q, "all", "all").map(n => n.id)).toEqual(["test-open"]));
test("notice type and status filters combine with search", () => expect(filterNotices(notices, "Translation", "request-for-quotation", "open")).toEqual([]));
test("notice reset clears search, type and status", () => expect(filterNotices(notices, DEFAULT_NOTICE_FILTERS.q, DEFAULT_NOTICE_FILTERS.type, DEFAULT_NOTICE_FILTERS.status)).toHaveLength(2));
test("search is URL-keyed without dropping other parameters", () => expect(noticeSearchParams(new URLSearchParams("lang=fr"), "audit").toString()).toBe("lang=fr&q=audit"));
test("clearing search removes its URL parameter", () => expect(noticeSearchParams(new URLSearchParams("q=audit&lang=fr"), "").toString()).toBe("lang=fr"));
test("no invented procurement notices are published", async () => expect(await fetchNotices()).toEqual([]));