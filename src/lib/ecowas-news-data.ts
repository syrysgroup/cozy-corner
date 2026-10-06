const ECOWAS_API = "https://www.ecowas.int/wp-json/wp/v2/posts";
const ECOWAS_HOSTS = new Set(["ecowas.int", "www.ecowas.int"]);

export type EcowasNewsItem = {
  id: number;
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  href: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeEcowasUrl(value: unknown): string | undefined {
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
  const perPage = Math.min(8, Math.max(1, Math.floor(limit)));
  const url = new URL(ECOWAS_API);
  url.searchParams.set("categories", "12");
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("_embed", "1");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    credentials: "omit",
    signal,
  });
  if (!response.ok) throw new Error(`ECOWAS news request failed (${response.status})`);

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("ECOWAS news response was not a list");

  return payload.flatMap((entry): EcowasNewsItem[] => {
    if (!isRecord(entry) || typeof entry.id !== "number" || typeof entry.date !== "string") return [];
    const title = renderedText(entry.title);
    const href = safeEcowasUrl(entry.link);
    if (!title || !href || Number.isNaN(Date.parse(entry.date))) return [];
    return [{
      id: entry.id,
      title,
      publishedAt: entry.date,
      summary: summarize(renderedText(entry.excerpt)),
      image: featuredImage(entry),
      href,
    }];
  });
}