import { test, expect } from "bun:test";
import { ecowasNewsPath, safeEcowasUrl, fetchEcowasArticle } from "./ecowas-news-data.ts";

test("each official news source ID has its own local brief page", () => {
  expect(ecowasNewsPath(134207)).toBe("/knowledge/ecowas-news/134207");
  expect(ecowasNewsPath(134185)).toBe("/knowledge/ecowas-news/134185");
});

test("full-article links point only to the official HTTPS ECOWAS site", () => {
  expect(safeEcowasUrl("https://www.ecowas.int/news/official-update/")).toBe("https://www.ecowas.int/news/official-update/");
  expect(safeEcowasUrl("https://www.ecowas.int.evil.example/news/")).toBeUndefined();
  expect(safeEcowasUrl("javascript:alert(1)")).toBeUndefined();
});

test("invalid article identifiers are rejected before a source request", async () => {
  expect(await fetchEcowasArticle("134207&categories=1")).toBeNull();
});