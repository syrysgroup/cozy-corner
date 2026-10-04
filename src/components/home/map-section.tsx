import { useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ds/shell/layout-parts";
import { cn } from "@/lib/utils";

type C = { id: string; name: string; pts: [number, number][]; institutions: string[] };
// Simplified outlines (lon, lat). Orientation only — not an authoritative boundary map.
const COUNTRIES: C[] = [
  { id: "ML", name: "Mali", institutions: [], pts: [[-12.2,14.7],[-11.4,15.5],[-10.7,15.1],[-5.5,15.5],[-6.5,25],[-4.8,25],[1.2,21],[4.2,19.1],[4.3,16.9],[3.6,15.4],[0.2,14.9],[-1.5,15],[-3.3,13.4],[-4.4,12.5],[-5.4,11.6],[-5.5,10.4],[-6.2,10.5],[-7.9,10.4],[-8.8,12.1],[-11.4,12.4],[-12.2,12.6]] },
  { id: "NE", name: "Niger", institutions: [], pts: [[3.6,11.7],[2.4,12.3],[0.9,13.2],[0.2,14.9],[3.6,15.4],[4.3,16.9],[4.2,19.1],[5.8,19.4],[12,23.5],[15,23],[15.9,20.4],[15.5,16],[13.6,13.7],[12,13.3],[9,12.8],[6.5,13.6],[4.1,13.5]] },
  { id: "SN", name: "Senegal", institutions: ["GIABA — Inter-Governmental Action Group against Money Laundering (Dakar)", "ECOWAS Gender Development Centre (Dakar)"], pts: [[-17.5,14.7],[-16.7,16.5],[-14,16.6],[-12.2,14.7],[-12.2,12.6],[-16.7,12.4]] },
  { id: "GM", name: "The Gambia", institutions: [], pts: [[-16.8,13.75],[-13.8,13.75],[-13.8,13.15],[-16.8,13.15]] },
  { id: "GW", name: "Guinea-Bissau", institutions: [], pts: [[-16.7,12.4],[-13.7,12.6],[-13.7,11],[-15,10.9],[-16.7,11.6]] },
  { id: "GN", name: "Guinea", institutions: [], pts: [[-15,10.9],[-13.7,11],[-13.7,12.6],[-11.4,12.4],[-8.8,12.1],[-7.9,10.4],[-8.2,7.6],[-9.5,8.5],[-10.7,9.2],[-13.2,9.2]] },
  { id: "SL", name: "Sierra Leone", institutions: ["West African Monetary Agency (Freetown)"], pts: [[-13.2,9.2],[-10.7,9.2],[-10.3,8.4],[-11.5,6.9],[-13.2,8]] },
  { id: "LR", name: "Liberia", institutions: [], pts: [[-11.5,6.9],[-10.3,8.4],[-9.5,8.5],[-8.2,7.6],[-7.5,4.4],[-9,5]] },
  { id: "CI", name: "Côte d’Ivoire", institutions: [], pts: [[-8.2,7.6],[-7.9,10.4],[-6.2,10.5],[-5.5,10.4],[-4.7,9.9],[-2.7,9.4],[-3.2,5.1],[-7.5,4.4]] },
  { id: "BF", name: "Burkina Faso", institutions: ["West African Health Organisation (Bobo-Dioulasso)", "ECOWAS Youth and Sports Development Centre (Ouagadougou)"], pts: [[-5.5,10.4],[-4.7,9.9],[-2.7,9.4],[-2.8,11],[-0.1,11],[0.9,11],[2.4,12.3],[0.9,13.2],[0.2,14.9],[-1.5,15],[-3.3,13.4],[-4.4,12.5],[-5.4,11.6]] },
  { id: "GH", name: "Ghana", institutions: ["ECOWAS Regional Electricity Regulatory Authority (Accra)", "West African Monetary Institute (Accra)"], pts: [[-3.2,5.1],[-2.7,9.4],[-2.8,11],[-0.1,11],[0.5,10],[0.6,6.2],[1.2,6.1],[-1.9,4.8]] },
  { id: "TG", name: "Togo", institutions: ["ECOWAS Bank for Investment and Development (Lomé)", "Regional Agency for Agriculture and Food (Lomé)"], pts: [[0.6,6.2],[0.5,10],[-0.1,11],[0.9,11],[1.6,9],[1.8,6.2]] },
  { id: "BJ", name: "Benin", institutions: ["West African Power Pool (Cotonou)"], pts: [[1.8,6.2],[1.6,9],[0.9,11],[2.4,12.3],[3.6,11.7],[3.8,10],[2.7,6.4]] },
  { id: "NG", name: "Nigeria", institutions: ["ECOWAS Commission (Abuja)", "ECOWAS Parliament (Abuja)", "Community Court of Justice (Abuja)", "Office of the Auditor General (Abuja)"], pts: [[2.7,6.4],[3.8,10],[3.6,11.7],[4.1,13.5],[6.5,13.6],[9,12.8],[12,13.3],[14.2,13],[14.6,11.5],[13.3,9.5],[12.2,8.4],[11.3,6.5],[9.5,6.4],[8.5,4.5],[6,4.3],[4.5,6.3]] },
];
const CABO_VERDE = { id: "CV", name: "Cabo Verde", institutions: ["ECOWAS Centre for Renewable Energy and Energy Efficiency (Praia)"] };
const ALL = [...COUNTRIES.map(({ id, name, institutions }) => ({ id, name, institutions })), CABO_VERDE].sort((a, b) => a.name.localeCompare(b.name));
const CV_ISLANDS: [number, number][] = [[-25,17],[-24.4,16.6],[-22.9,16.7],[-22.8,16.1],[-23.6,15.1],[-24.4,14.9]];

const X = (lon: number) => (lon + 26) * 22;
const Y = (lat: number) => (25.5 - lat) * 22;

export function WestAfricaMap() {
  const [hover, setHover] = useState<string | null>(null);
  const [sel, setSel] = useState<string>("NG");
  const refs = useRef<Record<string, SVGGElement | null>>({});
  const paths = useMemo(() => COUNTRIES.map((c) => ({ ...c, d: "M" + c.pts.map(([lo, la]) => `${X(lo).toFixed(1)},${Y(la).toFixed(1)}`).join("L") + "Z" })), []);
  const order = ALL.map((c) => c.id);
  const active = ALL.find((c) => c.id === (hover ?? sel))!;
  const selected = ALL.find((c) => c.id === sel)!;

  const onKey = (e: React.KeyboardEvent, id: string) => {
    const i = order.indexOf(id);
    let next: string | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = order[(i + 1) % order.length];
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = order[(i - 1 + order.length) % order.length];
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(id); }
    if (next) { e.preventDefault(); refs.current[next]?.focus(); }
  };
  const fill = (id: string) => id === sel ? "hsl(var(--ecowas-green))" : id === hover ? "hsl(var(--ecowas-green) / 0.55)" : "hsl(var(--ecowas-ocean) / 0.12)";
  const common = (id: string, name: string) => ({
    ref: (el: SVGGElement | null) => { refs.current[id] = el; },
    tabIndex: 0, role: "button" as const, "aria-pressed": sel === id, "aria-label": name,
    onMouseEnter: () => setHover(id), onMouseLeave: () => setHover(null), onFocus: () => setHover(id), onBlur: () => setHover(null),
    onClick: () => setSel(id), onKeyDown: (e: React.KeyboardEvent) => onKey(e, id), className: "map-country focus-visible:[&>*]:stroke-ecowas-yellow",
  });

  return (
    <section aria-labelledby="home-map" className="py-section-lg">
      <Container>
        <p className="overline text-primary">03 · Across the region</p>
        <h2 id="home-map" className="mt-3 max-w-3xl font-display text-h1">Twelve member states. One audit mandate.</h2>
        <p className="mt-3 max-w-2xl text-small text-muted-foreground">Select a country — or tab in and use the arrow keys — to see the Community institutions hosted there.</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div className="relative border border-border bg-card p-3">
            <svg viewBox="0 0 900 470" className="h-auto w-full" role="group" aria-label="Map of ECOWAS member states">
              <defs><pattern id="sea" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="hsl(var(--ecowas-ocean) / 0.12)" /></pattern></defs>
              <rect width="900" height="470" fill="url(#sea)" />
              {paths.map((c) => (
                <g key={c.id} {...common(c.id, c.name)}>
                  <path d={c.d} fill={fill(c.id)} stroke="hsl(var(--background))" strokeWidth={1.5} strokeLinejoin="round" />
                </g>
              ))}
              <g {...common("CV", "Cabo Verde")}>
                <rect x={X(-25.6)} y={Y(17.6)} width={X(-22.3) - X(-25.6)} height={Y(14.4) - Y(17.6)} fill="transparent" stroke="hsl(var(--border))" strokeDasharray="3 3" />
                {CV_ISLANDS.map(([lo, la], i) => <circle key={i} cx={X(lo)} cy={Y(la)} r={5} fill={fill("CV")} />)}
              </g>
            </svg>
            <p className="pointer-events-none absolute left-5 top-5 bg-background/90 px-3 py-1.5 font-display text-h4 shadow-raised" aria-hidden>{active.name}</p>
            <p className="mt-2 text-xs text-muted-foreground">Simplified outlines for orientation only.</p>
          </div>
          <div aria-live="polite" className="border-l-4 border-ecowas-green bg-surface-sunken p-6">
            <p className="overline flex items-center gap-2 text-primary"><MapPin className="size-4" aria-hidden />Selected</p>
            <h3 className="mt-2 font-display text-h2">{selected.name}</h3>
            {selected.institutions.length ? (
              <ul className="mt-5 grid gap-3">
                {selected.institutions.map((x, i) => <li key={x} className="flex gap-3 border-b border-border pb-3 text-small animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}><span className="font-mono text-xs text-primary">0{i + 1}</span>{x}</li>)}
              </ul>
            ) : <p className="mt-5 text-small text-muted-foreground">No Community institution is headquartered here. Community programmes and offices operating in {selected.name} can still fall within the Office’s audit mandate.</p>}
            <p className="mt-6 text-xs text-muted-foreground">Host locations are shown for orientation and should be confirmed against official ECOWAS sources.</p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {ALL.map((c) => <button key={c.id} type="button" onClick={() => setSel(c.id)} aria-pressed={sel === c.id} className={cn("min-h-8 border px-2 text-xs transition-colors", sel === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary")}>{c.name}</button>)}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
