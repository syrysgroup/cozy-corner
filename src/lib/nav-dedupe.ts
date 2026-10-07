/** Normalises a destination so labels/translations never matter: drops query, hash and trailing slash. */
export function normalizeDestination(href: string): string {
  const base = href.split(/[?#]/)[0].trim().toLowerCase();
  return base.length > 1 ? base.replace(/\/+$/, "") || "/" : base;
}

/** Main-nav sections whose destination is absent from the utility bar (and IntegrityLine, which is always in the top bar). */
export function selectMainNav<T extends { slug: string }>(sections: T[], utility: [string, string][], reserved: string[] = ["/integrityline"]): T[] {
  const taken = new Set([...utility.map(([, to]) => normalizeDestination(to)), ...reserved.map(normalizeDestination)]);
  const seen = new Set<string>();
  return sections.filter((s) => {
    const d = normalizeDestination(`/${s.slug}`);
    if (taken.has(d) || seen.has(d)) return false;
    seen.add(d);
    return true;
  });
}

/** Utility links with duplicate destinations removed (first wins). */
export function dedupeLinks(links: [string, string][]): [string, string][] {
  const seen = new Set<string>();
  return links.filter(([, to]) => { const d = normalizeDestination(to); if (seen.has(d)) return false; seen.add(d); return true; });
}
