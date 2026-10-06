import { test, expect } from "bun:test";
import rows from "../assets/approved-organogram-hierarchy.json";
import pages from "../assets/approved-organogram-pages.json";
import { getApprovedOrganogram, hierarchyDepth } from "./organogram-data.ts";

test("approved OAG hierarchy and table share the source's audit reporting branches", () => {
  const chart = getApprovedOrganogram("oag");
  expect(chart).toBeDefined();
  const internalAudit = chart.nodes.find((node) => node.title === "Director Internal Audit");
  const performanceAudit = chart.nodes.find((node) => node.title === "Director Program Performance Audit");
  expect(internalAudit.parent).toBe("0");
  expect(performanceAudit.parent).toBe("0");
  expect(internalAudit.page).toBe(33);
  expect(hierarchyDepth(internalAudit, chart.nodes)).toBe(1);
});

test("every approved hierarchy parent exists and all source pages belong to its institution", () => {
  for (const [key, nodes] of Object.entries(rows)) {
    const ids = nodes.map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const node of nodes) {
      if (node.parent !== undefined) expect(ids).toContain(node.parent);
      expect(pages[key].map((page) => page.page)).toContain(node.page);
      const visited = new Set();
      let cursor = node;
      while (cursor) {
        expect(visited.has(cursor.id)).toBe(false);
        visited.add(cursor.id);
        cursor = nodes.find((parent) => parent.id === cursor.parent);
      }
    }
  }
});

test("Parliament source remains labelled proposed rather than current approved establishment", () => {
  const chart = getApprovedOrganogram("parliament");
  expect(chart.pages[0].page).toBe(22);
  expect(chart.notice).toContain("proposed");
  expect(chart.notice).toContain("not confirmation of the current establishment");
});

test("institutions absent from the PDF do not receive invented approved reporting hierarchies", () => {
  expect(getApprovedOrganogram("authority")).toBeUndefined();
  expect(getApprovedOrganogram("ebid")).toBeUndefined();
});