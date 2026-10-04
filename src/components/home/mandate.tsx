import { useState } from "react";
import { FileSearch, Search, ClipboardCheck, RefreshCcw, BadgeCheck, Megaphone, Plus, ArrowRight, ShieldCheck } from "lucide-react";
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
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="mission" aria-labelledby="home-functions" className="relative overflow-hidden border-y border-border bg-surface-sunken py-section-lg">
      <div className="absolute inset-x-0 top-0 h-1.5 band" aria-hidden />
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <p className="overline flex items-center gap-3 text-primary"><span className="h-px w-10 bg-primary" aria-hidden />03 · The Office &amp; what we do</p>
            <h2 id="home-functions" className="mt-4 font-display text-h1">Independent assurance, from evidence to public trust.</h2>
            <p className="mt-6 text-lead text-ink-soft">The Office of the Auditor General supports accountability, good corporate governance and value for money across ECOWAS Institutions.</p>
            <div className="mt-8 border-l-2 border-ecowas-yellow pl-5">
              <ShieldCheck className="size-6 text-primary" aria-hidden />
              <p className="mt-3 text-small text-muted-foreground">We examine how Community resources are used, turn findings into practical recommendations and verify that corrective action works.</p>
            </div>
            <Button asChild variant="secondary" className="mt-8"><Link to="/about">Discover the Office <ArrowRight /></Link></Button>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
              <div><p className="overline text-primary">Six core functions</p><h3 className="mt-2 font-display text-h2">How assurance moves.</h3></div>
              <p className="max-w-xs text-small text-muted-foreground">Select a function to explore its role in the assurance cycle.</p>
            </div>
            <ul className="grid border-b border-border sm:grid-cols-2">
              {ITEMS.map(({ icon: Icon, t, d, more, tone, text }, i) => {
                const isOpen = open === i;
                return (
                  <li key={t} className="reveal border-x border-t border-border sm:odd:border-r-0" style={{ transitionDelay: `${i * 70}ms` }}>
                    <Button variant="ghost" type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}
                      className="group relative flex h-full min-h-[13rem] w-full flex-col items-stretch justify-start overflow-hidden rounded-none bg-card p-6 text-left whitespace-normal hover:bg-card">
                      <span className={cn("absolute inset-0 origin-bottom transition-transform duration-slow ease-out", tone, isOpen ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100")} aria-hidden />
                      <span className={cn("absolute inset-x-0 top-0 h-1", tone)} aria-hidden />
                      <span className={cn("relative flex w-full items-start justify-between transition-colors duration-base", isOpen ? text : cn("text-ink", text === "text-ink" ? "" : "group-hover:text-primary-foreground"))}>
                        <span className="font-mono text-xs opacity-70">0{i + 1}</span>
                        <Plus className={cn("size-5 transition-transform duration-base", isOpen && "rotate-45")} aria-hidden />
                      </span>
                      <span className={cn("relative mt-auto block w-full transition-colors duration-base", isOpen ? text : cn("text-ink", text === "text-ink" ? "" : "group-hover:text-primary-foreground"))}>
                        <Icon className="size-7" aria-hidden />
                        <span className="mt-4 block font-display text-h3">{t}</span>
                        <span className="mt-1 block text-small font-normal opacity-80">{isOpen ? more : d}</span>
                      </span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
