import { test, expect } from "bun:test";
import { ecowasNewsPath, safeEcowasUrl, fetchEcowasArticle, fetchEcowasNewsPage } from "./ecowas-news-data.ts";

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

test("pagination sends page size and search and reads source totals", async () => {
  const original = globalThis.fetch;
  let requested;
  globalThis.fetch = async (url) => {
    requested = new URL(url);
    return new Response("[]", { headers: { "X-WP-Total": "47", "X-WP-TotalPages": "3" } });
  };
  try {
    const result = await fetchEcowasNewsPage({ limit: 20, page: 2, query: " health " });
    expect(requested.searchParams.get("page")).toBe("2");
    expect(requested.searchParams.get("per_page")).toBe("20");
    expect(requested.searchParams.get("search")).toBe("health");
    expect(result.total).toBe(47);
    expect(result.totalPages).toBe(3);
    expect(result.hasNext).toBe(true);
    expect((await fetchEcowasNewsPage({ page: 3 })).hasNext).toBe(false);
  } finally { globalThis.fetch = original; }
});

test("missing headers do not invent pagination totals", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response("[]");
  try {
    const result = await fetchEcowasNewsPage();
    expect(result.total).toBeNull();
    expect(result.totalPages).toBeNull();
    expect(result.hasNext).toBe(false);
  } finally { globalThis.fetch = original; }
});


test("Community news requests newest stories first", async () => {
  const original = globalThis.fetch;
  let requested;
  globalThis.fetch = async (url) => { requested = new URL(url); return new Response("[]"); };
  try {
    await fetchEcowasNewsPage({ limit: 12 });
    expect(requested.searchParams.get("orderby")).toBe("date");
    expect(requested.searchParams.get("order")).toBe("desc");
  } finally { globalThis.fetch = original; }
});
