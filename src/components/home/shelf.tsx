import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { Button, Badge } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { publications } from "@/lib/home-data";
import { cn } from "@/lib/utils";

const coverTone = { ocean: "bg-ecowas-ocean", green: "bg-ecowas-green", brown: "bg-ecowas-brown", slate: "bg-ecowas-slate" };

function Cover({ p }: { p: typeof publications[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const move = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={cn("relative flex aspect-[3/4] flex-col justify-between p-5 text-primary-foreground shadow-raised transition-transform duration-base ease-out will-change-transform", coverTone[p.tone])}>
      <span className="absolute inset-y-0 left-0 w-2 bg-ink/20" aria-hidden />
      <div className="flex justify-between text-xs uppercase tracking-[0.12em] text-primary-foreground/80"><span>OAG</span><span>{p.year}</span></div>
      <div><span className="block h-1 w-10 bg-ecowas-yellow" aria-hidden /><h3 className="mt-4 font-display text-h3 leading-tight text-primary-foreground">{p.title}</h3></div>
      <p className="text-xs text-primary-foreground/75">{p.institution}</p>
    </div>
  );
}

export function PublicationsShelf() {
  const rail = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  useEffect(() => {
    const el = rail.current; if (!el) return;
    const on = () => setProg(el.scrollWidth > el.clientWidth ? el.scrollLeft / (el.scrollWidth - el.clientWidth) : 1);
    on(); el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);
  return (
    <section aria-labelledby="home-pubs" className="border-y border-border bg-surface-sunken py-section">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="overline text-primary">Publications</p><h2 id="home-pubs" className="mt-3 font-display text-h1">Reports that shape the record.</h2></div>
          <Button asChild variant="secondary" size="sm"><Link to="/publications">View all publications <ArrowRight /></Link></Button>
        </div>
      </Container>
      <div ref={rail} tabIndex={0} aria-label="Publications, scroll horizontally"
        onPointerDown={(e) => { if (e.pointerType !== "mouse" || !rail.current) return; drag.current = { x: e.clientX, left: rail.current.scrollLeft, moved: false }; }}
        onPointerMove={(e) => { const d = drag.current; if (!d || !rail.current) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 4) { d.moved = true; rail.current.style.scrollSnapType = "none"; } rail.current.scrollLeft = d.left - dx; }}
        onPointerUp={() => { if (rail.current) rail.current.style.scrollSnapType = ""; setTimeout(() => (drag.current = null), 0); }}
        onPointerLeave={() => { if (rail.current) rail.current.style.scrollSnapType = ""; drag.current = null; }}
        onClickCapture={(e) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); } }}
        className="mt-6 cursor-grab snap-x snap-mandatory overflow-x-auto pb-6 active:cursor-grabbing [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden">
        <ul className="mx-auto flex w-max select-none gap-6 px-5 md:px-8 xl:px-[max(3rem,calc((100vw-82rem)/2+3rem))]">
          {publications.map((p, i) => (
            <li key={p.title} className="reveal w-[15rem] shrink-0 snap-start md:w-[17rem]" style={{ transitionDelay: `${i * 80}ms` }}>
              <article>
                <Cover p={p} />
                <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground"><Badge tone="brown">{p.type}</Badge><span>{p.language}</span></div>
                <div className="mt-3 flex gap-4 text-small font-semibold text-primary">
                  <Link to="/publications/reports" draggable={false} className="hover:underline">View</Link>
                  <button type="button" className="inline-flex items-center gap-1 hover:underline" aria-label={`Download ${p.title}`}><Download className="size-4" aria-hidden />PDF</button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <Container>
        <div className="h-1 bg-border" role="progressbar" aria-label="Position in publications rail" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(prog * 100)}>
          <div className="h-full band origin-left transition-transform duration-fast" style={{ transform: `scaleX(${Math.max(0.08, prog)})` }} />
        </div>
      </Container>
    </section>
  );
}
