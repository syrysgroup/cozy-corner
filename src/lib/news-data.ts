/**
 * Sole OAG public-news boundary. Empty until approved OAG news is published —
 * replace the body of `loadPublishedNews` with the authorised CMS/API keeping the shape.
 * Only published, approved language versions may be returned. Never hardcode articles in pages.
 * ECOWAS Community stories stay in `ecowas-news-data.ts` with their own attribution.
 */
import type { Lang } from "@/lib/i18n";

export const NEWS_CATEGORIES = [
  { slug: "press-releases", label: "Press releases", kind: "article" },
  { slug: "statements", label: "Statements", kind: "article" },
  { slug: "speeches", label: "Speeches", kind: "article" },
  { slug: "events", label: "Events", kind: "article" },
  { slug: "photos", label: "Photos", kind: "media" },
  { slug: "videos", label: "Videos", kind: "media" },
  { slug: "resources", label: "Media resources", kind: "media" },
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number]["slug"];

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  category: NewsCategory;
  /** ISO date */
  date: string;
  summary: string;
  body?: string[];
  image?: string;
  /** Approved language versions only. */
  languages: Lang[];
  href: string;
};

async function loadPublishedNews(): Promise<NewsItem[]> {
  return [];
}

export function newsPath(slug: string) { return `/news/${slug}`; }
export function categoryLabel(slug: string) { return NEWS_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug; }

export async function fetchNews(opts: { category?: NewsCategory; query?: string; year?: number; lang?: Lang } = {}): Promise<NewsItem[]> {
  const term = opts.query?.trim().toLowerCase();
  return (await loadPublishedNews())
    .filter((n) => !opts.category || n.category === opts.category)
    .filter((n) => !opts.year || new Date(n.date).getUTCFullYear() === opts.year)
    .filter((n) => !opts.lang || n.languages.includes(opts.lang))
    .filter((n) => !term || `${n.title} ${n.summary}`.toLowerCase().includes(term))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function fetchLatestNews(limit = 3): Promise<NewsItem[]> {
  return (await fetchNews()).slice(0, limit);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  return (await loadPublishedNews()).find((n) => n.slug === slug) ?? null;
}
