import { test, expect } from "bun:test";
import { selectMainNav, dedupeLinks } from "./nav-dedupe";

const sections = ["about", "audit", "news", "opportunities", "integrityline"].map((slug) => ({ slug }));

test("fallback utility destinations are not repeated in main nav", () => {
  const utility = [["Opportunities", "/opportunities"], ["Contact", "/contact"]];
  expect(selectMainNav(sections, utility).map((s) => s.slug)).toEqual(["about", "audit", "news"]);
});

test("published destinations with trailing slash or query are matched", () => {
  const utility = [["Actualités", "/news/?ref=top"], ["X", "/Opportunities/"]];
  expect(selectMainNav(sections, utility).map((s) => s.slug)).toEqual(["about", "audit"]);
});

test("duplicate utility links collapse to one", () => {
  expect(dedupeLinks([["A", "/contact"], ["B", "/contact/#x"]])).toEqual([["A", "/contact"]]);
});
