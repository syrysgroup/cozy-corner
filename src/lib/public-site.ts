import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Lang } from "@/lib/i18n";

type PublicSite = { assets: Tables<"site_assets">[]; content: Tables<"site_content">[] };
let request: Promise<PublicSite> | undefined;

export function usePublicSite() {
  const [data, setData] = useState<PublicSite>({ assets: [], content: [] });
  useEffect(() => {
    let active = true;
    request ??= Promise.all([
      supabase.from("site_assets").select("*").eq("is_active", true).order("display_order"),
      supabase.from("site_content").select("*").eq("is_published", true).eq("section", "header").order("display_order"),
    ]).then(([assets, content]) => ({ assets: assets.data ?? [], content: content.data ?? [] }));
    request.then((value) => { if (active) setData(value); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return data;
}

export function useOfficialAsset(key: string, fallback: string) {
  const { assets } = usePublicSite();
  const asset = assets.find((item) => item.asset_key === key);
  return asset ? { src: supabase.storage.from(asset.bucket_id).getPublicUrl(asset.storage_path).data.publicUrl, alt: asset.alt_text } : { src: fallback, alt: undefined };
}

export function useUtilityNavigation(lang: Lang, fallback: [string, string][]): [string, string][] {
  const { content } = usePublicSite();
  const value = content.find((item) => item.content_key === "utility_navigation")?.content;
  if (!value || typeof value !== "object" || Array.isArray(value) || !Array.isArray(value.items)) return fallback;
  const links: [string, string][] = [];
  for (const item of value.items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const label = item.label;
    if (!label || typeof label !== "object" || Array.isArray(label)) continue;
    const translated = label[lang];
    if (typeof translated === "string" && typeof item.href === "string" && (/^\/(?!\/)/.test(item.href) || /^https:\/\//.test(item.href))) links.push([translated, item.href]);
  }
  return links.length ? links : fallback;
}