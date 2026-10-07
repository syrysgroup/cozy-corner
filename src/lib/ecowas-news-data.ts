const ECOWAS_API = "https://www.ecowas.int/wp-json/wp/v2/posts";
const ECOWAS_HOSTS = new Set(["ecowas.int", "www.ecowas.int"]);

export type EcowasNewsItem = {
  id: number;
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  href: string;
  /** Publisher of the retrieved feed, never inferred from the story subject. */
  source: string;
  body: EcowasArticleBlock[];
};

export type EcowasArticleBlock = { type: "paragraph" | "heading" | "quote" | "list"; text: string; items?: string[] };

/** Extract source text only; scripts, embeds and arbitrary markup never reach React. */
export function parseArticleBody(value: unknown): EcowasArticleBlock[] {
  if (!isRecord(value) || typeof value.rendered !== "string") return [];
  const doc = new DOMParser().parseFromString(value.rendered, "text/html");
  doc.querySelectorAll("script,style,iframe,form,nav,figure,table").forEach((node) => node.remove());
  const text = (node: Element) => node.textContent?.replace(/\s+/g, " ").trim() ?? "";
  return Array.from(doc.body.querySelectorAll("p,h2,h3,h4,blockquote,ul,ol")).flatMap((node): EcowasArticleBlock[] => {
    if (node.parentElement?.closest("blockquote,ul,ol")) return [];
    const content = text(node);
    if (!content) return [];
    if (node.matches("ul,ol")) return [{ type: "list", text: content, items: Array.from(node.querySelectorAll("li")).map(text).filter(Boolean) }];
    return [{ type: node.matches("h2,h3,h4") ? "heading" : node.matches("blockquote") ? "quote" : "paragraph", text: content }];
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function safeEcowasUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ECOWAS_HOSTS.has(url.hostname) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function renderedText(value: unknown): string {
  if (!isRecord(value) || typeof value.rendered !== "string") return "";
  return new DOMParser().parseFromString(value.rendered, "text/html").body.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function featuredImage(post: Record<string, unknown>): string | undefined {
  const embedded = isRecord(post._embedded) ? post._embedded : undefined;
  const mediaList = embedded?.["wp:featuredmedia"];
  const media = Array.isArray(mediaList) && isRecord(mediaList[0]) ? mediaList[0] : undefined;
  const details = media && isRecord(media.media_details) ? media.media_details : undefined;
  const sizes = details && isRecord(details.sizes) ? details.sizes : undefined;
  const large = sizes && isRecord(sizes.large) ? sizes.large.source_url : undefined;
  const medium = sizes && isRecord(sizes.medium_large) ? sizes.medium_large.source_url : undefined;
  return safeEcowasUrl(large) ?? safeEcowasUrl(medium) ?? safeEcowasUrl(media?.source_url);
}

function summarize(value: string): string {
  if (value.length <= 220) return value;
  return `${value.slice(0, 217).trimEnd()}…`;
}

export async function fetchEcowasNews(limit = 4, signal?: AbortSignal): Promise<EcowasNewsItem[]> {
  return (await fetchEcowasNewsPage({ limit, signal })).items;
}

export type EcowasNewsPageResult = {
  items: EcowasNewsItem[];
  total: number | null;
  totalPages: number | null;
  hasNext: boolean;
};

export async function fetchEcowasNewsPage({ limit = 20, page = 1, query = "", signal }: { limit?: number; page?: number; query?: string; signal?: AbortSignal } = {}): Promise<EcowasNewsPageResult> {
  const perPage = Math.min(100, Math.max(1, Math.floor(limit)));
  const url = new URL(ECOWAS_API);
  url.searchParams.set("categories", "12");
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("_embed", "1");
  url.searchParams.set("page", String(Math.max(1, Math.floor(page))));
  if (query.trim()) url.searchParams.set("search", query.trim());

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    credentials: "omit",
    signal,
  });
  if (!response.ok) throw new Error(`ECOWAS news request failed (${response.status})`);

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("ECOWAS news response was not a list");

  const items = parseEcowasPosts(payload);
  const headerNumber = (name: string) => {
    const value = response.headers.get(name);
    if (value === null || value.trim() === "") return null;
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : null;
  };
  const total = headerNumber("X-WP-Total");
  const totalPages = headerNumber("X-WP-TotalPages");
  return { items, total, totalPages, hasNext: totalPages !== null ? page < totalPages : payload.length === perPage };
}

function parseEcowasPosts(payload: unknown[]): EcowasNewsItem[] {
  return payload.flatMap((entry): EcowasNewsItem[] => {
    if (!isRecord(entry) || typeof entry.id !== "number" || typeof entry.date !== "string") return [];
    const title = renderedText(entry.title);
    const href = safeEcowasUrl(entry.link);
    if (!title || !href || Number.isNaN(Date.parse(entry.date))) return [];
    return [{
      id: entry.id,
      title,
      publishedAt: entry.date,
      summary: summarize(renderedText(entry.excerpt) || renderedText(entry.content)),
      image: featuredImage(entry),
      href,
      source: "ECOWAS",
      body: parseArticleBody(entry.content),
    }];
  });
}

export function ecowasNewsPath(id: number): string {
  return `/knowledge/ecowas-news/${id}`;
}

export async function fetchEcowasArticle(id: string, signal?: AbortSignal): Promise<EcowasNewsItem | null> {
  if (!/^\d+$/.test(id)) return null;
  const url = new URL(ECOWAS_API);
  url.searchParams.set("include", id);
  url.searchParams.set("categories", "12");
  url.searchParams.set("_embed", "1");
  const response = await fetch(url, { headers: { Accept: "application/json" }, credentials: "omit", signal });
  if (!response.ok) throw new Error(`ECOWAS news request failed (${response.status})`);
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("ECOWAS news response was not a list");
  return parseEcowasPosts(payload)[0] ?? null;
}