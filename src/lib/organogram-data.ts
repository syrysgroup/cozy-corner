import sourcePages from "@/assets/approved-organogram-pages.json";
import sourcePdf from "@/assets/approved-ecowas-organogram.asset.json";
import rows from "@/assets/approved-organogram-hierarchy.json";

export type OrganogramNode = { id: string; parent?: string; title: string; grade?: string; page: number; note?: string };
export type ApprovedOrganogram = { key: string; nodes: OrganogramNode[]; pages: { page: number; url: string }[]; notice: string; pdf: string };

/** Only visually checked relationships from the supplied source; never OCR-inferred lines. */
export function getApprovedOrganogram(key: string): ApprovedOrganogram | undefined {
  const pages = (sourcePages as Record<string, { page: number; url: string }[]>)[key];
  const nodes = (rows as Record<string, OrganogramNode[]>)[key];
  if (!pages || !nodes) return undefined;
  const proposal = ["parliament", "ppdu", "rcsdc"].includes(key);
  return {
    key, pages, nodes, pdf: sourcePdf.url,
    notice: `Transcribed overview from the supplied approved English collection. ${proposal ? "This institution’s source page retains a “proposed” heading. " : ""}The collection includes charts dated May 2018; these are source structures, not confirmation of the current establishment. Original pages retain all detailed posts, annotations and shared-service arrangements.`,
  };
}

export function hierarchyDepth(node: OrganogramNode, nodes: OrganogramNode[]): number {
  const parent = nodes.find((item) => item.id === node.parent);
  return parent ? 1 + hierarchyDepth(parent, nodes) : 0;
}