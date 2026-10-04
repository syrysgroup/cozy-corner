/**
 * Centralised News source. Empty until approved OAG news is published —
 * replace the body of `fetchLatestNews` with the authorised CMS/API keeping the shape.
 * Never hardcode articles in pages.
 */
export type NewsItem = { id: string; title: string; category: string; date: string; summary: string; image?: string; href: string };

export async function fetchLatestNews(limit = 3): Promise<NewsItem[]> {
  const items: NewsItem[] = [];
  return items.slice(0, limit);
}
