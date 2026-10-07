import { useRef, useState } from "react";
import { FileSearch, Search, ClipboardCheck, RefreshCcw, BadgeCheck, Megaphone, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ds/primitives";
import { Container } from "@/components/ds/shell/layout-parts";
import { cn } from "@/lib/utils";

const ITEMS = [
  { icon: FileSearch, t: "Audit", d: "Financial, compliance and performance audits.", more: "Examines financial statements, compliance with Community rules and whether programmes deliver value for money.", tone: "bg-ecowas-lime", text: "text-ink" },
  { icon: Search, t: "Investigate", d: "Matters within the Office’s mandate.", more: "Looks into allegations of fraud, waste or misconduct involving Community resources, following due process.", tone: "bg-ecowas-orange", text: "text-ink" },
  { icon: ClipboardCheck, t: "Recommend", d: "Practical actions to strengthen institutions.", more: "Turns evidence into specific, actionable recommendations agreed with each institution.", tone: "bg-ecowas-sky", text: "text-ink" },
  { icon: RefreshCcw, t: "Follow up", d: "Track how recommendations are implemented.", more: "Monitors every recommendation from issue to implementation and reports on progress.", tone: "bg-ecowas-ocean", text: "text-primary-foreground" },
  { icon: BadgeCheck, t: "Verify", d: "Confirm corrective action is effective.", more: "Tests that actions reported as complete have genuinely resolved the underlying issue.", tone: "bg-ecowas-green", text: "text-primary-foreground" },
  { icon: Megaphone, t: "Inform", d: "Publish approved findings and reports.", more: "Shares findings cleared for public release so citizens and partners can follow the record.", tone: "bg-ecowas-brown", text: "text-primary-foreground" },
];

export function MandateGrid() {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const scroll = (dir: number) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector("li"); const w = card ? card.getBoundingClientRect().width + 12 : el.clientWidth;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };
  return (
    <section id="mission" aria-labelledby="home-functions" className="relative overflow-hidden border-y border-border bg-surface-sunken py-section">
      <div className="absolute inset-x-0 top-0 h-1.5 band" aria-hidden />
      <Container>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div className="reveal">
            <p className="overline flex items-center gap-3 text-primary"><span className="h-px w-10 bg-primary" aria-hidden />The Office &amp; what we do</p>
            <h2 id="home-functions" className="mt-3 font-display text-h1">Independent assurance, from evidence to public trust.</h2>
          </div>
          <div className="reveal">
            <p className="text-small text-ink-soft">The Office of the Auditor General supports accountability, good corporate governance and value for money across ECOWAS Institutions.</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button asChild variant="secondary" size="sm"><Link to="/about">Discover the Office <ArrowRight /></Link></Button>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="icon" aria-label="Previous functions" onClick={() => scroll(-1)}><ChevronLeft /></Button>
                <Button type="button" variant="secondary" size="icon" aria-label="Next functions" onClick={() => scroll(1)}><ChevronRight /></Button>
              </div>
            </div>
          </div>
        </div>
        <ul ref={track} aria-label="Six core functions" className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ITEMS.map(({ icon: Icon, t, d, more, tone, text }, i) => {
            const on = active === i;
            return (
              <li key={t} className="w-[70%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/3)] lg:w-[calc((100%-2.25rem)/4)]">
                <button type="button" aria-pressed={on} onClick={() => setActive(on ? null : i)} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
                  className="group relative flex h-64 w-full flex-col overflow-hidden border border-border bg-card p-5 text-left transition-transform duration-base hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className={cn("absolute inset-0 origin-bottom transition-transform duration-slow ease-out", tone, on ? "scale-y-100" : "scale-y-0")} aria-hidden />
                  <span className={cn("absolute inset-x-0 top-0 h-1", tone)} aria-hidden />
                  <span className={cn("relative flex items-center justify-between transition-colors", on ? text : "text-ink")}>
                    <Icon className="size-7" aria-hidden /><span className="font-mono text-xs opacity-70">0{i + 1}/06</span>
                  </span>
                  <span className={cn("relative mt-auto block transition-colors", on ? text : "text-ink")}>
                    <span className="block font-display text-h3">{t}</span>
                    <span className="mt-1 block text-small opacity-80">{on ? more : d}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
