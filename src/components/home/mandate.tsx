import { useState } from "react";
import { FileSearch, Search, ClipboardCheck, RefreshCcw, BadgeCheck, Megaphone, Plus } from "lucide-react";
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
    <section aria-labelledby="home-functions" className="border-y border-border bg-surface-sunken py-section">
      <Container>
        <p className="overline text-primary">02 · What OAG does</p>
        <h2 id="home-functions" className="mt-3 font-display text-h1">Six core functions</h2>
        <p className="mt-3 max-w-xl text-small text-muted-foreground">Hover or select a function to see what it involves.</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, t, d, more, tone, text }, i) => {
            const isOpen = open === i;
            return (
              <li key={t} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}
                  className="group relative flex h-full min-h-[15rem] w-full flex-col overflow-hidden border border-border bg-card p-6 text-left transition-shadow duration-base hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className={cn("absolute inset-0 origin-bottom transition-transform duration-slow ease-out", tone, isOpen ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100")} aria-hidden />
                  <span className={cn("absolute inset-x-0 top-0 h-1.5", tone)} aria-hidden />
                  <span className={cn("relative flex items-start justify-between transition-colors duration-base", isOpen ? text : cn("text-ink", text === "text-ink" ? "" : "group-hover:text-primary-foreground"))}>
                    <span className="font-mono text-xs opacity-70">0{i + 1}</span>
                    <Plus className={cn("size-5 transition-transform duration-base", isOpen && "rotate-45")} aria-hidden />
                  </span>
                  <span className={cn("relative mt-auto transition-colors duration-base", isOpen ? text : cn("text-ink", text === "text-ink" ? "" : "group-hover:text-primary-foreground"))}>
                    <Icon className="size-7" aria-hidden />
                    <span className="mt-4 block font-display text-h3">{t}</span>
                    <span className="mt-1 block text-small opacity-80">{isOpen ? more : d}</span>
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
