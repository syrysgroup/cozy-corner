import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight, FileText, Minus, Plus, RotateCcw, Network, Table2, Image, Search } from "lucide-react";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { getApprovedOrganogram, hierarchyDepth, type OrganogramNode } from "@/lib/organogram-data";
import { cn } from "@/lib/utils";
import { OrganogramNavigation } from "./organogram-navigation";
import { institutionAssetUrl } from "@/lib/institution-data";

type Profile = { name: string; shortName?: string; structure: string[]; organogramPath?: string };
export function InteractiveOrganogram({ p, parentPath }: { p: Profile; parentPath: string }) {
  const approved = getApprovedOrganogram(parentPath.split("/").pop() ?? "");
  const [view, setView] = useState<"hierarchy" | "table" | "original">("hierarchy");
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>();
  const [zoom, setZoom] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const nodes = approved?.nodes ?? [];
  const selectedNode = nodes.find((n) => n.id === selected);
  const page = approved?.pages[pageIndex];
  const toggle = (id: string) => setCollapsed((old) => old.includes(id) ? old.filter((v) => v !== id) : [...old, id]);
  const tabs: { id: "hierarchy" | "table" | "original"; label: string; icon: typeof Network }[] = [
    { id: "hierarchy", label: approved ? "Hierarchy" : "Summary", icon: Network },
    { id: "table", label: "Table", icon: Table2 },
    ...(approved || p.organogramPath ? [{ id: "original" as const, label: "Original", icon: Image }] : []),
  ];
  const branch = (node: OrganogramNode): ReactNode => {
    const children = nodes.filter((n) => n.parent === node.id);
    const closed = collapsed.includes(node.id);
    return <li key={node.id} className="min-w-0">
      <div className={cn("flex items-center gap-2 border bg-card p-2", selected === node.id ? "border-primary bg-primary-soft" : "border-border")}>
        {children.length ? <Button variant="ghost" size="icon" aria-label={`${closed ? "Expand" : "Collapse"} ${node.title}`} aria-expanded={!closed} onClick={() => toggle(node.id)}>{closed ? <ChevronRight /> : <ChevronDown />}</Button> : <span className="w-10 shrink-0" aria-hidden />}
        <Button variant="ghost" className="h-auto min-h-11 flex-1 justify-start whitespace-normal px-2 py-2 text-left" onClick={() => setSelected(node.id)} aria-pressed={selected === node.id}>{node.title}</Button>
        <span className="shrink-0 pr-2 font-mono text-xs text-primary">{node.grade ?? "N/A"}</span>
      </div>
      {children.length > 0 && !closed && <ul className="ml-4 mt-3 grid gap-3 border-l-2 border-border pl-3 sm:ml-7 sm:pl-5">{children.map(branch)}</ul>}
    </li>;
  };
  return <Container as="section" className="py-section-lg">
    <Link to={parentPath} className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary hover:underline"><ArrowLeft className="size-4" />{p.shortName ?? p.name}</Link>
    <p className="overline mt-8 flex items-center gap-2 text-primary"><Network className="size-4" />Institutional structure</p>
    <h1 className="mt-3 font-display text-h1">{p.shortName ?? p.name} organogram</h1>
    <p className="mt-4 max-w-4xl text-small leading-relaxed text-muted-foreground">{approved?.notice ?? "Illustrative summary only, not an official organogram. This institution is not covered by the supplied collection; summary levels do not establish reporting lines."}</p>
    {approved && <Button asChild variant="tertiary" className="mt-4"><a href={approved.pdf} target="_blank" rel="noreferrer"><FileText />Source document · 71 pages</a></Button>}
    <div className="mt-8 overflow-hidden border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-sunken p-3">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Organogram views">{tabs.map(({id,label,icon:Icon}) => <Button key={id} variant="filter" role="tab" aria-selected={view === id} data-active={view === id} onClick={() => setView(id)}><Icon />{label}</Button>)}</div>
        <div className="flex items-center gap-1" role="toolbar" aria-label="Organogram controls">
          {view === "hierarchy" && approved && <Button variant="ghost" size="icon" title="Collapse all branches" aria-label="Collapse all branches" onClick={() => setCollapsed(nodes.map((n) => n.id))}><ChevronRight /></Button>}
          {view === "original" && <><Button variant="ghost" size="icon" title="Zoom out" aria-label="Zoom out" disabled={zoom === 0} onClick={() => setZoom((z) => z - 1)}><Minus /></Button><output className="w-14 text-center font-mono text-xs" aria-label="Zoom level">{[75,100,125,150][zoom]}%</output><Button variant="ghost" size="icon" title="Zoom in" aria-label="Zoom in" disabled={zoom === 3} onClick={() => setZoom((z) => z + 1)}><Plus /></Button></>}
          <Button variant="ghost" size="icon" title="Reset view" aria-label="Reset view" onClick={() => {setCollapsed([]);setSelected(undefined);setZoom(1);setQuery("");setPageIndex(0);setImageFailed(false);}}><RotateCcw /></Button>
        </div>
      </div>
      {view === "original" && approved && <div className="flex flex-wrap items-center gap-3 border-b border-border p-4"><label className="flex max-w-full items-center gap-3 text-small">Source page<select aria-label="Source page" value={pageIndex} onChange={(e) => {setPageIndex(Number(e.target.value));setImageFailed(false);}} className="h-11 min-w-0 border border-input bg-background px-3">{approved.pages.map((pg,i) => <option key={pg.page} value={i}>Page {pg.page}</option>)}</select></label>{page && <a href={`${approved.pdf}#page=${page.page}`} target="_blank" rel="noreferrer" className="text-small font-semibold text-primary hover:underline">Open page in PDF</a>}</div>}
      {view === "table" && <label className="m-4 flex items-center gap-3 border border-input px-3"><Search className="size-4 text-muted-foreground" /><span className="sr-only">Search positions or grades</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search positions or grades" className="h-11 min-w-0 flex-1 bg-card text-small outline-none" /></label>}
      <div role="tabpanel" className="overflow-auto p-4 md:p-8" tabIndex={0} aria-label="Organogram canvas">
        {view === "hierarchy" ? approved ? <ul className="mx-auto grid max-w-4xl gap-5" aria-label="Source hierarchy">{nodes.filter((n) => !n.parent).map(branch)}</ul> : <ol className="grid gap-3">{p.structure.map((s) => <li key={s} className="border-b border-border p-3 text-small">{s}</li>)}</ol>
        : view === "table" ? <table className="w-full min-w-[600px] border-collapse text-left text-small"><caption className="pb-4 text-left text-muted-foreground">{approved ? "Transcribed overview positions · complete establishment in original source pages" : "Illustrative summary, reporting relationships not supplied"}</caption><thead className="border-y border-border bg-surface-sunken"><tr>{["Level","Position / unit","Grade","Parent branch","Source"].map((h) => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead><tbody>{approved ? nodes.filter((n) => `${n.title} ${n.grade ?? ""}`.toLowerCase().includes(query.toLowerCase())).map((n) => <tr key={n.id} className="border-b border-border"><td className="p-3 font-mono">{hierarchyDepth(n,nodes) + 1}</td><th scope="row" className="max-w-xs p-3">{n.title}</th><td className="p-3 font-mono text-xs">{n.grade ?? "Not stated"}</td><td className="max-w-xs p-3 text-muted-foreground">{nodes.find((v) => v.id === n.parent)?.title ?? "Source root"}</td><td className="p-3"><a href={`${approved.pdf}#page=${n.page}`} target="_blank" rel="noreferrer" className="whitespace-nowrap text-primary hover:underline">Page {n.page}</a></td></tr>) : p.structure.filter((s) => s.toLowerCase().includes(query.toLowerCase())).map((s) => <tr key={s} className="border-b border-border"><td className="p-3">, </td><th scope="row" className="p-3">{s}</th><td className="p-3">Not supplied</td><td className="p-3">Not verified</td><td className="p-3">Summary</td></tr>)}</tbody></table>
        : page ? <div className={cn("mx-auto",zoom === 0 ? "w-3/4" : zoom === 1 ? "w-full" : zoom === 2 ? "w-[125%]" : "w-[150%]")}>{imageFailed ? <p role="alert">Chart image unavailable. <a className="text-primary underline" href={`${approved?.pdf}#page=${page.page}`} target="_blank" rel="noreferrer">Open the original PDF.</a></p> : <img src={page.url} alt={`Original institutional organogram, source page ${page.page}`} className="h-auto w-full" onError={() => setImageFailed(true)} />}</div> : p.organogramPath && <img src={institutionAssetUrl(p.organogramPath)} alt={`Official organogram of ${p.name}`} className="h-auto w-full" />}
      </div>
      {selectedNode && view === "hierarchy" && <div className="border-t border-border bg-primary-soft p-5" aria-live="polite"><p className="overline text-primary">Selected position · source page {selectedNode.page}</p><h2 className="mt-2 font-display text-h3">{selectedNode.title}</h2><p className="mt-2 text-small">Grade: {selectedNode.grade ?? "Not stated in the source"}</p>{selectedNode.note && <p className="mt-2 text-small text-muted-foreground">{selectedNode.note}</p>}</div>}
    </div>
    <OrganogramNavigation parentPath={parentPath} />
  </Container>;
}
