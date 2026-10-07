import { test, expect } from "bun:test";
import { latestHomepagePublications } from "./home-data";

const publication = (title, year, publishedAt) => ({ title, year, publishedAt, type: "Report", institution: "Test", language: "EN", tone: "green" });
const records = [publication("old", "2021"), publication("middle", "2023"), publication("newest", "2026"), publication("recent", "2025"), publication("fourth", "2022"), publication("third", "2024")];
test("homepage displays only four publications", () => {
  expect(latestHomepagePublications(records)).toHaveLength(4);
});
test("homepage selects the latest publications first", () => {
  expect(latestHomepagePublications(records).map(p => p.title)).toEqual(["newest", "recent", "third", "middle"]);
});
test("publication dates determine order within the same year", () => {
  const sameYear = [publication("earlier", "2026", "2026-01-10"), publication("later", "2026", "2026-09-05")];
  expect(latestHomepagePublications(sameYear).map(p => p.title)).toEqual(["later", "earlier"]);
});