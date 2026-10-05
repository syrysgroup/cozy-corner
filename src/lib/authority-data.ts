import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuthorityChair = {
  id: string;
  fullName: string;
  honorific: string;
  countryName: string;
  officialTitle: string;
  role: string;
  portrait?: { src: string; alt: string };
  startDate?: string;
  endDate?: string;
  status: "current" | "previous";
  officialSource?: string;
};

type Row = Record<string, unknown>;
const CURRENT_CHAIR_PORTRAIT = "https://unglyahbvxpmcczzhflx.supabase.co/storage/v1/object/public/institution-assets/Leadership/chairman-authority-2026-2027.png";
const toChair = (r: Row): AuthorityChair => ({
  id: String(r.id),
  fullName: String(r.full_name),
  honorific: String(r.honorific ?? "H.E."),
  countryName: String(r.country_name),
  officialTitle: String(r.official_title),
  role: String(r.role),
  portrait: r.portrait_bucket && r.portrait_path
    ? { src: supabase.storage.from(String(r.portrait_bucket)).getPublicUrl(String(r.portrait_path)).data.publicUrl, alt: String(r.portrait_alt ?? `Official portrait of ${r.full_name}`) }
    : r.status === "current"
      ? { src: CURRENT_CHAIR_PORTRAIT, alt: String(r.portrait_alt ?? `Official portrait of ${r.full_name}`) }
    : undefined,
  startDate: (r.start_date as string) ?? undefined,
  endDate: (r.end_date as string) ?? undefined,
  status: r.status === "current" ? "current" : "previous",
  officialSource: (r.official_source as string) ?? undefined,
});

let request: Promise<AuthorityChair[]> | undefined;

const CURRENT_CHAIR_FALLBACK: AuthorityChair = {
  id: "authority-chair-2026-2027",
  fullName: "Bassirou Diomaye Faye",
  honorific: "H.E.",
  countryName: "Senegal",
  officialTitle: "Chairman of the Authority",
  role: "President of the Republic of Senegal",
  portrait: { src: CURRENT_CHAIR_PORTRAIT, alt: "Official portrait of H.E. Bassirou Diomaye Faye" },
  status: "current",
};

/** Published ECOWAS Authority chairs (current first, then archive). Read-only. */
export function useAuthorityChairs() {
  const [chairs, setChairs] = useState<AuthorityChair[] | null>(null);
  useEffect(() => {
    let active = true;
    // Table is newer than generated types; cast keeps the query typed loosely.
    request ??= (supabase.from("authority_chairs" as never) as any)
      .select("*").eq("is_published", true).order("start_date", { ascending: false, nullsFirst: false })
      .then(({ data }: { data: Row[] | null }) => (data ?? []).map(toChair));
    request!.then((v) => active && setChairs(v.length ? v : [CURRENT_CHAIR_FALLBACK])).catch(() => active && setChairs([CURRENT_CHAIR_FALLBACK]));
    return () => { active = false; };
  }, []);
  return {
    loading: chairs === null,
    current: chairs?.find((c) => c.status === "current"),
    archive: chairs?.filter((c) => c.status === "previous") ?? [],
  };
}

export const formatChairDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : undefined;
